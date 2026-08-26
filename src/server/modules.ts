export const authModule = {
  register: async function registerUser(input: Record<string, unknown>) {
    return { ok: true, data: input };
  },
  login: async function loginUser(input: Record<string, unknown>) {
    return { ok: true, data: input };
  },
  logout: async function logoutUser() {
    return { ok: true };
  },
  verifyEmail: async function verifyEmailToken() {
    return { ok: true };
  },
  resetPassword: async function resetPasswordToken() {
    return { ok: true };
  },
};

export const userModule = {
  create: async function createUser(input: Record<string, unknown>) {
    return { ok: true, data: input };
  },
  get: async function getUser() {
    return { ok: true };
  },
  update: async function updateUser() {
    return { ok: true };
  },
  setStatus: async function setUserStatus() {
    return { ok: true };
  },
};

export const profileModule = {
  update: async function updateProfile(input: Record<string, unknown>) {
    return { ok: true, data: input };
  },
  get: async function getProfile() {
    return { ok: true };
  },
};

export const portfolioModule = {
  create: async function createPortfolio(input: Record<string, unknown>) {
    return { ok: true, data: input };
  },
  update: async function updatePortfolio() {
    return { ok: true };
  },
  publish: async function publishPortfolio() {
    return { ok: true, publishedAt: new Date().toISOString() };
  },
  render: function renderPortfolio(input: { profile?: { name?: string }; template?: { id?: string }; theme?: { primary?: string } }) {
    return {
      title: input.profile?.name ?? "Portfolio",
      templateId: input.template?.id ?? "default",
      theme: input.theme ?? { primary: "#111111" },
    };
  },
};

export const storageModule = {
  upload: async function uploadStorage(input: {
    key: string;
    fileName: string;
    size: number;
    mimeType: string;
    provider?: "local" | "s3" | "r2" | "spaces";
  }) {
    const provider = input.provider ?? "local";
    const key = input.key.trim() || `uploads/${input.fileName}`;
    const url = `/${provider}/${key.replace(/^\/+/, "")}`;

    return {
      ok: true,
      provider,
      key,
      fileName: input.fileName,
      size: input.size,
      mimeType: input.mimeType,
      url,
    };
  },
  delete: async function deleteStorage(key: string) {
    return { ok: true, deleted: true, key };
  },
  getUrl: function getStorageUrl(key: string, provider: "local" | "s3" | "r2" | "spaces" = "local") {
    return `/${provider}/${key.replace(/^\/+/, "")}`;
  },
};

export const serviceModule = {
  create: async function createService(input: {
    id?: string;
    name: string;
    description?: string;
    category?: string;
    basePrice: number;
    currency?: string;
    availability?: string;
    packages?: Array<Record<string, unknown>>;
  }) {
    const id = input.id ?? `svc_${Math.random().toString(36).slice(2, 10)}`;

    return {
      ok: true,
      service: {
        id,
        name: input.name,
        description: input.description ?? "",
        category: input.category ?? "General",
        basePrice: input.basePrice,
        currency: input.currency ?? "KES",
        availability: input.availability ?? "Open",
        packages: input.packages ?? [],
      },
    };
  },
  update: async function updateService(id: string, input: Partial<Record<string, unknown>>) {
    return { ok: true, id, service: { id, ...input } };
  },
  list: async function listServices() {
    return { ok: true, services: [] };
  },
};

const ORDER_TRANSITIONS: Record<string, string[]> = {
  pending_payment: ["paid", "cancelled"],
  paid: ["processing", "cancelled"],
  processing: ["assigned", "cancelled"],
  assigned: ["in_progress", "cancelled"],
  in_progress: ["submitted", "cancelled"],
  submitted: ["awaiting_review", "revision_requested", "cancelled"],
  awaiting_review: ["completed", "revision_requested", "cancelled"],
  revision_requested: ["submitted", "cancelled"],
  completed: ["refunded"],
  cancelled: [],
  refunded: [],
};

const orderStore = new Map<string, any>();

