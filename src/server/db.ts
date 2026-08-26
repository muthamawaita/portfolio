import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export function requireDatabaseUrl() {
	if (!process.env.DATABASE_URL) {
		throw new Error("DATABASE_URL is missing. Copy .env.example to .env.local and set a MySQL connection string before using database features.");
	}
	return process.env.DATABASE_URL;
}

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
