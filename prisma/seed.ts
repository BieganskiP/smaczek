import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("Błąd: Ustaw DATABASE_URL w pliku .env");
  process.exit(1);
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

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "karma-dla-psow" },
      update: {},
      create: {
        name: "Karma dla psów",
        slug: "karma-dla-psow",
        description: "Wysokiej jakości karma dla psów wszystkich ras i rozmiarów",
      },
    }),
    prisma.category.upsert({
      where: { slug: "karma-dla-kotow" },
      update: {},
      create: {
        name: "Karma dla kotów",
        slug: "karma-dla-kotow",
        description: "Pełnowartościowa karma dla kotów domowych",
      },
    }),
    prisma.category.upsert({
      where: { slug: "przysmaki" },
      update: {},
      create: {
        name: "Przysmaki",
        slug: "przysmaki",
        description: "Smaczne przysmaki i nagrody dla zwierząt",
      },
    }),
    prisma.category.upsert({
      where: { slug: "akcesoria" },
      update: {},
      create: {
        name: "Akcesoria",
        slug: "akcesoria",
        description: "Miski, zabawki i inne akcesoria dla zwierząt",
      },
    }),
  ]);

  console.log(`Created ${categories.length} categories`);

  // Create products
  const products = [
    {
      name: "Royal Canin Medium Adult",
      slug: "royal-canin-medium-adult",
      description:
        "Karma sucha dla dorosłych psów średnich ras (11-25 kg). Zbilansowana formuła z wysoką zawartością białka wspierająca masę mięśniową. Wzbogacona o kwasy EPA i DHA dla zdrowej skóry i lśniącej sierści. Opakowanie 15 kg.",
      price: 249.99,
      stock: 50,
      categoryId: categories[0].id,
    },
    {
      name: "Purina Pro Plan Adult Chicken",
      slug: "purina-pro-plan-adult-chicken",
      description:
        "Karma sucha dla dorosłych psów z kurczakiem. Formuła OPTIDIGEST dla zdrowego trawienia. Bogata w białko zwierzęce dla silnych mięśni. Opakowanie 12 kg.",
      price: 189.99,
      stock: 35,
      categoryId: categories[0].id,
    },
    {
      name: "Hill's Science Plan Adult Large",
      slug: "hills-science-plan-adult-large",
      description:
        "Karma sucha dla dorosłych psów dużych ras. Klinicznie potwierdzona formuła z antyoksydantami dla wsparcia odporności. Zdrowe stawy i sprawny ruch. Opakowanie 14 kg.",
      price: 279.99,
      stock: 25,
      categoryId: categories[0].id,
    },
    {
      name: "Whiskas Adult z Kurczakiem",
      slug: "whiskas-adult-z-kurczakiem",
      description:
        "Karma sucha dla dorosłych kotów z kurczakiem. Pełnowartościowa, zbilansowana karma codzienna. Wspiera zdrowie układu moczowego. Opakowanie 7 kg.",
      price: 89.99,
      stock: 60,
      categoryId: categories[1].id,
    },
    {
      name: "Royal Canin Indoor 27",
      slug: "royal-canin-indoor-27",
      description:
        "Karma sucha dla kotów domowych żyjących wewnątrz. Redukuje zapach odchodów. Kontrola masy ciała. Wspiera trawienie. Opakowanie 10 kg.",
      price: 199.99,
      stock: 40,
      categoryId: categories[1].id,
    },
    {
      name: "Felix Fantastic z Wołowiną",
      slug: "felix-fantastic-z-wolowina",
      description:
        "Karma mokra dla dorosłych kotów z wołowiną w galaretce. Soczyste kawałki mięsa w pysznej galaretce. Pakiet 12 x 85g.",
      price: 29.99,
      stock: 100,
      categoryId: categories[1].id,
    },
    {
      name: "Pedigree Dentastix Medium",
      slug: "pedigree-dentastix-medium",
      description:
        "Przysmaki dentystyczne dla psów średnich ras (10-25 kg). Klinicznie potwierdzone oczyszczanie zębów. Codzienne wsparcie higieny jamy ustnej. Opakowanie 28 sztuk.",
      price: 39.99,
      stock: 80,
      categoryId: categories[2].id,
    },
    {
      name: "Dreamies z Łososiem",
      slug: "dreamies-z-lososiem",
      description:
        "Przysmaki dla kotów o smaku łososia. Chrupiące na zewnątrz, kremowe w środku. Idealne jako nagroda. Opakowanie 180 g.",
      price: 14.99,
      stock: 150,
      categoryId: categories[2].id,
    },
    {
      name: "Miska ceramiczna dla kota",
      slug: "miska-ceramiczna-dla-kota",
      description:
        "Elegancka miska ceramiczna z motywem łapek. Pojemność 300 ml. Antypoślizgowa podstawa. Można myć w zmywarce. Idealna na karmę mokrą.",
      price: 34.99,
      stock: 45,
      categoryId: categories[3].id,
    },
    {
      name: "Kong Classic Large",
      slug: "kong-classic-large",
      description:
        "Kultowa zabawka dla psów dużych ras. Wykonana z naturalnej gumy. Można wypełnić smakołykami. Odporna na gryzienie. Stymuluje mentalnie.",
      price: 59.99,
      stock: 30,
      categoryId: categories[3].id,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }

  console.log(`Created ${products.length} products`);
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