export const orderModule = {
  create: async function createOrder(input: {
    id?: string;
    customerId: string;
    serviceId: string;
    packageId: string;
    total: number;
    currency?: string;
    status?: string;
  }) {
    const id = input.id ?? `ord_${Math.random().toString(36).slice(2, 10)}`;
    const status = input.status ?? "pending_payment";
    const order = {
      id,
      customerId: input.customerId,
      serviceId: input.serviceId,
      packageId: input.packageId,
      total: input.total,
      currency: input.currency ?? "KES",
      status,
      assigneeId: null,
    };

    orderStore.set(id, order);

    return { ok: true, order };
  },
  validateTransition: function validateOrderTransition(currentStatus: string, nextStatus: string) {
    const allowed = ORDER_TRANSITIONS[currentStatus] ?? [];
    if (!allowed.includes(nextStatus)) {
      throw new Error(`Invalid order status transition from ${currentStatus} to ${nextStatus}.`);
    }
    return true;
  },
  pay: async function payOrder(orderId: string, payment: { provider: string; reference: string }) {
    const current = await orderModule.get(orderId);
    if (!current.ok || !current.order) {
      throw new Error(`Order ${orderId} not found.`);
    }
    orderModule.validateTransition(current.order.status, "paid");
    const order = { ...current.order, status: "paid", paymentProvider: payment.provider, paymentReference: payment.reference };
    orderStore.set(orderId, order);
    return { ok: true, order, payment };
  },
  assign: async function assignOrder(orderId: string, staffId: string) {
    const current = await orderModule.get(orderId);
    if (!current.ok || !current.order) {
      throw new Error(`Order ${orderId} not found.`);
    }
    const nextStatus = current.order.status === "paid" ? "processing" : current.order.status;
    orderModule.validateTransition(current.order.status, nextStatus);
    const order = { ...current.order, status: nextStatus, assigneeId: staffId };
    orderStore.set(orderId, order);
    return { ok: true, order };
  },
  start: async function startOrder(orderId: string) {
    const current = await orderModule.get(orderId);
    if (!current.ok || !current.order) {
      throw new Error(`Order ${orderId} not found.`);
    }
    orderModule.validateTransition(current.order.status, "in_progress");
    const order = { ...current.order, status: "in_progress" };
    orderStore.set(orderId, order);
    return { ok: true, order };
  },
  submit: async function submitOrder(orderId: string) {
    const current = await orderModule.get(orderId);
    if (!current.ok || !current.order) {
      throw new Error(`Order ${orderId} not found.`);
    }
    orderModule.validateTransition(current.order.status, "submitted");
    const order = { ...current.order, status: "submitted" };
    orderStore.set(orderId, order);
    return { ok: true, order };
  },
  revise: async function reviseOrder(orderId: string) {
    const current = await orderModule.get(orderId);
    if (!current.ok || !current.order) {
      throw new Error(`Order ${orderId} not found.`);
    }
    orderModule.validateTransition(current.order.status, "revision_requested");
    const order = { ...current.order, status: "revision_requested" };
    orderStore.set(orderId, order);
    return { ok: true, order };
  },
  complete: async function completeOrder(orderId: string) {
    const current = await orderModule.get(orderId);
    if (!current.ok || !current.order) {
      throw new Error(`Order ${orderId} not found.`);
    }
    orderModule.validateTransition(current.order.status, "completed");
    const order = { ...current.order, status: "completed" };
    orderStore.set(orderId, order);
    return { ok: true, order };
  },
  cancel: async function cancelOrder(orderId: string) {
    const current = await orderModule.get(orderId);
    if (!current.ok || !current.order) {
      throw new Error(`Order ${orderId} not found.`);
    }
    orderModule.validateTransition(current.order.status, "cancelled");
    const order = { ...current.order, status: "cancelled" };
    orderStore.set(orderId, order);
    return { ok: true, order };
  },
  refund: async function refundOrder(orderId: string, reason?: string) {
    const current = await orderModule.get(orderId);
    if (!current.ok || !current.order) {
      throw new Error(`Order ${orderId} not found.`);
    }
    orderModule.validateTransition(current.order.status, "refunded");
    const order = { ...current.order, status: "refunded" };
    orderStore.set(orderId, order);
    return { ok: true, order, reason: reason ?? "Customer requested refund" };
  },
  get: async function getOrder(orderId: string) {
    if (orderId === "missing-order") {
      return { ok: false, order: null };
    }

    const order = orderStore.get(orderId);
    if (!order) {
      return { ok: false, order: null };
    }

    return { ok: true, order };
  },
};

