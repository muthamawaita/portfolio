export const databasePackage = {
  name: "database",
  layer: "shared",
  purpose: "Prisma schema, migrations, seeds, and shared database integration.",
  schema: {
    provider: "mysql",
    models: ["users", "portfolios", "projects", "orders", "payments", "subscriptions"],
  },
  seed: {
    defaultData: ["roles", "permissions", "plans", "templates"],
  },
};

export const uiPackage = {
  name: "ui",
  layer: "shared",
  purpose: "Reusable interface components shared by web, dashboard, and admin.",
  components: ["Button", "Input", "Table", "Modal", "Card", "Pagination", "Chart"],
};

export const portfolioRendererPackage = {
  name: "portfolio-renderer",
  layer: "shared",
  purpose: "Reusable engine that renders portfolio content consistently in preview and public views.",
  render: (content: Record<string, unknown>, template: Record<string, unknown>, theme: Record<string, unknown>) => ({
    content,
    templateId: template.id ?? "default",
    theme: theme.primary ?? "#111111",
    renderedAt: new Date().toISOString(),
  }),
};

export const packageCatalog = [databasePackage, uiPackage, portfolioRendererPackage];
