import type { PrismaClient } from "@prisma/client";

type ContactLeadLikeRecord = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  service?: string | null;
  message: string;
  status: string;
  createdAt: Date;
};

type ContactLeadLikeDelegate = {
  count: (args?: Record<string, unknown>) => Promise<number>;
  findMany: (args?: Record<string, unknown>) => Promise<ContactLeadLikeRecord[]>;
};

export function getContactLeadDelegate(db: PrismaClient): ContactLeadLikeDelegate | null {
  if ("contactLead" in db && db.contactLead) return db.contactLead as ContactLeadLikeDelegate;
  if ("contactMessage" in db && db.contactMessage) return db.contactMessage as ContactLeadLikeDelegate;
  if ("lead" in db && db.lead) return db.lead as ContactLeadLikeDelegate;
  return null;
}
