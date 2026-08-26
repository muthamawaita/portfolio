export type TemplateDefinition = {
  id: string;
  name: string;
  category: string;
  version: string;
  preview: string;
  supportedSections: string[];
  defaultStyles: Record<string, string>;
  premium: boolean;
};

export const templateConfigs: Record<string, TemplateDefinition> = {
  developerModern: {
    id: "developer-modern",
    name: "Developer Modern",
    category: "Developer",
    version: "1.0.0",
    preview: "/templates/developer-modern/preview.jpg",
    supportedSections: ["hero", "about", "skills", "projects", "experience", "contact"],
    defaultStyles: { primary: "#111111", accent: "#d4af37" },
    premium: false,
  },
  dataAnalyst: {
    id: "data-analyst",
    name: "Data Analyst",
    category: "Data Analytics",
    version: "1.0.0",
    preview: "/templates/data-analyst/preview.jpg",
    supportedSections: ["hero", "about", "skills", "projects", "resume", "contact"],
    defaultStyles: { primary: "#0f172a", accent: "#38bdf8" },
    premium: true,
  },
  designer: {
    id: "designer",
    name: "Designer",
    category: "Design",
    version: "1.0.0",
    preview: "/templates/designer/preview.jpg",
    supportedSections: ["hero", "about", "projects", "services", "testimonials", "contact"],
    defaultStyles: { primary: "#1f2937", accent: "#f59e0b" },
    premium: false,
  },
  photographer: {
    id: "photographer",
    name: "Photographer",
    category: "Photography",
    version: "1.0.0",
    preview: "/templates/photographer/preview.jpg",
    supportedSections: ["hero", "gallery", "about", "contact"],
    defaultStyles: { primary: "#111827", accent: "#fbbf24" },
    premium: false,
  },
};

export const DEFAULT_TEMPLATE_CATALOG: TemplateDefinition[] = Object.values(templateConfigs);

export const templateSchema = {
  safeParse: (value: Record<string, unknown>) => {
    const isValid =
      typeof value.id === "string" &&
      typeof value.name === "string" &&
      typeof value.category === "string" &&
      typeof value.version === "string" &&
      typeof value.preview === "string" &&
      Array.isArray(value.supportedSections) &&
      typeof value.defaultStyles === "object" &&
      typeof value.premium === "boolean";

    return { success: isValid, data: value };
  },
};
