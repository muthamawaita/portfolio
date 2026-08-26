export const leadStatuses = ["New", "Contacted", "Qualified", "Won", "Lost", "Spam"] as const;
export type LeadStatus = (typeof leadStatuses)[number];

export type LeadEntry = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  portfolio: string;
  date: string;
  status: LeadStatus;
};

export const leadEntries: LeadEntry[] = [
  {
    id: "LD-2401",
    name: "Grace Wanjiku",
    email: "grace@westendconsulting.co.ke",
    phone: "+254 712 447 991",
    subject: "Portfolio redesign for my consulting brand",
    message: "I want a premium portfolio with case studies and a clear profile for client acquisition.",
    portfolio: "gracewanjiku.com",
    date: "2026-08-18",
    status: "New",
  },
  {
    id: "LD-2408",
    name: "Daniel Muli",
    email: "daniel@example.com",
    phone: "+254 722 885 704",
    subject: "Power BI dashboard package",
    message: "I need a sales dashboard that tracks revenue, pipeline, and weekly conversions.",
    portfolio: "danielmuli.dev",
    date: "2026-08-16",
    status: "Qualified",
  },
  {
    id: "LD-2412",
    name: "Maya Patel",
    email: "maya@rocketstudio.io",
    phone: "+1 (415) 204-7070",
    subject: "Website + portfolio rebuild",
    message: "We need our site to reflect our service offering and convert more leads.",
    portfolio: "rocketstudio.io",
    date: "2026-08-14",
    status: "Contacted",
  },
  {
    id: "LD-2415",
    name: "Cynthia Njeri",
    email: "cynthia@proofpoint.africa",
    phone: "+254 733 612 402",
    subject: "Resume and portfolio for a research role",
    message: "I want my profile to emphasize academic research, analytics, and training work.",
    portfolio: "cynthianjeri.io",
    date: "2026-08-12",
    status: "Won",
  },
];

export type PlanLimitTier = "free" | "pro" | "business";

export type PlanLimitSpec = {
  portfolios: number;
  projects: number;
  imagesPerProject: number;
  storageQuotaMb: number;
  availableTemplates: string[];
  customDomain: boolean;
  analyticsDepth: "basic" | "advanced" | "deep";
  removeBranding: boolean;
  resumeHosting: boolean;
};

export const PLAN_LIMITS_BY_TIER: Record<PlanLimitTier, PlanLimitSpec> = {
  free: {
    portfolios: 1,
    projects: 3,
    imagesPerProject: 5,
    storageQuotaMb: 1024,
    availableTemplates: ["editorial", "minimal"],
    customDomain: false,
    analyticsDepth: "basic",
    removeBranding: false,
    resumeHosting: false,
  },
  pro: {
    portfolios: 3,
    projects: 25,
    imagesPerProject: 20,
    storageQuotaMb: 10240,
    availableTemplates: ["editorial", "minimal", "luxury", "portfolio"],
    customDomain: true,
    analyticsDepth: "advanced",
    removeBranding: true,
    resumeHosting: true,
  },
  business: {
    portfolios: 10,
    projects: 200,
    imagesPerProject: 50,
    storageQuotaMb: 51200,
    availableTemplates: ["editorial", "minimal", "luxury", "portfolio", "studio", "agency"],
    customDomain: true,
    analyticsDepth: "deep",
    removeBranding: true,
    resumeHosting: true,
  },
};

export type PlanLimitCheck = {
  portfolios?: number;
  projects?: number;
  imagesPerProject?: number;
  storageQuotaMb?: number;
  customDomain?: boolean;
  analyticsDepth?: "basic" | "advanced" | "deep";
  removeBranding?: boolean;
  resumeHosting?: boolean;
};

export function enforcePlanLimits(tier: PlanLimitTier, values: PlanLimitCheck) {
  const limits = PLAN_LIMITS_BY_TIER[tier];

  if (typeof values.portfolios === "number" && values.portfolios > limits.portfolios) {
    throw new Error(`Portfolio limit exceeded for ${tier} plan. Maximum portfolios: ${limits.portfolios}.`);
  }

  if (typeof values.projects === "number" && values.projects > limits.projects) {
    throw new Error(`Project limit exceeded for ${tier} plan. Maximum projects: ${limits.projects}.`);
  }

  if (typeof values.imagesPerProject === "number" && values.imagesPerProject > limits.imagesPerProject) {
    throw new Error(`Image limit exceeded for ${tier} plan. Maximum images per project: ${limits.imagesPerProject}.`);
  }

  if (typeof values.storageQuotaMb === "number" && values.storageQuotaMb > limits.storageQuotaMb) {
    throw new Error(`Storage quota exceeded for ${tier} plan. Maximum storage: ${limits.storageQuotaMb} MB.`);
  }

  if (typeof values.customDomain === "boolean" && values.customDomain && !limits.customDomain) {
    throw new Error(`Custom domains are not included in the ${tier} plan.`);
  }

  if (typeof values.analyticsDepth === "string" && values.analyticsDepth && limits.analyticsDepth === "basic" && values.analyticsDepth !== "basic") {
    throw new Error(`Analytics depth is not available on the ${tier} plan.`);
  }

  if (typeof values.removeBranding === "boolean" && values.removeBranding && !limits.removeBranding) {
    throw new Error(`Removing branding is not available in the ${tier} plan.`);
  }

  if (typeof values.resumeHosting === "boolean" && values.resumeHosting && !limits.resumeHosting) {
    throw new Error(`Resume hosting is not available in the ${tier} plan.`);
  }

  return true;
}

export const orderWorkflow = [
  "Pending Payment",
  "Paid",
  "Processing",
  "Assigned",
  "In Progress",
  "Submitted",
  "Customer Review",
  "Accept",
  "Revision",
  "Completed",
];

export type OrderStatus =
  | "Pending Payment"
  | "Paid"
  | "Processing"
  | "Assigned"
  | "In Progress"
  | "Submitted"
  | "Customer Review"
  | "Revision"
  | "Completed"
  | "Cancelled"
  | "Refunded"
  | "Disputed";

export type PaymentStatus = "Pending" | "Paid" | "Failed" | "Refunded";

export type OrderEntry = {
  id: string;
  service: string;
  packageName: string;
  price: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  assignedStaff: string;
  deadline: string;
  files: number;
  messages: number;
  revisions: number;
  delivery: string;
};

