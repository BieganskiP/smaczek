import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  AlertCircle,
  Truck,
  ShieldCheck,
  Leaf,
} from "lucide-react";
import { ProductCard } from "@/components/shop/product-card";
import { HeroSection } from "@/components/shop/hero-section";

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
    const categoriesWithProducts = categories.filter((c) => c._count.products > 0);
    return { featuredProducts, categories: categoriesWithProducts, dbError: null };
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
      {/* Hero — pełna szerokość, gotowy na video w tle (ustaw HERO_VIDEO_URL w .env) */}
      <HeroSection />

      {/* Pasek zaufania — krótkie hasła pod hero */}
      <section className="border-y border-border/40 bg-background py-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-8 px-4 text-center text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <Truck className="size-5 text-primary" aria-hidden />
            Szybka dostawa
          </span>
          <span className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-primary" aria-hidden />
            Bezpieczna płatność
          </span>
          <span className="flex items-center gap-2">
            <Leaf className="size-5 text-primary" aria-hidden />
            Świeże produkty
          </span>
        </div>
      </section>

      {/* Najnowsze produkty — czarne tło */}
      {featuredProducts.length > 0 && (
        <section className="relative bg-black py-20">
          <div className="relative mx-auto max-w-7xl px-4">
            <div className="mb-10 flex items-center justify-between">
              <h2 className="animate-fade-up text-3xl font-bold text-foreground">
                Najnowsze produkty
              </h2>
              <Link href="/produkty">
                <Button
                  variant="outline"
                  size="sm"
                  className="hover-lift-strong gap-2 border-primary/30 bg-card text-card-foreground shadow-sm"
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

      {/* Kategorie — szare tło */}
      {categories.length > 0 && (
        <section className="bg-muted/50 py-20">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="animate-fade-up mb-10 text-3xl font-bold">
              Kategorie
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((category, index) => (
                <Link
                  key={category.id}
                  href={`/produkty?kategoria=${category.slug}`}
                  className="group animate-fade-up block"
                  style={{ animationDelay: `${index * 70 + 100}ms` }}
                >
                  <Card className="hover-lift-strong shimmer-on-hover border-border/60 shadow-soft">
                    <CardContent className="p-6">
                      <h3 className="font-semibold transition-colors group-hover:text-primary">
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

      {/* CTA — zachęta do /o-nas i /kontakt */}
      <section className="border-t border-border/40 bg-background py-16">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Poznaj naszą historię i sposób na świeże, domowe smaki. Masz
            pytania? Chętnie pomożemy.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link href="/o-nas">
              <Button variant="outline" size="lg" className="gap-2">
                O nas
                <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/kontakt">
              <Button size="lg" className="gap-2">
                Skontaktuj się
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
