import { randomUUID } from "node:crypto";
import { db } from "@/server/db";

export type PaymentProvider = "stripe" | "paypal" | "mpesa";
export type BillingPlan = "QUARTERLY" | "HALF_YEAR" | "ANNUAL";
export type PaymentRequest = { provider: PaymentProvider; email: string; tenantSlug: string; tenantId: string; phone?: string; plan: BillingPlan };
export type PaymentResult = { ok: true; redirectUrl?: string; reference?: string } | { ok: false; message: string };
const mpesaPlans: Record<BillingPlan, { amount: number; months: number }> = { QUARTERLY: { amount: 1500, months: 3 }, HALF_YEAR: { amount: 2700, months: 6 }, ANNUAL: { amount: 4800, months: 12 } };

function paypalBaseUrl() { return process.env.PAYPAL_ENVIRONMENT === "production" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com"; }
function mpesaBaseUrl() { return process.env.MPESA_ENVIRONMENT === "production" ? "https://api.safaricom.co.ke" : "https://sandbox.safaricom.co.ke"; }

async function createStripeCheckout(request: PaymentRequest): Promise<PaymentResult> {
  const secret = process.env.STRIPE_SECRET_KEY;
  const price = process.env.STRIPE_PRICE_ID;
  if (!secret || !price) return { ok: false, message: "Stripe is not configured. Add STRIPE_SECRET_KEY and STRIPE_PRICE_ID." };
  const body = new URLSearchParams({ mode: "subscription", customer_email: request.email, "line_items[0][price]": price, "line_items[0][quantity]": "1", success_url: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding/success`, cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`, "metadata[tenantSlug]": request.tenantSlug, "metadata[billingPeriod]": request.plan });
  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", { method: "POST", headers: { Authorization: `Basic ${Buffer.from(`${secret}:`).toString("base64")}`, "Content-Type": "application/x-www-form-urlencoded" }, body });
  if (!response.ok) return { ok: false, message: "Stripe could not create a checkout session." };
  const session = await response.json() as { url?: string; id?: string };
  return { ok: true, redirectUrl: session.url, reference: session.id };
}

async function createPaypalCheckout(request: PaymentRequest): Promise<PaymentResult> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !clientSecret) return { ok: false, message: "PayPal is not configured. Add PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET." };
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const tokenResponse = await fetch(`${paypalBaseUrl()}/v1/oauth2/token`, { method: "POST", headers: { Authorization: `Basic ${credentials}`, "Content-Type": "application/x-www-form-urlencoded" }, body: "grant_type=client_credentials" });
  if (!tokenResponse.ok) return { ok: false, message: "PayPal authentication failed." };
  const token = await tokenResponse.json() as { access_token: string };
  const orderResponse = await fetch(`${paypalBaseUrl()}/v2/checkout/orders`, { method: "POST", headers: { Authorization: `Bearer ${token.access_token}`, "Content-Type": "application/json" }, body: JSON.stringify({ intent: "CAPTURE", purchase_units: [{ reference_id: request.tenantSlug, description: "Jeremiah Muthama Waita professional portfolio plan", amount: { currency_code: "USD", value: "50.00" } }], application_context: { user_action: "PAY_NOW", return_url: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding/success`, cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing` } }) });
  if (!orderResponse.ok) return { ok: false, message: "PayPal could not create an order." };
  const order = await orderResponse.json() as { id: string; links?: Array<{ rel: string; href: string }> };
  return { ok: true, redirectUrl: order.links?.find((link) => link.rel === "approve")?.href, reference: order.id };
}

async function createMpesaCheckout(request: PaymentRequest): Promise<PaymentResult> {
  const { MPESA_CONSUMER_KEY: key, MPESA_CONSUMER_SECRET: secret, MPESA_SHORTCODE: shortcode, MPESA_PASSKEY: passkey, MPESA_CALLBACK_URL: callback } = process.env;
  const missing = [!key && "consumer key", !secret && "consumer secret", !shortcode && "shortcode", !passkey && "passkey", !callback && "callback URL"].filter(Boolean);
  if (missing.length) return { ok: false, message: `M-Pesa is not ready. Missing: ${missing.join(", ")}. Get the shortcode and passkey from Safaricom Daraja before accepting payments.` };
  const phone = request.phone?.replace(/\s|-/g, "").replace(/^0/, "254");
  if (!phone || !/^2547\d{8}$/.test(phone)) return { ok: false, message: "Enter a valid Kenyan M-Pesa number in the format 2547XXXXXXXX." };
  const tokenResponse = await fetch(`${mpesaBaseUrl()}/oauth/v1/generate?grant_type=client_credentials`, { headers: { Authorization: `Basic ${Buffer.from(`${key}:${secret}`).toString("base64")}` } });
  if (!tokenResponse.ok) return { ok: false, message: "M-Pesa authentication failed." };
  const token = await tokenResponse.json() as { access_token: string };
  const timestamp = new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);
  const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");
  const plan = mpesaPlans[request.plan];
  const response = await fetch(`${mpesaBaseUrl()}/mpesa/stkpush/v1/processrequest`, { method: "POST", headers: { Authorization: `Bearer ${token.access_token}`, "Content-Type": "application/json" }, body: JSON.stringify({ BusinessShortCode: shortcode, Password: password, Timestamp: timestamp, TransactionType: "CustomerPayBillOnline", Amount: plan.amount, PartyA: phone, PartyB: shortcode, PhoneNumber: phone, CallBackURL: callback, AccountReference: request.tenantSlug, TransactionDesc: `Jeremiah Muthama Waita ${plan.months}-month plan` }) });
  if (!response.ok) return { ok: false, message: "M-Pesa could not start the payment request." };
  const result = await response.json() as { ResponseCode?: string; CheckoutRequestID?: string; ResponseDescription?: string };
  if (result.ResponseCode !== "0") return { ok: false, message: result.ResponseDescription ?? "M-Pesa rejected the payment request." };
  const reference = result.CheckoutRequestID ?? randomUUID();
  await db.payment.create({ data: { tenantId: request.tenantId, provider: "MPESA", providerPaymentId: reference, amountCents: plan.amount * 100, currency: "KES", status: "PENDING" } });
  await db.subscription.update({ where: { tenantId: request.tenantId }, data: { plan: request.plan, status: "PENDING" } });
  return { ok: true, reference };
}

export async function createProviderCheckout(request: PaymentRequest): Promise<PaymentResult> {
  if (request.provider === "stripe") return createStripeCheckout(request);
  if (request.provider === "paypal") return createPaypalCheckout(request);
  return createMpesaCheckout(request);
}
