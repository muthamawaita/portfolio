export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatCurrency(amount: number, currency = "KES") {
  return `${currency} ${amount.toLocaleString()}`;
}

export function formatDate(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function buildImageUrl(path: string) {
  return path.startsWith("http") ? path : `/storage/${path.replace(/^\/+/, "")}`;
}

export function paginate(input: { page: number; pageSize: number; total: number }) {
  const page = Math.max(1, input.page);
  const pageSize = Math.max(1, input.pageSize);
  const totalPages = Math.max(1, Math.ceil(input.total / pageSize));

  return {
    page,
    pageSize,
    total: input.total,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
  };
}