export const paymentModule = {
  createProvider: function createProvider(name: "mpesa" | "stripe" | "paypal") {
    return {
      provider: name,
      name: name.toUpperCase(),
      supports: ["checkout", "refund", "query"],
    };
  },
  createCheckout: async function createCheckout(input: { provider: string; customerId: string; orderId: string; amount: number; currency: string }) {
    return {
      ok: true,
      provider: input.provider,
      orderId: input.orderId,
      customerId: input.customerId,
      amount: input.amount,
      currency: input.currency,
      status: "pending",
      reference: `${input.provider.toUpperCase()}-${Date.now()}`,
    };
  },
  confirm: async function confirmPayment(provider: string, reference: string, verified: boolean) {
    if (!verified) {
      return { ok: true, status: "pending", provider, reference, confirmed: false };
    }
    return { ok: true, status: "confirmed", provider, reference, confirmed: true };
  },
};

export const mpesaModule = {
  auth: async function obtainAuthToken() {
    return { ok: true, token: "mpesa-token", expiresAt: new Date(Date.now() + 3600_000).toISOString() };
  },
  stk: async function initiateStkPush(input: { phone: string; amount: number; accountReference: string }) {
    return {
      ok: true,
      provider: "mpesa",
      requestId: `MPESA-${Date.now()}`,
      phone: input.phone,
      amount: input.amount,
      accountReference: input.accountReference,
      status: "pending",
    };
  },
  query: async function queryTransaction(reference: string) {
    return { ok: true, reference, status: "pending" };
  },
  callback: async function handleCallback(input: { resultCode?: string; resultDesc?: string; checkoutRequestId?: string; mpesaReceiptNumber?: string; amount?: number; verified?: boolean }) {
    const verified = input.verified ?? false;
    if (!verified) {
      return { ok: true, confirmed: false, status: "pending", provider: "mpesa", resultCode: input.resultCode ?? "pending", resultDesc: input.resultDesc ?? "Awaiting backend confirmation" };
    }
    if (input.resultCode === "0") {
      return { ok: true, confirmed: true, status: "confirmed", provider: "mpesa", checkoutRequestId: input.checkoutRequestId, mpesaReceiptNumber: input.mpesaReceiptNumber, amount: input.amount ?? 0 };
    }
    return { ok: true, confirmed: false, status: "failed", provider: "mpesa", resultCode: input.resultCode ?? "1", resultDesc: input.resultDesc ?? "Payment rejected by provider" };
  },
};

const transactionStore = new Map<string, any>();

export const transactionModule = {
  create: async function createTransaction(input: { id?: string; gateway: string; gatewayReference: string; amount: number; currency: string; customerId: string; orderId: string; status?: string }) {
    const id = input.id ?? `txn_${Math.random().toString(36).slice(2, 10)}`;
    const transaction = {
      id,
      gateway: input.gateway,
      gatewayReference: input.gatewayReference,
      amount: input.amount,
      currency: input.currency,
      customerId: input.customerId,
      orderId: input.orderId,
      status: input.status ?? "pending",
      createdAt: new Date().toISOString(),
      completedAt: null,
    };
    transactionStore.set(id, transaction);
    return { ok: true, transaction };
  },
  updateStatus: async function updateTransactionStatus(id: string, status: string, completedAt?: string) {
    const txn = transactionStore.get(id);
    if (!txn) {
      throw new Error(`Transaction ${id} not found.`);
    }
    const transaction = { ...txn, status, completedAt: completedAt ?? (status === "completed" ? new Date().toISOString() : null) };
    transactionStore.set(id, transaction);
    return { ok: true, transaction };
  },
  get: async function getTransaction(id: string) {
    const transaction = transactionStore.get(id);
    return transaction ? { ok: true, transaction } : { ok: false, transaction: null };
  },
};

const refundStore = new Map<string, any>();

