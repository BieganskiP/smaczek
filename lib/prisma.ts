import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  let connectionString = process.env.DATABASE_URL!;
  // Zapobiega ostrzeżeniu pg-connection-string: używaj jawnie sslmode=verify-full
  try {
    const url = new URL(connectionString);
    const ssl = url.searchParams.get("sslmode");
    if (ssl === "require" || ssl === "prefer" || ssl === "verify-ca") {
      url.searchParams.set("sslmode", "verify-full");
      connectionString = url.toString();
    }
  } catch {
    // nie zmieniaj connectionString przy błędzie parsowania
  }
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
