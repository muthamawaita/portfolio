import { describe, expect, it } from "vitest";
import { projectSchema } from "@/features/projects/project.schema";
import { profileSchema } from "@/features/profile/profile.schema";
import { onboardingSchema } from "@/features/profile/onboarding.schema";
import { portfolioProjects } from "@/data/portfolio";
import { enforcePlanLimits, PLAN_LIMITS_BY_TIER } from "@/lib/plan-limits";
import { adminAuditEntries, analyticsSummary, blogEntries, domainRecords, emailTemplates, mpesaTransactions, notificationEntries, paymentRecords, permissionCatalog, refundRecords, reportCatalog, reviewEntries, roleCatalog, staffProfiles, supportTickets, systemSettings } from "@/data/operations";
import { backendApiCapabilities, requireAuth, requirePermission, validateRequest } from "@/server/api";
import { createProjectDto, registerUserDto, updateProfileDto } from "@/server/dto";
import { adminModule, analyticsModule, authModule, blogModule, domainsModule, healthModule, mailModule, mpesaModule, notificationModule, orderModule, paymentModule, planModule, portfolioModule, profileModule, refundModule, rolesAndPermissionsModule, serviceModule, storageModule, subscriptionModule, supportModule, transactionModule, userModule } from "@/server/modules";
import { enqueueBackgroundJob, getBackgroundJobs, runBackgroundJob } from "@/server/background-jobs";
import { createRedisClient, getRateLimitKey, incrementRateLimit, queueMessage } from "@/lib/redis";
import { databasePackage, portfolioRendererPackage, uiPackage } from "@/packages";
import { DEFAULT_TEMPLATE_CATALOG, templateSchema, templateConfigs, type TemplateDefinition } from "@/packages/templates";
import { createPublicPortfolioSchema, createProjectSchema, emailSchema } from "@/packages/validation";
import { type PortfolioOwner, type UserRole, type UserStatus } from "@/packages/types";
import { appConfig, permissionNames, planIds, roleNames, uploadConstraints } from "@/packages/config";
import { buildImageUrl, formatCurrency, formatDate, paginate, slugify } from "@/packages/utilities";
import { isPortfolioPublishingAllowed } from "@/server/portfolio-access";
import { isConfiguredAdminCredentials, resolveUserPostLoginRoute } from "@/server/actions/auth";

describe("project schema", () => {
  it("requires a title", () => {
    expect(projectSchema.safeParse({}).success).toBe(false);
  });

  it("accepts the richer case-study metadata used by the admin editor", () => {
    const result = projectSchema.safeParse({
      title: "Portfolio redesign",
      slug: "portfolio-redesign",
      type: "Strategy & design",
      summary: "A strategic refresh for a premium portfolio experience.",
      problem: "The previous site did not explain the service value clearly enough.",
      objective: "Modernise the public-facing story and improve conversion quality.",
      solution: "We reframed the narrative around proof, process, and trust.",
      client: "JMW Studios",
      role: "Product strategist",
      completedDate: "August 2026",
      dataset: "Portfolio and user research data from the initial strategy sprint.",
      tools: ["Next.js", "Tailwind", "Prisma"],
      process: ["Discovery", "Design", "Build"],
      challenges: ["Story clarity", "A/B testing"],
      findings: "Case studies and proof points had the strongest conversion effect.",
      impact: "The updated experience communicates credibility faster and more clearly.",
      metric: "3x",
      metricLabel: "higher engagement",
      status: "PUBLISHED",
      coverImage: "https://example.com/cover.jpg",
    });

    expect(result.success).toBe(true);
  });
});

describe("project detail data", () => {
  it("includes the case-study metadata needed for the individual project experience", () => {
    const project = portfolioProjects[0];

    expect(project).toBeDefined();
    expect(project.coverImage).toBeTruthy();
    expect(project.client).toBeDefined();
    expect(project.role).toBeDefined();
    expect(project.completedDate).toBeDefined();
    expect(project.objective).toBeDefined();
    expect(Array.isArray(project.links)).toBe(true);
    expect(Array.isArray(project.gallery)).toBe(true);
  });
});