export const refundModule = {
  create: async function createRefund(input: { id?: string; paymentId: string; orderId: string; reason: string; amount: number; currency: string; actorId: string }) {
    const id = input.id ?? `ref_${Math.random().toString(36).slice(2, 10)}`;
    const refund = {
      id,
      paymentId: input.paymentId,
      orderId: input.orderId,
      reason: input.reason,
      amount: input.amount,
      currency: input.currency,
      actorId: input.actorId,
      status: "requested",
      createdAt: new Date().toISOString(),
      auditLog: [{ action: "refund_requested", actorId: input.actorId, timestamp: new Date().toISOString() }],
    };
    refundStore.set(id, refund);
    return { ok: true, refund };
  },
  approve: async function approveRefund(id: string, actorId: string) {
    const refund = refundStore.get(id);
    if (!refund) {
      throw new Error(`Refund ${id} not found.`);
    }
    const updated = {
      ...refund,
      status: "approved",
      auditLog: [...refund.auditLog, { action: "refund_approved", actorId, timestamp: new Date().toISOString() }],
    };
    refundStore.set(id, updated);
    return { ok: true, refund: updated };
  },
  process: async function processRefund(id: string) {
    const refund = refundStore.get(id);
    if (!refund) {
      throw new Error(`Refund ${id} not found.`);
    }
    const updated = { ...refund, status: "processed", processedAt: new Date().toISOString() };
    refundStore.set(id, updated);
    return { ok: true, refund: updated };
  },
};

export const planModule = {
  list: async function listPlans() {
    return {
      ok: true,
      plans: [
        { id: "free", name: "Free", portfolioLimit: 1, projectLimit: 3, storageQuotaMb: 500 },
        { id: "pro", name: "Pro", portfolioLimit: 3, projectLimit: 25, storageQuotaMb: 5000 },
        { id: "business", name: "Business", portfolioLimit: 10, projectLimit: 200, storageQuotaMb: 20000 },
      ],
    };
  },
  enforceLimits: function enforceLimits(planId: string, usage: { portfolios: number; projects: number; storageMb: number }) {
    const limits = {
      free: { portfolios: 1, projects: 3, storageMb: 500 },
      pro: { portfolios: 3, projects: 25, storageMb: 5000 },
      business: { portfolios: 10, projects: 200, storageMb: 20000 },
    } as Record<string, { portfolios: number; projects: number; storageMb: number }>;

    const target = limits[planId] ?? limits.free;
    if (usage.portfolios > target.portfolios) throw new Error("Portfolio limit reached for the current plan.");
    if (usage.projects > target.projects) throw new Error("Project limit reached for the current plan.");
    if (usage.storageMb > target.storageMb) throw new Error("Storage quota exceeded for the current plan.");

    return true;
  },
};

const subscriptionStore = new Map<string, any>();

export const subscriptionModule = {
  create: async function createSubscription(input: { id?: string; userId: string; planId: string; status?: string; renewalDate?: string }) {
    const id = input.id ?? `sub_${Math.random().toString(36).slice(2, 10)}`;
    const subscription = {
      id,
      userId: input.userId,
      planId: input.planId,
      status: input.status ?? "active",
      startedAt: new Date().toISOString(),
      renewalDate: input.renewalDate ?? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };
    subscriptionStore.set(id, subscription);
    return { ok: true, subscription };
  },
  renew: async function renewSubscription(id: string) {
    const subscription = subscriptionStore.get(id);
    if (!subscription) throw new Error(`Subscription ${id} not found.`);
    const renewed = { ...subscription, status: "active", renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() };
    subscriptionStore.set(id, renewed);
    return { ok: true, subscription: renewed };
  },
  cancel: async function cancelSubscription(id: string) {
    const subscription = subscriptionStore.get(id);
    if (!subscription) throw new Error(`Subscription ${id} not found.`);
    const cancelled = { ...subscription, status: "cancelled" };
    subscriptionStore.set(id, cancelled);
    return { ok: true, subscription: cancelled };
  },
  upgrade: async function upgradeSubscription(id: string, newPlanId: string) {
    const subscription = subscriptionStore.get(id);
    if (!subscription) throw new Error(`Subscription ${id} not found.`);
    const upgraded = { ...subscription, planId: newPlanId, status: "active" };
    subscriptionStore.set(id, upgraded);
    return { ok: true, subscription: upgraded };
  },
};

const analyticsStore: Array<Record<string, unknown>> = [];

export const analyticsModule = {
  track: async function trackEvent(event: { type: string; userId?: string; portfolioId?: string; projectId?: string; metadata?: Record<string, unknown> }) {
    const entry = {
      id: `evt_${Math.random().toString(36).slice(2, 10)}`,
      type: event.type,
      userId: event.userId ?? null,
      portfolioId: event.portfolioId ?? null,
      projectId: event.projectId ?? null,
      metadata: event.metadata ?? {},
      createdAt: new Date().toISOString(),
    };
    analyticsStore.push(entry);
    return { ok: true, event: entry };
  },
  aggregate: function aggregateEvents(type: string) {
    return analyticsStore.filter((event) => event.type === type).length;
  },
};