export const orderEntries: OrderEntry[] = [
  {
    id: "ORD-1042",
    service: "Portfolio Development",
    packageName: "Professional",
    price: "$1,240",
    paymentStatus: "Paid",
    orderStatus: "In Progress",
    assignedStaff: "Amina Njeri",
    deadline: "2026-08-27",
    files: 4,
    messages: 8,
    revisions: 2,
    delivery: "Design review pending",
  },
  {
    id: "ORD-1048",
    service: "Power BI Dashboard",
    packageName: "Executive",
    price: "$980",
    paymentStatus: "Paid",
    orderStatus: "Customer Review",
    assignedStaff: "Joel Mwangangi",
    deadline: "2026-08-24",
    files: 7,
    messages: 12,
    revisions: 1,
    delivery: "Awaiting customer sign-off",
  },
  {
    id: "ORD-1051",
    service: "CV & Portfolio Review",
    packageName: "Starter",
    price: "$220",
    paymentStatus: "Pending",
    orderStatus: "Pending Payment",
    assignedStaff: "Unassigned",
    deadline: "2026-08-30",
    files: 2,
    messages: 3,
    revisions: 0,
    delivery: "Waiting for payment",
  },
  {
    id: "ORD-1057",
    service: "Research Support",
    packageName: "Premium",
    price: "$1,610",
    paymentStatus: "Paid",
    orderStatus: "Completed",
    assignedStaff: "Njeri Kibet",
    deadline: "2026-08-18",
    files: 11,
    messages: 19,
    revisions: 3,
    delivery: "Delivered and accepted",
  },
];

export const orderRequirementsByService: Record<string, string[]> = {
  "Portfolio service": [
    "Full Name",
    "Career",
    "Bio",
    "Skills",
    "Experience",
    "Projects",
    "CV",
    "Profile Image",
    "Preferred Style",
    "Domain",
    "Special Instructions",
  ],
  "Power BI Dashboard": [
    "Business goal",
    "Available data sources",
    "KPIs to track",
    "Brand colours",
    "User access needs",
    "Timeline of delivery",
  ],
  "CV & Portfolio Review": [
    "Current CV",
    "Target role",
    "Professional summary",
    "Portfolio URL",
    "Key achievements",
  ],
};

export type PaymentRecord = {
  id: string;
  customer: string;
  order: string;
  amount: string;
  currency: string;
  gateway: "M-Pesa" | "Card" | "PayPal";
  reference: string;
  status: "Successful" | "Pending" | "Failed" | "Refunded";
  date: string;
};

export const paymentRecords: PaymentRecord[] = [
  {
    id: "TXN-90121",
    customer: "Amina Njeri",
    order: "ORD-1042 · Portfolio Development",
    amount: "$1,240",
    currency: "USD",
    gateway: "Card",
    reference: "REF-90121",
    status: "Successful",
    date: "2026-08-20",
  },
  {
    id: "TXN-90148",
    customer: "Joel Mwangangi",
    order: "ORD-1048 · Power BI Dashboard",
    amount: "$980",
    currency: "USD",
    gateway: "M-Pesa",
    reference: "MPESA-90148",
    status: "Successful",
    date: "2026-08-18",
  },
  {
    id: "TXN-90160",
    customer: "Salma Wambui",
    order: "PRO PLAN · Monthly billing",
    amount: "$49",
    currency: "USD",
    gateway: "PayPal",
    reference: "PP-90160",
    status: "Pending",
    date: "2026-08-11",
  },
  {
    id: "TXN-90188",
    customer: "Daniel Muli",
    order: "ORD-1051 · CV review",
    amount: "$220",
    currency: "USD",
    gateway: "Card",
    reference: "REF-90188",
    status: "Refunded",
    date: "2026-08-06",
  },
  {
    id: "TXN-90204",
    customer: "Faith Kariuki",
    order: "ORD-1059 · Research Support",
    amount: "$560",
    currency: "USD",
    gateway: "M-Pesa",
    reference: "MPESA-90204",
    status: "Failed",
    date: "2026-08-04",
  },
];

export type MpesaTransaction = {
  checkoutRequestId: string;
  merchantRequestId: string;
  phone: string;
  amount: string;
  receiptNumber: string;
  status: "Pending" | "Success" | "Failed";
  callbackResult: string;
  date: string;
};

export const mpesaTransactions: MpesaTransaction[] = [
  {
    checkoutRequestId: "ws_CO_20260820_123456789",
    merchantRequestId: "MRQ_123456789",
    phone: "2547******81",
    amount: "KSh 49,000",
    receiptNumber: "RCP-90201",
    status: "Success",
    callbackResult: "Confirmed by Daraja callback and reconciled by finance admin.",
    date: "2026-08-20 14:33",
  },
  {
    checkoutRequestId: "ws_CO_20260818_987654321",
    merchantRequestId: "MRQ_987654321",
    phone: "2547******12",
    amount: "KSh 20,000",
    receiptNumber: "RCP-90148",
    status: "Pending",
    callbackResult: "Awaiting provider confirmation and retry check.",
    date: "2026-08-18 08:11",
  },
];

export type RefundRecord = {
  id: string;
  customer: string;
  order: string;
  amount: string;
  workflow: string[];
  status: "Pending" | "Approved" | "Rejected";
  auditLog: string;
};

export const refundRecords: RefundRecord[] = [
  {
    id: "REF-1021",
    customer: "Daniel Muli",
    order: "ORD-1051 · CV review",
    amount: "$220",
    workflow: [
      "Customer/Admin Request",
      "Review",
      "Approve/Reject",
      "Payment Gateway Refund",
      "Confirm",
      "Update Transaction",
      "Update Order",
    ],
    status: "Approved",
    auditLog: "Refund reviewed by finance admin and logged to audit trail for approval and order adjustment.",
  },
  {
    id: "REF-1044",
    customer: "Faith Kariuki",
    order: "ORD-1059 · Research Support",
    amount: "$560",
    workflow: [
      "Customer/Admin Request",
      "Review",
      "Approve/Reject",
      "Payment Gateway Refund",
      "Confirm",
      "Update Transaction",
      "Update Order",
    ],
    status: "Pending",
    auditLog: "Manual refund not allowed until payment provider confirmation and approval are recorded.",
  },
];

export type InvoiceRecord = {
  id: string;
  customer: string;
  service: string;
  amount: string;
  currency: string;
  paymentDate: string;
  paymentReference: string;
  company: string;
};

export const invoiceRecords: InvoiceRecord[] = [
  {
    id: "INV-3001",
    customer: "Grace Wanjiku",
    service: "Portfolio Development",
    amount: "$1,240",
    currency: "USD",
    paymentDate: "2026-08-20",
    paymentReference: "TXN-90121",
    company: "JMW Studios",
  },
  {
    id: "INV-3004",
    customer: "Daniel Muli",
    service: "Power BI Dashboard",
    amount: "$980",
    currency: "USD",
    paymentDate: "2026-08-18",
    paymentReference: "TXN-90148",
    company: "JMW Studios",
  },
];

