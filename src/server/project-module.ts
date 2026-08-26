import { z } from "zod";

export const projectModuleSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(3, "Project title is required."),
  slug: z.string().trim().min(2, "Project slug is required."),
  description: z.string().trim().min(20, "Project description is required."),
  category: z.string().trim().min(2, "Category is required."),
  technologies: z.array(z.string().trim().min(1)).min(1, "Add at least one technology."),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  ownerId: z.string().optional(),
});

export type ProjectModuleInput = z.infer<typeof projectModuleSchema>;

export const projectModule = {
  create: async function createProject(input: ProjectModuleInput) {
    const validated = projectModuleSchema.parse(input);
    return { ok: true, project: { ...validated, status: "draft" } };
  },
  edit: async function editProject(id: string, input: Partial<ProjectModuleInput>) {
    return { ok: true, id, project: { id, ...projectModuleSchema.partial().parse(input) } };
  },
  delete: async function deleteProject(id: string, ownerId?: string) {
    return { ok: true, id, ownerId, deleted: true };
  },
  archive: async function archiveProject(id: string) {
    return { ok: true, id, status: "archived" };
  },
  publish: async function publishProject(id: string, ownerId?: string) {
    return { ok: true, id, ownerId, status: "published", publishedAt: new Date().toISOString() };
  },
  feature: async function featureProject(id: string, featured: boolean) {
    return { ok: true, id, featured };
  },
  duplicate: async function duplicateProject(id: string) {
    return { ok: true, id, duplicatedFrom: id, status: "draft" };
  },
  slugify: function slugify(value: string) {
    return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "project";
  },
  validateOwnership: function validateOwnership(ownerId: string | undefined, currentUserId?: string) {
    if (!ownerId || !currentUserId) return false;
    return ownerId === currentUserId;
  },
};

export const projectImageModule = {
  uploadSingle: async function uploadSingle(file: { name: string; size: number; type: string }, ownerId?: string) {
    return { ok: true, fileName: file.name, size: file.size, type: file.type, ownerId, processed: false };
  },
  uploadMultiple: async function uploadMultiple(files: Array<{ name: string; size: number; type: string }>, ownerId?: string) {
    return { ok: true, files: files.map((file) => ({ ...file, ownerId, processed: false })) };
  },
  validate: function validateImage(file: { type: string; size: number }) {
    const allowedTypes = ["image/png", "image/jpeg", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) throw new Error("Unsupported image type.");
    if (file.size > 10 * 1024 * 1024) throw new Error("Image exceeds the 10MB limit.");
    return true;
  },
  reorder: async function reorderImages(ids: string[], order: string[]) {
    return { ok: true, ids, order };
  },
  setCover: async function setCover(projectId: string, imageId: string) {
    return { ok: true, projectId, imageId, isCover: true };
  },
  delete: async function deleteImage(imageId: string) {
    return { ok: true, imageId, deleted: true };
  },
};

export const imageProcessingService = {
  process: async function processImage(file: { type: string; size: number; name: string }) {
    projectImageModule.validate(file);
    return {
      ok: true,
      originalName: file.name,
      mimeType: file.type,
      stages: ["received", "validated", "resized", "compressed", "thumbnail-generated", "uploaded", "metadata-saved"],
      async: true,
    };
  },
};

export const mediaModule = {
  upload: async function uploadMedia(resource: { ownerId?: string; kind: string; fileName: string; size: number }) {
    return { ok: true, resource, ownerId: resource.ownerId, tracked: true };
  },
  delete: async function deleteMedia(id: string) {
    return { ok: true, id, deleted: true };
  },
  getUsage: function getUsage() {
    return { profilePictures: 0, projectImages: 0, blogImages: 0, resumes: 0, orderFiles: 0, portfolioAssets: 0 };
  },
};
