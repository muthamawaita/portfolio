import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().min(1).optional(),
  AUTH_SECRET: z.string().min(1).optional(),
  JWT_SECRET: z.string().min(1).optional(),
  JWT_EXPIRES_IN: z.string().default("7d"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  EMAIL_FROM: z.string().email().optional(),
  RESEND_API_KEY: z.string().optional(),
  REDIS_URL: z.string().optional(),
  STORAGE_PROVIDER: z.enum(["local", "s3", "r2"]).default("local"),
  MPESA_CONSUMER_KEY: z.string().optional(),
  MPESA_CONSUMER_SECRET: z.string().optional(),
  MPESA_ENVIRONMENT: z.enum(["sandbox", "production"]).default("sandbox"),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  PAYPAL_CLIENT_ID: z.string().optional(),
  PAYPAL_CLIENT_SECRET: z.string().optional(),
  CONTACT_NOTIFICATION_EMAIL: z.string().email().optional(),
});

export type AppConfig = z.infer<typeof envSchema>;

export const config = envSchema.parse(process.env);

export const appConfig = {
  isProduction: config.NODE_ENV === "production",
  isDevelopment: config.NODE_ENV === "development",
  database: {
    url: config.DATABASE_URL,
  },
  auth: {
    secret: config.AUTH_SECRET ?? config.JWT_SECRET,
    jwtExpiresIn: config.JWT_EXPIRES_IN,
  },
  email: {
    from: config.EMAIL_FROM,
    resendApiKey: config.RESEND_API_KEY,
  },
  redis: {
    url: config.REDIS_URL,
  },
  storage: {
    provider: config.STORAGE_PROVIDER,
  },
  mpesa: {
    consumerKey: config.MPESA_CONSUMER_KEY,
    consumerSecret: config.MPESA_CONSUMER_SECRET,
    environment: config.MPESA_ENVIRONMENT,
  },
  payments: {
    stripeSecretKey: config.STRIPE_SECRET_KEY,
    stripeWebhookSecret: config.STRIPE_WEBHOOK_SECRET,
    paypalClientId: config.PAYPAL_CLIENT_ID,
    paypalClientSecret: config.PAYPAL_CLIENT_SECRET,
  },
  app: {
    url: config.NEXT_PUBLIC_APP_URL,
  },
};

export function requireConfigValue(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`${name} must be set via environment variables or a secrets manager.`);
  }

  return value;
}