export type SubscriptionSummary = {
  currentPlan: string;
  price: string;
  billingCycle: "Monthly" | "Quarterly" | "Annual";
  startDate: string;
  renewalDate: string;
  status: "Active" | "Past due" | "Cancelled";
  usage: { label: string; value: string }[];
  limits: { label: string; value: string }[];
};

export const subscriptionSummary: SubscriptionSummary = {
  currentPlan: "Professional",
  price: "$49 / month",
  billingCycle: "Monthly",
  startDate: "2026-06-01",
  renewalDate: "2026-09-01",
  status: "Active",
  usage: [
    { label: "Portfolios", value: "1 / 3" },
    { label: "Projects", value: "14 / 25" },
    { label: "Storage", value: "2.4 GB / 10 GB" },
    { label: "Resume hosting", value: "Enabled" },
  ],
  limits: [
    { label: "Custom domains", value: "1 included" },
    { label: "Analytics depth", value: "Advanced" },
    { label: "Templates", value: "All premium templates" },
    { label: "Brand removal", value: "Included" },
  ],
};

export type OrderFileItem = {
  id: string;
  name: string;
  type: string;
  size: string;
  owner: "Customer" | "Staff";
  sender: "Customer" | "Staff";
  timestamp: string;
  status: "Ready" | "Scanning" | "Blocked";
};

export const orderFiles: OrderFileItem[] = [
  {
    id: "FILE-101",
    name: "portfolio-brief.pdf",
    type: "PDF",
    size: "2.3 MB",
    owner: "Customer",
    sender: "Customer",
    timestamp: "2026-08-21 14:42",
    status: "Ready",
  },
  {
    id: "FILE-102",
    name: "mockup-concepts.fig",
    type: "FIG",
    size: "8.1 MB",
    owner: "Staff",
    sender: "Staff",
    timestamp: "2026-08-21 16:08",
    status: "Scanning",
  },
  {
    id: "FILE-103",
    name: "brand-colours.zip",
    type: "ZIP",
    size: "1.8 MB",
    owner: "Customer",
    sender: "Customer",
    timestamp: "2026-08-22 09:16",
    status: "Ready",
  },
  {
    id: "FILE-104",
    name: "dashboard-export.xlsx",
    type: "XLSX",
    size: "960 KB",
    owner: "Staff",
    sender: "Staff",
    timestamp: "2026-08-22 11:40",
    status: "Blocked",
  },
];

export type OrderMessageEntry = {
  id: string;
  sender: string;
  role: "Customer" | "Staff" | "Support";
  text: string;
  timestamp: string;
  attachment?: string;
  unread?: boolean;
};

export const orderMessages: OrderMessageEntry[] = [
  {
    id: "MSG-101",
    sender: "Grace Wanjiku",
    role: "Customer",
    text: "I reviewed the concept and would like a darker luxury palette with more whitespace in the hero section.",
    timestamp: "Today · 09:12",
    unread: true,
  },
  {
    id: "MSG-102",
    sender: "Amina Njeri",
    role: "Staff",
    text: "That works. I will update the layout and send a revised mockup for approval before moving to the next section.",
    timestamp: "Today · 09:18",
    attachment: "revised-layout.pdf",
  },
  {
    id: "MSG-103",
    sender: "Client Support",
    role: "Support",
    text: "The project files remain private to this order thread and are not shared outside the assigned team.",
    timestamp: "Today · 09:27",
  },
];

export type RevisionRequestEntry = {
  id: string;
  revisionNumber: number;
  instructions: string;
  submittedDate: string;
  status: "Requested" | "In Review" | "Completed";
  staffResponse: string;
  files: string[];
  completionDate?: string;
};

export const revisionRequests: RevisionRequestEntry[] = [
  {
    id: "REV-204",
    revisionNumber: 2,
    instructions: "Reduce the case-study section layout to a two-column experience and add stronger KPI callouts.",
    submittedDate: "2026-08-22",
    status: "In Review",
    staffResponse: "Reviewing the feedback and aligning the updated metrics with the approved theme.",
    files: ["portfolio-kpi-revision.fig", "project-summary.pdf"],
  },
  {
    id: "REV-203",
    revisionNumber: 1,
    instructions: "Tighten the hero copy and swap the first project preview for a more recent case study.",
    submittedDate: "2026-08-18",
    status: "Completed",
    staffResponse: "Updated the hero messaging and replaced the preview with the data dashboard project.",
    files: ["hero-copy.md"],
    completionDate: "2026-08-20",
  },
];

export type ConversationMessage = {
  id: string;
  sender: string;
  role: "Customer" | "Staff" | "Support" | "Admin";
  text: string;
  timestamp: string;
  unread?: boolean;
};

export type ConversationEntry = {
  id: string;
  subject: string;
  participants: string[];
  orderId?: string;
  channel: "Customer ↔ Admin" | "Customer ↔ Staff" | "Customer ↔ Support";
  unread: number;
  lastUpdated: string;
  status: "Open" | "Assigned" | "Resolved";
  messages: ConversationMessage[];
};

export const messageThreads: ConversationEntry[] = [
  {
    id: "MSG-210",
    subject: "Portfolio launch feedback",
    participants: ["Grace Wanjiku", "Amina Njeri", "Support"],
    orderId: "ORD-1042",
    channel: "Customer ↔ Staff",
    unread: 2,
    lastUpdated: "2026-08-22 09:27",
    status: "Assigned",
    messages: [
      { id: "C-1", sender: "Grace Wanjiku", role: "Customer", text: "The first pass is strong, but I want a more premium feel in the pricing section.", timestamp: "2026-08-22 09:12", unread: true },
      { id: "C-2", sender: "Amina Njeri", role: "Staff", text: "I can adjust the section spacing and strengthen the package differentiation.", timestamp: "2026-08-22 09:18" },
    ],
  },
  {
    id: "MSG-211",
    subject: "Support: invoice and receipt question",
    participants: ["Daniel Muli", "Client Support"],
    channel: "Customer ↔ Support",
    unread: 1,
    lastUpdated: "2026-08-21 15:03",
    status: "Open",
    messages: [
      { id: "C-3", sender: "Daniel Muli", role: "Customer", text: "I need a receipt for my recent M-Pesa payment before the final dashboard review.", timestamp: "2026-08-21 14:52" },
      { id: "C-4", sender: "Client Support", role: "Support", text: "I have shared the invoice and confirmed the payment is reconciled. Please confirm receipt.", timestamp: "2026-08-21 15:03", unread: true },
    ],
  },
];

