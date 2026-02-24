import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, PawPrint, Truck, Shield, AlertCircle } from "lucide-react";
import { ProductCard } from "@/components/shop/product-card";

async function getHomePageData() {
  try {
    const [featuredProducts, categories] = await Promise.all([
      prisma.product.findMany({
        where: { active: true },
        orderBy: { createdAt: "desc" },
        take: 8,
        include: { category: true },
      }),
      prisma.category.findMany({
        orderBy: { name: "asc" },
        include: { _count: { select: { products: true } } },
      }),
    ]);
    return { featuredProducts, categories, dbError: null };
  } catch (error) {
    console.error("Database error on homepage:", error);
    return {
      featuredProducts: [],
      categories: [],
      dbError:
        error instanceof Error ? error.message : "Błąd połączenia z bazą",
    };
  }
}

export default async function HomePage() {
  const { featuredProducts, categories, dbError } = await getHomePageData();

  return (
    <div>
      {dbError && (
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center gap-2 rounded-lg border border-amber-500/50 bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-200">
            <AlertCircle className="size-5 shrink-0" />
            <div>
              <h3 className="font-semibold">Baza danych niedostępna</h3>
              <p className="text-sm opacity-90">
                Uruchom PostgreSQL i wykonaj:{" "}
                <code className="rounded bg-amber-500/20 px-1">
                  npm run db:push
                </code>{" "}
                oraz{" "}
                <code className="rounded bg-amber-500/20 px-1">
                  npm run db:seed
                </code>
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Hero */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-linear-to-b from-primary/10 via-primary/5 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--primary)/0.08),transparent_50%)]" />
        <div className="relative mx-auto max-w-7xl px-4 text-center">
          <div className="mx-auto mb-8 flex size-20 items-center justify-center rounded-2xl bg-primary/10 shadow-card">
            <PawPrint className="size-10 text-primary" />
          </div>
          <h1 className="mb-5 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Najlepsza karma
            <br />
            <span className="bg-linear-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              dla Twojego pupila
            </span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Szeroki wybór wysokiej jakości karmy dla psów, kotów i innych
            zwierząt domowych. Dostarczamy prosto pod Twoje drzwi.
          </p>
          <Link href="/produkty">
            <Button
              size="lg"
              className="gap-2 shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              Przeglądaj produkty
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="relative py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Truck,
                title: "Darmowa dostawa",
                desc: "Przy zamówieniach powyżej 150 zł",
              },
              {
                icon: Shield,
                title: "Bezpieczne płatności",
                desc: "Płatność przez PayU",
              },
              {
                icon: PawPrint,
                title: "Najwyższa jakość",
                desc: "Tylko sprawdzone marki",
              },
            ].map((item) => (
              <Card
                key={item.title}
                className="border-border/60 bg-card/80 shadow-soft transition-smooth hover:shadow-card hover:border-primary/20"
              >
                <CardContent className="flex items-center gap-5 p-6">
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 shadow-sm">
                    <item.icon className="size-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {item.desc}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="mb-10 text-3xl font-bold">Kategorie</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/produkty?kategoria=${category.slug}`}
                  className="group block"
                >
                  <Card className="border-border/60 shadow-soft transition-smooth group-hover:shadow-card group-hover:-translate-y-0.5 group-hover:border-primary/20">
                    <CardContent className="p-6">
                      <h3 className="font-semibold group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {category._count.products} produktów
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="relative py-20">
          <div className="absolute inset-0 bg-linear-to-b from-muted/30 to-transparent" />
          <div className="relative mx-auto max-w-7xl px-4">
            <div className="mb-10 flex items-center justify-between">
              <h2 className="text-3xl font-bold">Najnowsze produkty</h2>
              <Link href="/produkty">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 shadow-sm transition-all hover:shadow-md"
                >
                  Zobacz wszystkie
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
