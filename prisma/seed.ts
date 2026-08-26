import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
async function main() { await prisma.tenant.upsert({ where: { slug: "default" }, update: {}, create: { name: "Default Portfolio", slug: "default" } }); }
main().finally(() => prisma.$disconnect());