export type NotificationEntry = {
  id: string;
  title: string;
  description: string;
  category: "Orders" | "Payments" | "Support" | "Content" | "System" | "Storage";
  channel: "In-app" | "Email" | "Push" | "SMS";
  createdAt: string;
  read: boolean;
  severity: "Low" | "Medium" | "High" | "Critical";
};

export const notificationEntries: NotificationEntry[] = [
  {
    id: "NT-300",
    title: "New order",
    description: "ORD-1042 was created and is waiting for staff assignment.",
    category: "Orders",
    channel: "In-app",
    createdAt: "2026-08-22 08:10",
    read: false,
    severity: "Medium",
  },
  {
    id: "NT-301",
    title: "Large payment",
    description: "Transaction TXN-90121 exceeded the high-value threshold for a portfolio build order.",
    category: "Payments",
    channel: "Email",
    createdAt: "2026-08-20 13:41",
    read: true,
    severity: "High",
  },
  {
    id: "NT-302",
    title: "Failed payment",
    description: "A retry is required for a recent invoice because the transaction was declined.",
    category: "Payments",
    channel: "Push",
    createdAt: "2026-08-19 16:18",
    read: false,
    severity: "Critical",
  },
  {
    id: "NT-303",
    title: "Refund request",
    description: "Customer support raised a refund request for ORD-1036 and escalated it to finance.",
    category: "Payments",
    channel: "In-app",
    createdAt: "2026-08-19 12:08",
    read: false,
    severity: "High",
  },
  {
    id: "NT-304",
    title: "Dispute",
    description: "A project dispute is open and needs legal or support review before release of funds.",
    category: "Support",
    channel: "Email",
    createdAt: "2026-08-18 11:33",
    read: true,
    severity: "Critical",
  },
  {
    id: "NT-305",
    title: "Reported portfolio",
    description: "One public portfolio was flagged for review by a platform user.",
    category: "Content",
    channel: "In-app",
    createdAt: "2026-08-18 10:15",
    read: false,
    severity: "High",
  },
  {
    id: "NT-306",
    title: "Reported project",
    description: "A submitted project was reported for policy review based on user feedback.",
    category: "Content",
    channel: "In-app",
    createdAt: "2026-08-17 14:55",
    read: true,
    severity: "Medium",
  },
  {
    id: "NT-307",
    title: "New support ticket",
    description: "Support opened a new ticket from a customer who needs help with invoice access.",
    category: "Support",
    channel: "Email",
    createdAt: "2026-08-16 09:26",
    read: false,
    severity: "Medium",
  },
  {
    id: "NT-308",
    title: "Storage warning",
    description: "The workspace has reached 87% of its allocated media storage and needs cleanup.",
    category: "Storage",
    channel: "Push",
    createdAt: "2026-08-15 08:04",
    read: false,
    severity: "High",
  },
  {
    id: "NT-309",
    title: "System problem",
    description: "A payment reconciliation job failed and requires immediate admin review.",
    category: "System",
    channel: "SMS",
    createdAt: "2026-08-14 22:41",
    read: true,
    severity: "Critical",
  },
];

export type SystemSettings = {
  platformName: string;
  defaultCurrency: string;
  timezone: string;
  contactEmail: string;
  supportEmail: string;
  companyInformation: string;
  branding: {
    logo: string;
    favicon: string;
    primaryBrandingConfig: string;
    footer: string;
    socialLinks: string[];
  };
  payments: {
    enabled: boolean;
    methods: {
      mpesa: boolean;
      card: boolean;
      paypal: boolean;
    };
  };
  mpesa: {
    secured: boolean;
    note: string;
    provider: string;
  };
  email: {
    provider: string;
    enabled: boolean;
  };
  storage: {
    provider: string;
    quotaMb: number;
  };
  uploads: {
    allowedFileTypes: string[];
    maxFileSizeMb: number;
    imagesPerProject: number;
    compression: "None" | "Lossless" | "Optimized";
  };
  security: {
    loginAttempts: number;
    sessionDurationMinutes: number;
    twoFactorEnabled: boolean;
    passwordPolicy: string;
    rateLimiting: string;
  };
  maintenance: {
    mode: boolean;
    message: string;
  };
  backups: {
    enabled: boolean;
    frequency: string;
    retention: string;
  };
};

export const systemSettings: SystemSettings = {
  platformName: "JMW Studios",
  defaultCurrency: "USD",
  timezone: "UTC",
  contactEmail: "hello@jmw-studios.com",
  supportEmail: "support@jmw-studios.com",
  companyInformation: "Premium portfolio, analytics, and digital service platform for professionals and businesses.",
  branding: {
    logo: "Primary logo lockup with black-and-gold theme",
    favicon: "JMW favicon",
    primaryBrandingConfig: "Black / gold / ivory premium palette",
    footer: "Built for portfolio websites, research storytelling, and digital product marketing.",
    socialLinks: ["LinkedIn", "GitHub", "X", "Instagram", "YouTube"],
  },
  payments: {
    enabled: true,
    methods: {
      mpesa: true,
      card: true,
      paypal: false,
    },
  },
  mpesa: {
    secured: true,
    note: "Credentials are managed via environment variables and secrets storage, not exposed to the browser.",
    provider: "Safaricom Daraja",
  },
  email: {
    provider: "Resend",
    enabled: true,
  },
  storage: {
    provider: "Cloudflare R2",
    quotaMb: 51200,
  },
  uploads: {
    allowedFileTypes: ["PDF", "PNG", "JPG", "WEBP", "ZIP", "SVG", "DOCX", "XLSX"],
    maxFileSizeMb: 25,
    imagesPerProject: 30,
    compression: "Optimized",
  },
  security: {
    loginAttempts: 5,
    sessionDurationMinutes: 120,
    twoFactorEnabled: true,
    passwordPolicy: "Minimum 12 characters with mixed case and numbers",
    rateLimiting: "Enabled for login, contact, and upload endpoints",
  },
  maintenance: {
    mode: false,
    message: "Platform is currently available for client and staff workflows.",
  },
  backups: {
    enabled: true,
    frequency: "Daily database and storage backups",
    retention: "30-day retention with encrypted snapshots",
  },
};

export type EmailTemplateDefinition = {
  id: string;
  name: string;
  category: "Account" | "Billing" | "Orders" | "Communication" | "Delivery" | "Subscription" | "Support" | "System";
  status: "Draft" | "Published" | "Archived";
  subject: string;
  description: string;
  variables: string[];
  lastUpdated: string;
};

