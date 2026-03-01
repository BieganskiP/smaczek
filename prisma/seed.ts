import "dotenv/config";
import { readFileSync } from "fs";
import { join } from "path";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

// --- Types for data/*.json ---
type RawProduct = {
  url?: string;
  name: string;
  short_description?: string;
  description?: string;
  price?: string;
  images?: string[];
  categories?: string[];
  attributes?: Record<string, string>;
};

// --- Helpers for data seed ---
function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[ą]/g, "a")
    .replace(/[ć]/g, "c")
    .replace(/[ę]/g, "e")
    .replace(/[ł]/g, "l")
    .replace(/[ń]/g, "n")
    .replace(/[ó]/g, "o")
    .replace(/[ś]/g, "s")
    .replace(/[źż]/g, "z")
    .replace(/[^a-z0-9-]/g, "");
}

function slugFromUrl(url: string): string | null {
  if (!url || typeof url !== "string") return null;
  try {
    const path = new URL(url).pathname;
    const match = path.match(/\/produkt\/([^/]+)\/?$/);
    return match ? match[1].replace(/\/$/, "") : null;
  } catch {
    return null;
  }
}

function parsePrice(priceStr: string): number {
  if (!priceStr || typeof priceStr !== "string") return 0;
  const normalized = priceStr.replace(/,/g, ".").replace(/[^\d.]/g, "").trim();
  const value = parseFloat(normalized);
  return Number.isNaN(value) ? 0 : value;
}

const DATA_CATEGORY_TO_SLUG: Record<string, string> = {
  "karmy dla kotka": "karma-dla-kotow",
  "karmy dla pieska": "karma-dla-psow",
};

function slugForCategoryName(name: string): string {
  return DATA_CATEGORY_TO_SLUG[name] ?? slugify(name);
}

let connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("Błąd: Ustaw DATABASE_URL w pliku .env");
  process.exit(1);
}
// Jawny sslmode=verify-full usuwa ostrzeżenie pg-connection-string
try {
  const url = new URL(connectionString);
  const ssl = url.searchParams.get("sslmode");
  if (ssl === "require" || ssl === "prefer" || ssl === "verify-ca") {
    url.searchParams.set("sslmode", "verify-full");
    connectionString = url.toString();
  }
} catch {
  /* zostaw connectionString bez zmian */
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@smaczek.pl" },
    update: {},
    create: {
      email: "admin@smaczek.pl",
      firstName: "Administrator",
      lastName: "System",
      phone: "123456789",
      address: "ul. Admina 1",
      city: "Warszawa",
      postalCode: "00-001",
      passwordHash: adminPassword,
      role: "ADMIN",
    },
  });
  console.log(`Admin user: ${admin.email}`);

  // Create test user
  const userPassword = await bcrypt.hash("user1234", 12);
  const user = await prisma.user.upsert({
    where: { email: "jan@example.com" },
    update: {},
    create: {
      email: "jan@example.com",
      firstName: "Jan",
      lastName: "Kowalski",
      phone: "987654321",
      address: "ul. Kwiatowa 15/3",
      city: "Kraków",
      postalCode: "30-001",
      passwordHash: userPassword,
      role: "USER",
    },
  });
  console.log(`Test user: ${user.email}`);

  // --- Seed only from data/produkty.json and data/produkty-kotka.json ---
  const dataDir = join(process.cwd(), "data");
  const dataFiles = ["produkty.json", "produkty-kotka.json"];
  const allRaw: RawProduct[] = [];

  for (const file of dataFiles) {
    const filePath = join(dataDir, file);
    try {
      const content = readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(content) as RawProduct[];
      if (Array.isArray(parsed)) allRaw.push(...parsed);
    } catch (err) {
      console.warn(`Could not load ${file}:`, err instanceof Error ? err.message : err);
    }
  }

  if (allRaw.length === 0) {
    console.log("No data products to seed (data files missing or empty).");
  } else {
    const uniqueCategoryNames = new Set<string>();
    for (const p of allRaw) {
      if (p.categories?.length) {
        p.categories.forEach((c) => uniqueCategoryNames.add(c));
      }
    }

    const defaultCategorySlug = "inne";
    await prisma.category.upsert({
      where: { slug: defaultCategorySlug },
      update: {},
      create: {
        name: "Inne",
        slug: defaultCategorySlug,
        description: "Inne produkty",
      },
    });

    const categorySlugs = new Set<string>([defaultCategorySlug]);
    for (const name of uniqueCategoryNames) {
      const slug = slugForCategoryName(name);
      categorySlugs.add(slug);
      await prisma.category.upsert({
        where: { slug },
        update: {},
        create: {
          name,
          slug,
          description: null,
        },
      });
    }
    console.log(`Upserted ${categorySlugs.size} categories from data`);

    let seeded = 0;
    let skipped = 0;
    for (const raw of allRaw) {
      const slug = slugFromUrl(raw.url ?? "") ?? slugify(raw.name);
      const categoryName = raw.categories?.[0];
      const slugForCat = categoryName ? slugForCategoryName(categoryName) : defaultCategorySlug;
      const category = await prisma.category.findUnique({ where: { slug: slugForCat } });
      if (!category) {
        skipped++;
        continue;
      }
      const price = parsePrice(raw.price ?? "");
      const imageUrl = raw.images?.[0] ?? null;
      const description = raw.description ?? raw.short_description ?? "";
      if (!description.trim()) {
        skipped++;
        continue;
      }

      await prisma.product.upsert({
        where: { slug },
        update: {
          name: raw.name,
          description,
          shortDescription: raw.short_description ?? null,
          price,
          imageUrl,
          categoryId: category.id,
          attributes: raw.attributes ?? undefined,
        },
        create: {
          name: raw.name,
          slug,
          description,
          shortDescription: raw.short_description ?? null,
          price,
          imageUrl,
          stock: 0,
          categoryId: category.id,
          attributes: raw.attributes ?? undefined,
        },
      });
      seeded++;
    }
    console.log(`Seeded ${seeded} products from data (${skipped} skipped).`);
  }

  console.log("Seeding complete!");
  console.log("\nLogin credentials:");
  console.log("  Admin: admin@smaczek.pl / admin123");
  console.log("  User:  jan@example.com / user1234");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
