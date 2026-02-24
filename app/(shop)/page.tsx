import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, AlertCircle } from "lucide-react";
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
      <section className="relative overflow-hidden py-20 lg:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_20%_10%,hsl(var(--primary)/0.12),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_80%_75%,hsl(var(--primary)/0.08),transparent_55%)]" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <div className="animate-fade-up mb-5 inline-flex rounded-full border border-primary/35 bg-primary/10 px-4 py-1.5 text-xs font-medium tracking-wide text-primary">
              Smaczek Kłaczek • sklep premium
            </div>

            <h1 className="animate-fade-up text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl [animation-delay:80ms]">
              Lepsza karma.
              <br />
              <span className="bg-linear-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Zdrowszy pupil.
              </span>
            </h1>

            <p className="animate-fade-up mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground [animation-delay:180ms]">
              Starannie wyselekcjonowana oferta karm i przysmaków dla psów i
              kotów. Wysoka jakość, szybka dostawa i wygodne zakupy online.
            </p>

            <div className="animate-fade-up mt-8 flex flex-wrap items-center gap-3 [animation-delay:260ms]">
              <Link href="/produkty">
                <Button
                  size="lg"
                  className="hover-lift-strong gap-2 border border-primary/35 bg-primary shadow-md"
                >
                  Zobacz ofertę
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link href="/dostawa">
                <Button
                  variant="outline"
                  size="lg"
                  className="hover-lift-strong border-primary/30 bg-card"
                >
                  Dostawa i płatności
                </Button>
              </Link>
            </div>

            <div className="animate-fade-up mt-8 flex flex-wrap gap-6 text-sm text-muted-foreground [animation-delay:340ms]">
              <p>✓ Darmowa dostawa od 150 zł</p>
              <p>✓ Bezpieczne płatności PayU</p>
              <p>✓ Tylko sprawdzone marki</p>
            </div>
          </div>

          <div className="animate-fade-up [animation-delay:180ms]">
            <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/80 p-6 shadow-card backdrop-blur">
              <div className="absolute -right-20 -top-20 size-48 rounded-full bg-primary/10 blur-3xl" />
              <div className="absolute -bottom-20 -left-16 size-44 rounded-full bg-primary/10 blur-3xl" />

              <div className="relative space-y-4">
                <div className="rounded-2xl border border-primary/25 bg-primary/10 p-4">
                  <p className="text-xs uppercase tracking-wide text-primary/90">
                    Polecane
                  </p>
                  <p className="mt-1 text-lg font-semibold">
                    Najnowsze receptury premium
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Świeżo dodane produkty od topowych producentów.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-border/70 bg-muted/40 p-4">
                    <p className="text-xs text-muted-foreground">Dostawa</p>
                    <p className="mt-1 text-xl font-semibold text-primary">
                      24-48h
                    </p>
                  </div>
                  <div className="rounded-xl border border-border/70 bg-muted/40 p-4">
                    <p className="text-xs text-muted-foreground">Oceny klientów</p>
                    <p className="mt-1 text-xl font-semibold text-primary">
                      4.9/5
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-border/70 bg-card p-4">
                  <p className="text-sm text-muted-foreground">
                    „W końcu sklep, w którym szybko znajduję karmę idealną dla
                    mojego psa.”
                  </p>
                  <p className="mt-2 text-sm font-medium">— Klient Smaczek Kłaczek</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="animate-fade-up mb-10 text-3xl font-bold">Kategorie</h2>
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
              <h2 className="animate-fade-up text-3xl font-bold">Najnowsze produkty</h2>
              <Link href="/produkty">
                <Button
                  variant="outline"
                  size="sm"
                  className="hover-lift-strong gap-2 border-primary/30 bg-card shadow-sm"
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