export const emailTemplates: EmailTemplateDefinition[] = [
  {
    id: "welcome",
    name: "Welcome",
    category: "Account",
    status: "Published",
    subject: "Welcome to JMW Studios",
    description: "Welcome a new customer or member to the platform and direct them to the onboarding flow.",
    variables: ["{{customer_name}}", "{{portfolio_url}}"],
    lastUpdated: "2026-08-22",
  },
  {
    id: "verify-email",
    name: "Verify Email",
    category: "Account",
    status: "Published",
    subject: "Verify your email address",
    description: "Ask a user to confirm identity before they access their account or workspace.",
    variables: ["{{customer_name}}", "{{verification_link}}"],
    lastUpdated: "2026-08-21",
  },
  {
    id: "reset-password",
    name: "Reset Password",
    category: "Account",
    status: "Published",
    subject: "Reset your password",
    description: "Help a user recover access to their account by resetting credentials securely.",
    variables: ["{{customer_name}}", "{{reset_link}}"],
    lastUpdated: "2026-08-20",
  },
  {
    id: "payment-confirmation",
    name: "Payment Confirmation",
    category: "Billing",
    status: "Published",
    subject: "Payment confirmation for {{order_number}}",
    description: "Confirm that the payment has been received and the associated order can proceed.",
    variables: ["{{customer_name}}", "{{order_number}}", "{{amount}}"],
    lastUpdated: "2026-08-19",
  },
  {
    id: "order-confirmation",
    name: "Order Confirmation",
    category: "Orders",
    status: "Published",
    subject: "Your order {{order_number}} has been confirmed",
    description: "Send a concise confirmation message once a client order is accepted and scheduled.",
    variables: ["{{customer_name}}", "{{order_number}}", "{{amount}}"],
    lastUpdated: "2026-08-18",
  },
  {
    id: "order-assigned",
    name: "Order Assigned",
    category: "Orders",
    status: "Published",
    subject: "Your order {{order_number}} has been assigned",
    description: "Notify the customer when a staff member or team has been assigned to their order.",
    variables: ["{{customer_name}}", "{{order_number}}", "{{staff_name}}"],
    lastUpdated: "2026-08-17",
  },
  {
    id: "new-message",
    name: "New Message",
    category: "Communication",
    status: "Draft",
    subject: "New message from your project team",
    description: "Inform users that they have a new message in their order or support conversation.",
    variables: ["{{customer_name}}", "{{order_number}}", "{{portfolio_url}}"],
    lastUpdated: "2026-08-16",
  },
  {
    id: "delivery-ready",
    name: "Delivery Ready",
    category: "Delivery",
    status: "Published",
    subject: "Your delivery is ready for review",
    description: "Let the customer know their final project or asset is ready for review and approval.",
    variables: ["{{customer_name}}", "{{order_number}}", "{{portfolio_url}}"],
    lastUpdated: "2026-08-15",
  },
  {
    id: "revision-received",
    name: "Revision Received",
    category: "Delivery",
    status: "Published",
    subject: "Revision feedback received for {{order_number}}",
    description: "Acknowledge revision feedback and indicate when the next round will be prepared.",
    variables: ["{{customer_name}}", "{{order_number}}", "{{portfolio_url}}"],
    lastUpdated: "2026-08-14",
  },
  {
    id: "subscription-renewal",
    name: "Subscription Renewal",
    category: "Subscription",
    status: "Published",
    subject: "Your subscription is renewing",
    description: "Share renewal reminders before or after billing occurs for active subscription plans.",
    variables: ["{{customer_name}}", "{{amount}}", "{{renewal_date}}"],
    lastUpdated: "2026-08-12",
  },
  {
    id: "subscription-expiry",
    name: "Subscription Expiry",
    category: "Subscription",
    status: "Draft",
    subject: "Your subscription is expiring soon",
    description: "Warn customers before their membership or plan expires and point them to renewal options.",
    variables: ["{{customer_name}}", "{{renewal_date}}", "{{portfolio_url}}"],
    lastUpdated: "2026-08-11",
  },
  {
    id: "domain-verified",
    name: "Domain Verified",
    category: "System",
    status: "Published",
    subject: "Your domain has been verified",
    description: "Confirm domain verification and explain the next steps for making the custom domain live.",
    variables: ["{{customer_name}}", "{{domain_name}}", "{{portfolio_url}}"],
    lastUpdated: "2026-08-10",
  },
  {
    id: "support-response",
    name: "Support Response",
    category: "Support",
    status: "Published",
    subject: "A support response is ready for your request",
    description: "Notify customers that a support team member has answered their issue or question.",
    variables: ["{{customer_name}}", "{{ticket_number}}", "{{support_agent}}"],
    lastUpdated: "2026-08-09",
  },
];

export type TemplateCatalogItem = {
  id: string;
  name: string;
  category: string;
  tier: "Free" | "Premium";
  status: "Draft" | "Published" | "Archived";
  version: string;
  sections: string[];
  preview: string;
  lastUpdated: string;
};

export const templateCatalog: TemplateCatalogItem[] = [
  {
    id: "editorial-premium",
    name: "Editorial Premium",
    category: "Portfolio",
    tier: "Premium",
    status: "Published",
    version: "v3.2",
    sections: ["Hero", "About", "Skills", "Projects", "Resume", "Contact"],
    preview: "Black-and-gold premium layout",
    lastUpdated: "Today",
  },
  {
    id: "minimal-portfolio",
    name: "Minimal Portfolio",
    category: "Designer",
    tier: "Free",
    status: "Published",
    version: "v2.8",
    sections: ["Hero", "About", "Experience", "Projects", "Contact"],
    preview: "Elegant, understated editorial layout",
    lastUpdated: "2 days ago",
  },
  {
    id: "data-analyst-modern",
    name: "Data Analyst Modern",
    category: "Analytics",
    tier: "Premium",
    status: "Draft",
    version: "v1.4",
    sections: ["Hero", "Skills", "Projects", "Dashboard", "Testimonials", "Contact"],
    preview: "Strong dashboard storytelling",
    lastUpdated: "5 days ago",
  },
  {
    id: "agency-showcase",
    name: "Agency Showcase",
    category: "Services",
    tier: "Premium",
    status: "Archived",
    version: "v4.0",
    sections: ["Hero", "Services", "Case Studies", "Testimonials", "Blog", "Contact"],
    preview: "Service-first conversion experience",
    lastUpdated: "2 weeks ago",
  },
];

export type ServiceCatalogItem = {
  id: string;
  name: string;
  category: string;
  price: string;
  duration: string;
  packages: string;
  status: "Enabled" | "Disabled";
  revisions: number;
  faqs: number;
  image: string;
};

