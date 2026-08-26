export const appConfig = {
  appName: "JMW Studios",
  defaultCurrency: "KES",
  timezone: "Africa/Nairobi",
  contactEmail: "hello@jmwstudios.com",
  supportEmail: "support@jmwstudios.com",
};

export const roleNames = {
  superAdmin: "Super Admin",
  admin: "Admin",
  financeAdmin: "Finance Admin",
  supportAgent: "Support Agent",
  contentManager: "Content Manager",
  staff: "Staff",
  customer: "Customer",
};

export const permissionNames = {
  usersView: "users.view",
  usersUpdate: "users.update",
  usersSuspend: "users.suspend",
  ordersView: "orders.view",
  ordersAssign: "orders.assign",
  ordersUpdate: "orders.update",
  paymentsView: "payments.view",
  paymentsRefund: "payments.refund",
  templatesCreate: "templates.create",
  templatesUpdate: "templates.update",
  reportsView: "reports.view",
};

export const planIds = {
  free: "free",
  pro: "pro",
  business: "business",
};

export const uploadConstraints = {
  maxImageBytes: 10 * 1024 * 1024,
  allowedMimeTypes: ["image/png", "image/jpeg", "image/webp"],
  maxImagesPerProject: 25,
};