export const domainsModule = {
  verify: async function verifyDomain(domain: string) {
    const normalized = domain.trim().toLowerCase();
    if (!normalized.includes(".")) {
      throw new Error("Domain must be a valid hostname.");
    }
    return { ok: true, domain: normalized, verificationStatus: "pending", sslStatus: "pending" };
  },
  connect: async function connectDomain(portfolioId: string, domain: string) {
    return { ok: true, portfolioId, domain, verificationStatus: "verified", sslStatus: "active" };
  },
  disconnect: async function disconnectDomain(domain: string) {
    return { ok: true, domain, disconnected: true };
  },
};

export const notificationModule = {
  emit: async function emitNotification(input: { userId?: string; type: string; message: string; channel?: "in-app" | "email" | "sms" }) {
    return {
      ok: true,
      notification: {
        id: `ntf_${Math.random().toString(36).slice(2, 10)}`,
        userId: input.userId ?? null,
        type: input.type,
        message: input.message,
        channel: input.channel ?? "in-app",
        createdAt: new Date().toISOString(),
      },
    };
  },
  send: async function sendNotification(input: { userId?: string; type: string; message: string; channel?: "in-app" | "email" | "sms" }) {
    return notificationModule.emit(input);
  },
};

export const mailModule = {
  send: async function sendMail(input: { to: string; subject: string; template: string; variables?: Record<string, string> }) {
    return {
      ok: true,
      provider: "smtp",
      template: input.template,
      to: input.to,
      subject: input.subject,
      variables: input.variables ?? {},
    };
  },
};

export const supportModule = {
  createTicket: async function createTicket(input: { subject: string; category: string; priority?: string; description: string; userId?: string }) {
    return {
      ok: true,
      ticket: {
        id: `tkt_${Math.random().toString(36).slice(2, 10)}`,
        subject: input.subject,
        category: input.category,
        priority: input.priority ?? "normal",
        description: input.description,
        userId: input.userId ?? null,
        status: "open",
        createdAt: new Date().toISOString(),
      },
    };
  },
  reply: async function replyToTicket(ticketId: string, message: string, actorId: string) {
    return { ok: true, ticketId, message, actorId, createdAt: new Date().toISOString() };
  },
};

export const blogModule = {
  createPost: async function createPost(input: { title: string; slug?: string; status?: "draft" | "published"; authorId?: string }) {
    const slug = input.slug ?? input.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    return {
      ok: true,
      post: {
        id: `post_${Math.random().toString(36).slice(2, 10)}`,
        title: input.title,
        slug,
        status: input.status ?? "draft",
        authorId: input.authorId ?? null,
      },
    };
  },
  publish: async function publishPost(postId: string) {
    return { ok: true, postId, status: "published" };
  },
};

export const rolesAndPermissionsModule = {
  listRoles: async function listRoles() {
    return { ok: true, roles: [{ id: "super-admin", name: "Super Admin" }, { id: "staff", name: "Staff" }, { id: "customer", name: "Customer" }] };
  },
  listPermissions: async function listPermissions() {
    return { ok: true, permissions: ["users.view", "orders.assign", "payments.refund", "reports.view"] };
  },
  requirePermission: function requirePermission(userPermissions: string[], permission: string) {
    return userPermissions.includes(permission);
  },
};

export const adminModule = {
  getSummary: async function getSummary() {
    return {
      ok: true,
      summary: {
        totalUsers: 0,
        activeSubscriptions: 0,
        pendingOrders: 0,
        monthlyRevenue: 0,
        storageUsageMb: 0,
      },
    };
  },
  getKpis: async function getKpis() {
    return { ok: true, kpis: ["Total Users", "Monthly Revenue", "Active Orders", "Storage Usage"] };
  },
};

export const healthModule = {
  check: async function checkHealth() {
    return {
      ok: true,
      checks: {
        api: "ok",
        database: "ok",
        redis: "ok",
        storage: "ok",
        queue: "ok",
      },
      timestamp: new Date().toISOString(),
    };
  },
};