export const serviceCatalog: ServiceCatalogItem[] = [
  {
    id: "portfolio-development",
    name: "Portfolio Development",
    category: "Web & Brand",
    price: "$1,240",
    duration: "5–7 days",
    packages: "Basic / Professional / Premium",
    status: "Enabled",
    revisions: 2,
    faqs: 5,
    image: "Premium portfolio build",
  },
  {
    id: "power-bi-dashboard",
    name: "Power BI Dashboard",
    category: "Business Intelligence",
    price: "$980",
    duration: "4–6 days",
    packages: "Lite / Executive / Advanced",
    status: "Enabled",
    revisions: 3,
    faqs: 4,
    image: "Executive KPI dashboard",
  },
  {
    id: "cv-resume-writing",
    name: "CV & Resume Writing",
    category: "Career Support",
    price: "$220",
    duration: "2–3 days",
    packages: "Starter / Professional / Executive",
    status: "Enabled",
    revisions: 1,
    faqs: 3,
    image: "Career positioning package",
  },
  {
    id: "research-support",
    name: "Research Support",
    category: "Analytics",
    price: "$1,610",
    duration: "7–10 days",
    packages: "Basic / Strategy / Full Support",
    status: "Disabled",
    revisions: 2,
    faqs: 2,
    image: "Academic and business research",
  },
];

export type StaffAssignmentEntry = {
  name: string;
  role: string;
  skills: string[];
  availability: "Available" | "Busy" | "On Leave";
  workload: string;
  category: string;
  performance: number;
};

export type StaffProfile = {
  id: string;
  name: string;
  email: string;
  role: string;
  skills: string[];
  availability: "Available" | "Busy" | "On Leave";
  assignedOrders: number;
  completedOrders: number;
  customerRating: number;
  performanceStatistics: {
    utilization: string;
    avgReplyHours: string;
    completedThisMonth: number;
  };
  status: "Active" | "On Leave" | "Inactive";
};

export const staffProfiles: StaffProfile[] = [
  {
    id: "STF-101",
    name: "Amina Njeri",
    email: "amina@jmw-studios.co.ke",
    role: "Senior Designer",
    skills: ["Portfolio Design", "UX", "Brand Systems"],
    availability: "Available",
    assignedOrders: 3,
    completedOrders: 18,
    customerRating: 4.9,
    performanceStatistics: {
      utilization: "71%",
      avgReplyHours: "3.2h",
      completedThisMonth: 9,
    },
    status: "Active",
  },
  {
    id: "STF-102",
    name: "Joel Mwangangi",
    email: "joel@jmw-studios.co.ke",
    role: "BI Specialist",
    skills: ["Power BI", "Excel", "Dashboard Design"],
    availability: "Busy",
    assignedOrders: 5,
    completedOrders: 22,
    customerRating: 4.8,
    performanceStatistics: {
      utilization: "92%",
      avgReplyHours: "4.1h",
      completedThisMonth: 11,
    },
    status: "Active",
  },
  {
    id: "STF-103",
    name: "Njeri Kibet",
    email: "njeri@jmw-studios.co.ke",
    role: "Research Analyst",
    skills: ["Research", "SPSS", "Analytics"],
    availability: "Available",
    assignedOrders: 2,
    completedOrders: 14,
    customerRating: 4.7,
    performanceStatistics: {
      utilization: "64%",
      avgReplyHours: "5.4h",
      completedThisMonth: 7,
    },
    status: "Active",
  },
  {
    id: "STF-104",
    name: "David Mutua",
    email: "david@jmw-studios.co.ke",
    role: "Content Strategist",
    skills: ["Messaging", "CV Writing", "Positioning"],
    availability: "On Leave",
    assignedOrders: 1,
    completedOrders: 10,
    customerRating: 4.6,
    performanceStatistics: {
      utilization: "38%",
      avgReplyHours: "6.8h",
      completedThisMonth: 4,
    },
    status: "On Leave",
  },
];

export const staffAssignments: StaffAssignmentEntry[] = [
  {
    name: "Amina Njeri",
    role: "Senior Designer",
    skills: ["Portfolio Design", "UX", "Brand Systems"],
    availability: "Available",
    workload: "3 active orders",
    category: "Web & Brand",
    performance: 96,
  },
  {
    name: "Joel Mwangangi",
    role: "BI Specialist",
    skills: ["Power BI", "Excel", "Dashboard Design"],
    availability: "Busy",
    workload: "5 active orders",
    category: "Business Intelligence",
    performance: 92,
  },
  {
    name: "Njeri Kibet",
    role: "Research Analyst",
    skills: ["Research", "SPSS", "Analytics"],
    availability: "Available",
    workload: "2 active orders",
    category: "Analytics",
    performance: 94,
  },
  {
    name: "David Mutua",
    role: "Content Strategist",
    skills: ["Messaging", "CV Writing", "Positioning"],
    availability: "On Leave",
    workload: "1 active order",
    category: "Career Support",
    performance: 89,
  },
];

export type SupportTicketStatus = "Open" | "In Progress" | "Waiting Customer" | "Resolved" | "Closed";

export type SupportTicket = {
  id: string;
  subject: string;
  category: string;
  priority: "Low" | "Normal" | "High" | "Urgent";
  description: string;
  attachment?: string;
  status: SupportTicketStatus;
  customer: string;
  assignedTo?: string;
  internalNotes?: string;
  createdAt: string;
};

export type ReviewModerationStatus = "Approved" | "Pending" | "Hidden" | "Reported";
export type ReviewEntityType = "Service" | "Completed order" | "Platform";

export type ReviewEntry = {
  id: string;
  entityType: ReviewEntityType;
  customer: string;
  subject: string;
  rating: number;
  reviewText: string;
  source: string;
  status: ReviewModerationStatus;
  reviewer: string;
  moderationNotes: string;
  date: string;
};

export const reviewEntries: ReviewEntry[] = [
  {
    id: "REV-1401",
    entityType: "Service",
    customer: "Grace Wanjiku",
    subject: "Portfolio Development – Professional",
    rating: 5,
    reviewText: "The process felt premium and clear from the beginning. Our portfolio now communicates our value and is easier for clients to trust.",
    source: "Service review",
    status: "Approved",
    reviewer: "Amina Njeri",
    moderationNotes: "Verified against service delivery and no customer text was altered.",
    date: "2026-08-18",
  },
  {
    id: "REV-1403",
    entityType: "Completed order",
    customer: "Daniel Muli",
    subject: "Power BI Dashboard delivery",
    rating: 4,
    reviewText: "The dashboard is strong and saved our weekly review process. We requested a few refinements and the team handled them professionally.",
    source: "Order review",
    status: "Pending",
    reviewer: "Joel Mwangangi",
    moderationNotes: "Awaiting standard moderation before publication.",
    date: "2026-08-17",
  },
  {
    id: "REV-1405",
    entityType: "Platform",
    customer: "Maya Patel",
    subject: "Platform experience",
    rating: 2,
    reviewText: "The platform is okay but these comments look copied from another customer and appear to be spam.",
    source: "Platform review",
    status: "Reported",
    reviewer: "Support Team",
    moderationNotes: "Investigated as potential duplicate/fraudulent review and kept hidden until verified.",
    date: "2026-08-16",
  },
];

