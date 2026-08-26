export type UserRole = "super-admin" | "admin" | "staff" | "customer";
export type UserStatus = "active" | "pending" | "suspended" | "blocked";

export type PortfolioOwner = {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
};

export type PortfolioTemplate = {
  id: string;
  name: string;
  category: string;
  version: string;
  preview: string;
  supportedSections: string[];
  defaultStyles: Record<string, string>;
  premium: boolean;
};

export type PermissionKey =
  | "users.view"
  | "users.update"
  | "users.suspend"
  | "orders.view"
  | "orders.assign"
  | "orders.update"
  | "payments.view"
  | "payments.refund"
  | "templates.create"
  | "templates.update"
  | "reports.view";