describe("profile schema", () => {
  it("accepts the richer about-page profile metadata", () => {
    const result = profileSchema.safeParse({
      name: "Jeremiah Muthama Waita",
      headline: "Data Analyst & Software Developer",
      bio: "I design systems and digital experiences that make complex work easier to understand.",
      careerBackground: "I have worked across analytics, software development, and technical teaching.",
      specializations: ["Data Analytics", "Business Intelligence"],
      interests: ["AI", "Product Thinking"],
      technologies: ["Power BI", "SQL", "Next.js"],
      objectives: ["Build trusted digital experiences", "Help clients grow with evidence"],
      values: ["Clarity", "Evidence", "Impact"],
      profileImageUrl: "https://example.com/profile.jpg",
    });

    expect(result.success).toBe(true);
  });
});

describe("onboarding schema", () => {
  it("accepts the required first-run portfolio setup fields", () => {
    const result = onboardingSchema.safeParse({
      purpose: "Developer",
      template: "editorial",
      name: "Jeremiah Waita",
      professionalTitle: "Product Designer & Data Analyst",
      bio: "I build digital products and data-driven experiences for ambitious teams.",
      location: "Nairobi, Kenya",
      profileImageUrl: "https://example.com/avatar.jpg",
      skills: ["Next.js", "Power BI", "SQL"],
      firstProjectTitle: "Portfolio redesign",
      firstProjectDescription: "A strategic modern portfolio for a consulting practice.",
    });

    expect(result.success).toBe(true);
  });
});

describe("portfolio publishing and payment gate", () => {
  it("blocks publishing until the tenant has an active paid subscription", () => {
    expect(isPortfolioPublishingAllowed({ plan: "FREE", subscriptionStatus: "INACTIVE" })).toBe(false);
    expect(isPortfolioPublishingAllowed({ plan: "FREE", subscriptionStatus: "ACTIVE" })).toBe(true);
    expect(isPortfolioPublishingAllowed({ plan: "PROFESSIONAL", subscriptionStatus: "ACTIVE" })).toBe(true);
    expect(isPortfolioPublishingAllowed({ plan: "PROFESSIONAL", subscriptionStatus: "PAST_DUE" })).toBe(false);
  });

  it("keeps the admin account static and routes new customers to their dashboard", async () => {
    const previousEmail = process.env.ADMIN_EMAIL;
    const previousPassword = process.env.ADMIN_PASSWORD;
    process.env.ADMIN_EMAIL = "admin@example.test";
    process.env.ADMIN_PASSWORD = "test-only-admin-password";
    try {
      await expect(isConfiguredAdminCredentials("admin@example.test", "test-only-admin-password")).resolves.toBe(true);
      await expect(isConfiguredAdminCredentials("customer@example.com", "secret123")).resolves.toBe(false);
      await expect(resolveUserPostLoginRoute("ADMIN", false)).resolves.toBe("/admin");
      await expect(resolveUserPostLoginRoute("CUSTOMER", false)).resolves.toBe("/dashboard");
      await expect(resolveUserPostLoginRoute("CUSTOMER", true)).resolves.toBe("/dashboard/onboarding");
    } finally {
      if (previousEmail === undefined) delete process.env.ADMIN_EMAIL; else process.env.ADMIN_EMAIL = previousEmail;
      if (previousPassword === undefined) delete process.env.ADMIN_PASSWORD; else process.env.ADMIN_PASSWORD = previousPassword;
    }
  });
});