export type BlogStatus = "Draft" | "Scheduled" | "Published" | "Archived";
export type BlogEntry = {
  id: string;
  title: string;
  slug: string;
  status: BlogStatus;
  category: string;
  tags: string[];
  author: string;
  publicationDate: string;
  seo: {
    metaTitle: string;
    metaDescription: string;
    focusKeyword: string;
  };
  commentsModerated: boolean;
};

export const blogEntries: BlogEntry[] = [
  {
    id: "BLG-201",
    title: "Portfolio design that earns trust",
    slug: "portfolio-design-that-earns-trust",
    status: "Published",
    category: "Portfolio Tips",
    tags: ["Brand strategy", "Portfolio", "Conversion"],
    author: "Jeremiah Muthama Waita",
    publicationDate: "2026-08-19",
    seo: {
      metaTitle: "Portfolio design that earns trust",
      metaDescription: "Learn how premium portfolio storytelling improves trust, clarity, and conversion for professionals.",
      focusKeyword: "portfolio design",
    },
    commentsModerated: true,
  },
  {
    id: "BLG-202",
    title: "How to position technical work for better opportunities",
    slug: "position-technical-work-for-better-opportunities",
    status: "Draft",
    category: "Career Development",
    tags: ["CV", "Career growth", "Storytelling"],
    author: "Jeremiah Muthama Waita",
    publicationDate: "2026-08-24",
    seo: {
      metaTitle: "Position technical work for better opportunities",
      metaDescription: "A practical guide for translating technical depth into a compelling professional story.",
      focusKeyword: "technical portfolio positioning",
    },
    commentsModerated: true,
  },
  {
    id: "BLG-203",
    title: "What premium portfolio stories do differently",
    slug: "what-premium-portfolio-stories-do-differently",
    status: "Scheduled",
    category: "Design Systems",
    tags: ["Premium design", "Storytelling", "Brand"],
    author: "Jeremiah Muthama Waita",
    publicationDate: "2026-08-30",
    seo: {
      metaTitle: "What premium portfolio stories do differently",
      metaDescription: "An analysis of positioning, hierarchy, and proof that makes professional work feel premium.",
      focusKeyword: "premium portfolio stories",
    },
    commentsModerated: false,
  },
];

export type DomainRecord = {
  id: string;
  domain: string;
  owner: string;
  portfolio: string;
  verificationStatus: "Verified" | "Pending" | "Failed";
  sslStatus: "Active" | "Pending" | "Failed";
  connectedAt: string;
  notes: string;
};

export const domainRecords: DomainRecord[] = [
  {
    id: "DOM-301",
    domain: "gracewanjiku.com",
    owner: "Grace Wanjiku",
    portfolio: "gracewanjiku.com",
    verificationStatus: "Verified",
    sslStatus: "Active",
    connectedAt: "2026-08-16",
    notes: "DNS records verified and SSL certificate active.",
  },
  {
    id: "DOM-302",
    domain: "danielmuli.dev",
    owner: "Daniel Muli",
    portfolio: "danielmuli.dev",
    verificationStatus: "Pending",
    sslStatus: "Pending",
    connectedAt: "2026-08-19",
    notes: "Awaiting TXT verification and certificate provisioning.",
  },
  {
    id: "DOM-303",
    domain: "cynthianjeri.io",
    owner: "Cynthia Njeri",
    portfolio: "cynthianjeri.io",
    verificationStatus: "Failed",
    sslStatus: "Failed",
    connectedAt: "2026-08-20",
    notes: "Failed DNS check. Review CNAME and certificate issuance logs.",
  },
];

export type AnalyticsSummaryItem = {
  label: string;
  value: string;
  change: string;
};

export const analyticsSummary: AnalyticsSummaryItem[] = [
  { label: "User growth", value: "+18.4%", change: "1,284 new users" },
  { label: "Portfolio growth", value: "+21.3%", change: "319 live portfolios" },
  { label: "Projects", value: "1,482", change: "+38 this quarter" },
  { label: "Traffic", value: "52.4k", change: "+12.7% MoM" },
  { label: "Conversion", value: "4.8%", change: "+0.9 pts" },
  { label: "Revenue", value: "$24.8k", change: "+12.4%" },
  { label: "Subscription churn", value: "3.2%", change: "-0.6 pts" },
  { label: "Popular templates", value: "Editorial Premium", change: "38% of new portfolios" },
  { label: "Popular services", value: "Portfolio Development", change: "26% of orders" },
  { label: "Storage usage", value: "82%", change: "3.2 TB used" },
];

export type ReportExportFormat = "CSV" | "Excel" | "PDF";

export type ReportCatalogItem = {
  name: string;
  description: string;
  formats: ReportExportFormat[];
  updatedAt: string;
};

export const reportCatalog: ReportCatalogItem[] = [
  {
    name: "Financial Report",
    description: "Revenue, transaction totals, fees, and payout summaries across the platform.",
    formats: ["CSV", "Excel", "PDF"],
    updatedAt: "Today",
  },
  {
    name: "Revenue Report",
    description: "Monthly revenue trends, order mix, and growth over time by product and region.",
    formats: ["CSV", "Excel", "PDF"],
    updatedAt: "Today",
  },
  {
    name: "Payment Report",
    description: "Gateway activity including successful, pending, failed, and refunded payment records.",
    formats: ["CSV", "Excel"],
    updatedAt: "2 hours ago",
  },
  {
    name: "Orders Report",
    description: "Orders by status, service category, fulfillment time, and assignment activity.",
    formats: ["CSV", "Excel", "PDF"],
    updatedAt: "Today",
  },
  {
    name: "Users Report",
    description: "Account growth, active usage, churn, and portfolio adoption across customer segments.",
    formats: ["CSV", "Excel"],
    updatedAt: "Yesterday",
  },
  {
    name: "Subscriptions Report",
    description: "Plan performance, renewals, downgrades, cancellations, and churn review.",
    formats: ["CSV", "Excel", "PDF"],
    updatedAt: "Yesterday",
  },
  {
    name: "Portfolio Report",
    description: "Portfolio publishing, section completion, custom-domain usage, and audience metrics.",
    formats: ["CSV", "Excel", "PDF"],
    updatedAt: "2 days ago",
  },
  {
    name: "Storage Report",
    description: "Storage utilization, project image usage, media growth, and quota trends.",
    formats: ["CSV", "Excel", "PDF"],
    updatedAt: "2 days ago",
  },
  {
    name: "Staff Performance Report",
    description: "Team delivery, utilization, assigned orders, and customer satisfaction across staff.",
    formats: ["CSV", "Excel", "PDF"],
    updatedAt: "3 days ago",
  },
];

