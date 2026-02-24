import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { ArrowRight, PawPrint, Truck, Shield, AlertCircle } from "lucide-react";

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
      dbError: error instanceof Error ? error.message : "Błąd połączenia z bazą",
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
      <section className="bg-linear-to-b from-primary/5 to-background py-20">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-primary/10">
            <PawPrint className="size-8 text-primary" />
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Najlepsza karma
            <br />
            <span className="text-primary">dla Twojego pupila</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Szeroki wybór wysokiej jakości karmy dla psów, kotów i innych
            zwierząt domowych. Dostarczamy prosto pod Twoje drzwi.
          </p>
          <Link href="/produkty">
            <Button size="lg" className="gap-2">
              Przeglądaj produkty
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="border-y py-12">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-3">
          <div className="flex items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Truck className="size-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Darmowa dostawa</h3>
              <p className="text-sm text-muted-foreground">
                Przy zamówieniach powyżej 150 zł
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="size-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Bezpieczne płatności</h3>
              <p className="text-sm text-muted-foreground">
                Płatność przez PayU
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <PawPrint className="size-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Najwyższa jakość</h3>
              <p className="text-sm text-muted-foreground">
                Tylko sprawdzone marki
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="mb-8 text-2xl font-bold">Kategorie</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/produkty?kategoria=${category.slug}`}
                >
                  <Card className="transition-shadow hover:shadow-md">
                    <CardContent className="p-6">
                      <h3 className="font-semibold">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">
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
        <section className="bg-muted/50 py-16">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Najnowsze produkty</h2>
              <Link href="/produkty">
                <Button variant="outline" className="gap-2">
                  Zobacz wszystkie
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <Link key={product.id} href={`/produkty/${product.slug}`}>
                  <Card className="overflow-hidden transition-shadow hover:shadow-md">
                    <div className="aspect-square bg-muted">
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          width={400}
                          height={400}
                          className="size-full object-cover"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center">
                          <PawPrint className="size-12 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <p className="text-xs text-muted-foreground">
                        {product.category.name}
                      </p>
                      <h3 className="mt-1 font-semibold">{product.name}</h3>
                      <p className="mt-2 text-lg font-bold text-primary">
                        {formatPrice(product.price)}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