describe("plan limits and support flows", () => {
  it("enforces the configured plan settings before a new portfolio or project is created", () => {
    const limits = PLAN_LIMITS_BY_TIER.pro;

    expect(limits.portfolios).toBeGreaterThan(0);
    expect(limits.projects).toBeGreaterThan(0);
    expect(limits.imagesPerProject).toBeGreaterThan(0);

    expect(() => enforcePlanLimits("pro", {
      portfolios: limits.portfolios + 1,
      projects: limits.projects,
      imagesPerProject: limits.imagesPerProject,
      storageQuotaMb: limits.storageQuotaMb,
      customDomain: limits.customDomain,
      analyticsDepth: limits.analyticsDepth,
    })).toThrow(/portfolio/i);
  });

  it("keeps support tickets aligned with the required service workflow statuses", () => {
    expect(supportTickets.length).toBeGreaterThan(0);
    expect(supportTickets[0]?.status).toBeDefined();
    expect(supportTickets.some((ticket) => ticket.status === "Open")).toBe(true);
  });

  it("includes the staff and review datasets needed by admin management", () => {
    expect(staffProfiles.length).toBeGreaterThan(0);
    expect(staffProfiles[0]).toMatchObject({
      name: expect.any(String),
      email: expect.any(String),
      role: expect.any(String),
      skills: expect.any(Array),
      availability: expect.any(String),
      status: expect.any(String),
    });
    expect(reviewEntries.length).toBeGreaterThan(0);
    expect(reviewEntries[0]).toMatchObject({
      entityType: expect.any(String),
      status: expect.any(String),
      reviewer: expect.any(String),
      moderationNotes: expect.any(String),
    });
  });

  it("includes the blog and domain administration records needed by the platform operations team", () => {
    expect(blogEntries.length).toBeGreaterThan(0);
    expect(blogEntries[0]).toMatchObject({
      title: expect.any(String),
      status: expect.any(String),
      category: expect.any(String),
      tags: expect.any(Array),
      seo: expect.any(Object),
    });
    expect(domainRecords.length).toBeGreaterThan(0);
    expect(domainRecords[0]).toMatchObject({
      domain: expect.any(String),
      owner: expect.any(String),
      portfolio: expect.any(String),
      verificationStatus: expect.any(String),
      sslStatus: expect.any(String),
      connectedAt: expect.any(String),
    });
  });

  it("includes the platform-wide admin analytics summary and exportable report definitions", () => {
    expect(analyticsSummary.length).toBeGreaterThan(0);
    expect(analyticsSummary.some((item) => item.label === "User growth")).toBe(true);
    expect(analyticsSummary.some((item) => item.label === "Portfolio growth")).toBe(true);
    expect(analyticsSummary.some((item) => item.label === "Revenue")).toBe(true);
    expect(analyticsSummary.some((item) => item.label === "Storage usage")).toBe(true);

    expect(reportCatalog.length).toBeGreaterThan(0);
    expect(reportCatalog.some((item) => item.name === "Revenue Report")).toBe(true);
    expect(reportCatalog.some((item) => item.name === "Payment Report")).toBe(true);
    expect(reportCatalog.some((item) => item.name === "Staff Performance Report")).toBe(true);
    expect(reportCatalog.every((item) => Array.isArray(item.formats) && item.formats.length > 0)).toBe(true);
  });

  it("defines the role, permission, and audit structures used for backend authorization and admin accountability", () => {
    expect(roleCatalog.length).toBeGreaterThan(0);
    expect(roleCatalog.some((role) => role.name === "Super Admin")).toBe(true);
    expect(roleCatalog.some((role) => role.name === "Support Agent")).toBe(true);

    expect(permissionCatalog.length).toBeGreaterThan(0);
    expect(permissionCatalog.some((permission) => permission.key === "users.view")).toBe(true);
    expect(permissionCatalog.some((permission) => permission.key === "orders.assign")).toBe(true);
    expect(permissionCatalog.some((permission) => permission.key === "reports.view")).toBe(true);

    expect(adminAuditEntries.length).toBeGreaterThan(0);
    expect(adminAuditEntries.some((entry) => entry.action === "User suspension")).toBe(true);
    expect(adminAuditEntries.some((entry) => entry.action === "Refund")).toBe(true);
    expect(adminAuditEntries.some((entry) => entry.action === "Template publication")).toBe(true);
    expect(adminAuditEntries.every((entry) => entry.actor && entry.resource && entry.resourceId && entry.timestamp)).toBe(true);
  });

  it("includes the admin alert categories and reusable email template catalog", () => {
    expect(notificationEntries.length).toBeGreaterThan(0);
    expect(notificationEntries.some((entry) => entry.title === "New order")).toBe(true);
    expect(notificationEntries.some((entry) => entry.title === "Failed payment")).toBe(true);
    expect(notificationEntries.some((entry) => entry.title === "Storage warning")).toBe(true);

    expect(emailTemplates.length).toBeGreaterThan(0);
    expect(emailTemplates.some((template) => template.name === "Welcome")).toBe(true);
    expect(emailTemplates.some((template) => template.name === "Payment Confirmation")).toBe(true);
    expect(emailTemplates.some((template) => template.name === "Support Response")).toBe(true);
    expect(emailTemplates.every((template) => Array.isArray(template.variables) && template.variables.length > 0)).toBe(true);
  });

  it("defines the system settings model used by platform administration", () => {
    expect(systemSettings.platformName).toBeDefined();
    expect(systemSettings.defaultCurrency).toBeDefined();
    expect(systemSettings.timezone).toBeDefined();
    expect(systemSettings.contactEmail).toContain("@");
    expect(systemSettings.supportEmail).toContain("@");
    expect(systemSettings.payments.enabled).toBeTypeOf("boolean");
    expect(systemSettings.mpesa.secured).toBe(true);
    expect(systemSettings.email.provider).toBeDefined();
    expect(systemSettings.storage.provider).toBeDefined();
    expect(systemSettings.uploads.maxFileSizeMb).toBeGreaterThan(0);
    expect(systemSettings.security.loginAttempts).toBeGreaterThan(0);
    expect(systemSettings.maintenance.mode).toBeTypeOf("boolean");
    expect(systemSettings.backups.enabled).toBeTypeOf("boolean");
  });

  it("exposes the central API contract required for authentication, authorization, validation, and health checks", () => {
    expect(backendApiCapabilities).toContain("Authenticate users");
    expect(backendApiCapabilities).toContain("Authorize actions");
    expect(backendApiCapabilities).toContain("Validate requests");
    expect(backendApiCapabilities).toContain("Run background jobs");

    expect(() => requireAuth(null)).toThrow(/authenticated/i);
    expect(requirePermission({ permissions: ["users.view"] }, "users.view")).toBe(true);
    expect(requirePermission({ permissions: ["users.view"] }, "orders.assign")).toBe(false);

    expect(() => validateRequest({ email: "bad" }, { email: "test@example.com" })).not.toThrow();
    expect(() => validateRequest({ email: "bad" }, { email: "not-an-email" })).toThrow(/email/i);
  });

  it("defines the DTOs and module contracts required for auth, profile, and portfolio backend flows", () => {
    expect(() => createProjectDto.parse({ title: "", description: "", category: "design", technologies: ["Next.js"] })).toThrow();
    expect(() => registerUserDto.parse({ firstName: "Jane", lastName: "Doe", username: "janedoe", email: "bad-email", password: "secret123", acceptTerms: true })).toThrow(/email/i);
    expect(() => updateProfileDto.parse({ name: "Jane", headline: "Product designer", bio: "Short" })).toThrow();

    expect(authModule.register).toBeTypeOf("function");
    expect(authModule.login).toBeTypeOf("function");
    expect(userModule.create).toBeTypeOf("function");
    expect(profileModule.update).toBeTypeOf("function");
    expect(portfolioModule.publish).toBeTypeOf("function");

    expect(portfolioModule.render({ profile: { name: "Jane" }, template: { id: "minimal" }, theme: { primary: "#111111" } }).title).toBe("Jane");
  });

  it("includes the storage, services, orders, payment, subscriptions, and analytics contracts required by the backend service layer", async () => {
    expect(storageModule.upload).toBeTypeOf("function");
    expect(storageModule.delete).toBeTypeOf("function");
    expect(storageModule.getUrl).toBeTypeOf("function");

    const uploaded = await storageModule.upload({ key: "projects/123/cover.png", fileName: "cover.png", size: 2048, mimeType: "image/png" });
    expect(uploaded.url).toContain("cover.png");

    expect(serviceModule.create).toBeTypeOf("function");
    expect(serviceModule.update).toBeTypeOf("function");

    const service = await serviceModule.create({ name: "Portfolio Development", basePrice: 250, category: "Design" });
    expect(service.service.name).toBe("Portfolio Development");

    expect(orderModule.create).toBeTypeOf("function");
    expect(orderModule.assign).toBeTypeOf("function");
    expect(orderModule.refund).toBeTypeOf("function");

    const order = await orderModule.create({ customerId: "user_123", serviceId: "svc_123", packageId: "pkg_123", total: 250, currency: "KES" });
    expect(order.order.status).toBe("pending_payment");

    const paidOrder = await orderModule.pay(order.order.id, { provider: "mpesa", reference: "MPESA-001" });
    expect(paidOrder.order.status).toBe("paid");

    const assigned = await orderModule.assign(paidOrder.order.id, "staff_456");
    expect(assigned.order.assigneeId).toBe("staff_456");

    expect(paymentModule.createProvider("mpesa").provider).toBe("mpesa");
    expect(paymentModule.confirm("mpesa", "MPESA-001", true).then((result) => result.confirmed)).resolves.toBe(true);
    expect(mpesaModule.callback({ resultCode: "0", resultDesc: "Success", checkoutRequestId: "MPESA-001", mpesaReceiptNumber: "RCP-1", amount: 250, verified: true }).then((result) => result.confirmed)).resolves.toBe(true);

    const transaction = await transactionModule.create({ gateway: "mpesa", gatewayReference: "MPESA-001", amount: 250, currency: "KES", customerId: "user_123", orderId: order.order.id });
    expect(transaction.transaction.gateway).toBe("mpesa");

    const refund = await refundModule.create({ paymentId: transaction.transaction.id, orderId: order.order.id, reason: "Customer requested cancellation", amount: 250, currency: "KES", actorId: "admin_1" });
    expect(refund.refund.status).toBe("requested");

    const plans = await planModule.list();
    expect(plans.plans.some((plan) => plan.id === "pro")).toBe(true);
    expect(planModule.enforceLimits("pro", { portfolios: 2, projects: 10, storageMb: 1500 })).toBe(true);

    const subscription = await subscriptionModule.create({ userId: "user_123", planId: "pro" });
    expect(subscription.subscription.status).toBe("active");

    const analyticsEvent = await analyticsModule.track({ type: "project_view", userId: "user_123", projectId: "proj_1", metadata: { source: "portfolio" } });
    expect(analyticsEvent.event.type).toBe("project_view");
    expect(analyticsModule.aggregate("project_view")).toBeGreaterThan(0);

    expect(domainsModule.verify("portfolio.example.com").then((result) => result.verificationStatus)).resolves.toBe("pending");
    expect(notificationModule.emit({ userId: "user_123", type: "order_assigned", message: "Order assigned", channel: "in-app" }).then((result) => result.notification.type)).resolves.toBe("order_assigned");
    expect(mailModule.send({ to: "user@example.com", subject: "Welcome", template: "welcome", variables: { customer_name: "Jane" } }).then((result) => result.provider)).resolves.toBe("smtp");
    expect(supportModule.createTicket({ subject: "Need help", category: "billing", description: "My payment is stuck" }).then((result) => result.ticket.status)).resolves.toBe("open");
    expect(blogModule.createPost({ title: "Portfolio Tips", status: "published" }).then((result) => result.post.status)).resolves.toBe("published");
    expect(rolesAndPermissionsModule.requirePermission(["users.view", "orders.assign"], "orders.assign")).toBe(true);
    expect(adminModule.getSummary().then((result) => result.summary.totalUsers)).resolves.toBe(0);
    expect(healthModule.check().then((result) => result.checks.api)).resolves.toBe("ok");

    await expect(orderModule.cancel("missing-order")).rejects.toThrow(/not found|order/i);
  });

  it("supports background jobs, Redis queues, and shared package interfaces required by the platform architecture", async () => {
    const job = await enqueueBackgroundJob({ type: "image_processing", payload: { projectId: "proj_1", imageCount: 3 } });
    expect(job.job.type).toBe("image_processing");
    expect(getBackgroundJobs().length).toBeGreaterThan(0);

    const result = await runBackgroundJob(job.job.id);
    expect(result.ok).toBe(true);
    expect(result.jobStatus).toBe("completed");

    const redis = createRedisClient();
    expect(redis.get("demo:key")).toBeUndefined();
    expect(queueMessage("emails", { to: "team@example.com" }).queue).toBe("emails");
    expect(incrementRateLimit("api:login", 1)).toBe(1);
    expect(getRateLimitKey("api:login")).toContain("api:login");

    expect(databasePackage.name).toBe("database");
    expect(uiPackage.name).toBe("ui");
    expect(portfolioRendererPackage.name).toBe("portfolio-renderer");
    expect(databasePackage.seed.defaultData).toEqual(expect.any(Array));
    expect(uiPackage.components.length).toBeGreaterThan(0);
    expect(portfolioRendererPackage.render).toBeTypeOf("function");
  });

  it("defines the template, validation, config, utility, and shared types contracts used across the platform", () => {
    expect(DEFAULT_TEMPLATE_CATALOG).toEqual(expect.arrayContaining([expect.objectContaining({ id: expect.any(String), category: expect.any(String) })]));
    expect(templateConfigs.developerModern.id).toBe("developer-modern");
    expect(templateSchema.safeParse({ id: "developer-modern", name: "Developer Modern", category: "Developer", version: "1.0.0", preview: "/preview.jpg", supportedSections: ["hero", "about"], defaultStyles: { primary: "#111111" }, premium: false }).success).toBe(true);

    expect(createPublicPortfolioSchema.safeParse({ name: "Jane Doe", title: "Data Analyst", bio: "Analyst focused on product clarity." }).success).toBe(true);
    expect(createProjectSchema.safeParse({ title: "New project", summary: "Short summary", category: "Web App" }).success).toBe(true);
    expect(emailSchema.safeParse({ email: "user@example.com" }).success).toBe(true);

    const owner: PortfolioOwner = { id: "user_1", name: "Jane Doe", email: "jane@example.com", status: "active" };
    const role: UserRole = "customer";
    const status: UserStatus = "active";
    expect(owner.name).toBe("Jane Doe");
    expect(role).toBe("customer");
    expect(status).toBe("active");

    expect(roleNames.superAdmin).toBe("Super Admin");
    expect(permissionNames.usersView).toBe("users.view");
    expect(planIds.pro).toBe("pro");
    expect(uploadConstraints.maxImageBytes).toBeGreaterThan(0);
    expect(appConfig.appName).toBeDefined();

    expect(slugify("My Portfolio / 2026")).toBe("my-portfolio-2026");
    expect(formatCurrency(2500, "KES")).toContain("KES");
    expect(formatDate("2026-08-23T00:00:00.000Z")).toMatch(/2026|Aug/i);
    expect(buildImageUrl("projects/123/cover.png")).toContain("projects/123/cover.png");
    expect(paginate({ page: 2, pageSize: 10, total: 25 }).page).toBe(2);
  });

  it("exposes the admin payment fields required for reconciliation and review", () => {
    const payment = paymentRecords[0];

    expect(payment).toBeDefined();
    expect(payment.customer).toMatch(/\w/);
    expect(payment.order).toMatch(/ORD-|PRO PLAN|SUB/);
    expect(payment.gateway).toMatch(/M-Pesa|Card|PayPal/);
    expect(payment.reference).toMatch(/TXN-|REF-|MPESA-|PP-/);
    expect(["Successful", "Pending", "Failed", "Refunded"]).toContain(payment.status);
    expect(payment.date).toMatch(/\d{4}-\d{2}-\d{2}/);
  });

  it("includes the M-Pesa reconciliation and refund audit data required by the admin workflow", () => {
    const mpesa = mpesaTransactions[0];
    const refund = refundRecords[0];

    expect(mpesa).toBeDefined();
    expect(mpesa.checkoutRequestId).toMatch(/ws_CO|STK/);
    expect(mpesa.merchantRequestId).toMatch(/MRQ|MER/);
    expect(mpesa.phone).toMatch(/\*{3,}/);
    expect(mpesa.amount).toMatch(/\d/);
    expect(mpesa.receiptNumber).toMatch(/\w/);
    expect(["Pending", "Success", "Failed"]).toContain(mpesa.status);
    expect(refund).toBeDefined();
    expect(refund.workflow).toContain("Review");
    expect(refund.auditLog).toMatch(/audit|review/i);
  });
});