export const supportTickets: SupportTicket[] = [
  {
    id: "SUP-801",
    subject: "Need help publishing my portfolio",
    category: "Portfolio",
    priority: "High",
    description: "My portfolio is ready but I need help verifying the domain and publishing the site for launch.",
    attachment: "launch-checklist.pdf",
    status: "Open",
    customer: "Grace Wanjiku",
    assignedTo: "Amina Njeri",
    internalNotes: "Customer needs domain verification and final publication checklist.",
    createdAt: "2026-08-21 12:05",
  },
  {
    id: "SUP-802",
    subject: "Invoice request for M-Pesa payment",
    category: "Billing",
    priority: "Normal",
    description: "I need confirmation that the latest payment has been reconciled and I need a downloadable invoice.",
    status: "In Progress",
    customer: "Daniel Muli",
    assignedTo: "Joel Mwangangi",
    internalNotes: "Finance review complete; awaiting final invoice generation.",
    createdAt: "2026-08-21 14:52",
  },
  {
    id: "SUP-803",
    subject: "Question about features included in the Professional plan",
    category: "Subscription",
    priority: "Low",
    description: "I want to confirm whether custom domain setup and analytics depth are included before upgrading.",
    status: "Waiting Customer",
    customer: "Maya Patel",
    assignedTo: "Support Team",
    internalNotes: "Customer requested a plan comparison before purchase decision.",
    createdAt: "2026-08-20 10:10",
  },
];

export type RoleDefinition = {
  id: string;
  name: "Super Admin" | "Admin" | "Finance Admin" | "Support Agent" | "Content Manager" | "Staff" | "Customer";
  description: string;
  permissions: string[];
};

export const roleCatalog: RoleDefinition[] = [
  {
    id: "role-super-admin",
    name: "Super Admin",
    description: "Full platform access with escalation and systemwide governance authority.",
    permissions: [
      "users.view",
      "users.update",
      "users.suspend",
      "orders.view",
      "orders.assign",
      "orders.update",
      "payments.view",
      "payments.refund",
      "templates.create",
      "templates.update",
      "reports.view",
    ],
  },
  {
    id: "role-admin",
    name: "Admin",
    description: "Operational management of users, portfolios, projects, and platform logic.",
    permissions: [
      "users.view",
      "users.update",
      "orders.view",
      "orders.assign",
      "payments.view",
      "templates.create",
      "reports.view",
    ],
  },
  {
    id: "role-finance-admin",
    name: "Finance Admin",
    description: "Payment reconciliation, refund oversight, and financial reporting access.",
    permissions: [
      "payments.view",
      "payments.refund",
      "orders.view",
      "reports.view",
    ],
  },
  {
    id: "role-support-agent",
    name: "Support Agent",
    description: "Customer support workflows, ticket updates, and issue resolution. ",
    permissions: [
      "orders.view",
      "users.view",
      "reports.view",
    ],
  },
  {
    id: "role-content-manager",
    name: "Content Manager",
    description: "Blog, template, and content publication governance.",
    permissions: [
      "templates.create",
      "templates.update",
      "reports.view",
    ],
  },
  {
    id: "role-staff",
    name: "Staff",
    description: "Assigned work queue visibility and order collaboration for delivery teams.",
    permissions: [
      "orders.view",
      "orders.update",
    ],
  },
  {
    id: "role-customer",
    name: "Customer",
    description: "Own account, portfolio, and service access for personal workspace operations.",
    permissions: [
      "orders.view",
      "users.view",
    ],
  },
];

export type PermissionCatalogItem = {
  key: string;
  label: string;
  description: string;
};

export const permissionCatalog: PermissionCatalogItem[] = [
  { key: "users.view", label: "View users", description: "Read user account metadata and status." },
  { key: "users.update", label: "Update users", description: "Modify user records or account settings." },
  { key: "users.suspend", label: "Suspend users", description: "Temporarily block a user account." },
  { key: "orders.view", label: "View orders", description: "Read order records and workflow information." },
  { key: "orders.assign", label: "Assign orders", description: "Allocate staff and transfer responsibility for delivery." },
  { key: "orders.update", label: "Update orders", description: "Change operational status and workflow progress." },
  { key: "payments.view", label: "View payments", description: "Review gateway and transaction data." },
  { key: "payments.refund", label: "Process refunds", description: "Approve or reject refund actions and reconcile financial records." },
  { key: "templates.create", label: "Create templates", description: "Add or publish reusable portfolio templates." },
  { key: "templates.update", label: "Update templates", description: "Modify template configuration and publication state." },
  { key: "reports.view", label: "View reports", description: "Access operational and financial reports." },
];

export type AuditEntry = {
  actor: string;
  action: string;
  resource: string;
  resourceId: string;
  oldValue?: string;
  newValue?: string;
  ip?: string;
  userAgent?: string;
  timestamp: string;
};

export const adminAuditEntries: AuditEntry[] = [
  {
    actor: "System Admin",
    action: "User suspension",
    resource: "users",
    resourceId: "USR-214",
    oldValue: "Active",
    newValue: "Suspended",
    ip: "203.0.113.17",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    timestamp: "2026-08-23 09:14",
  },
  {
    actor: "Finance Admin",
    action: "Refund",
    resource: "refunds",
    resourceId: "RFD-441",
    oldValue: "Pending review",
    newValue: "Approved and processed",
    ip: "198.51.100.22",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    timestamp: "2026-08-23 08:48",
  },
  {
    actor: "Content Manager",
    action: "Template publication",
    resource: "templates",
    resourceId: "TMP-31",
    oldValue: "Draft",
    newValue: "Published",
    ip: "192.0.2.44",
    userAgent: "Mozilla/5.0 (X11; Linux x86_64)",
    timestamp: "2026-08-22 17:10",
  },
  {
    actor: "Super Admin",
    action: "Permission change",
    resource: "role_permissions",
    resourceId: "RP-88",
    oldValue: "users.view",
    newValue: "users.suspend",
    ip: "203.0.113.27",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    timestamp: "2026-08-22 12:04",
  },
];

