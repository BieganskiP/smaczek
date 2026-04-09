import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import { COMPANY } from "@/lib/company";
import Image from "next/image";

const CATEGORY_IMAGES: Record<string, string> = {
  "karma-dla-kotow": "/karma-dla-kotow.webp",
  "karma-dla-psow": "/karma-dla-psow.webp",
  "akcesoria": "/akcesoria.webp",
};

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Smaczek Kłaczek – Karma dla psów i kotów",
  description:
    "Sklep z premium karmą dla psów, kotów i innych zwierząt domowych. Szeroki wybór, szybka dostawa i świeże produkty najwyższej jakości.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Smaczek Kłaczek – Karma dla psów i kotów",
    description:
      "Sklep z premium karmą dla psów, kotów i innych zwierząt domowych. Szeroki wybór, szybka dostawa i świeże produkty.",
  },
};

import Link from "next/link";
import { AlertCircle, Truck, ShieldCheck, Leaf, ArrowUpRight } from "lucide-react";
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

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    name: COMPANY.shortName,
    legalName: COMPANY.name,
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: COMPANY.phone,
      email: COMPANY.email,
      contactType: "customer service",
      availableLanguage: "pl",
      hoursAvailable: COMPANY.workingHours,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: COMPANY.address.street,
      postalCode: COMPANY.address.postalCode,
      addressLocality: COMPANY.address.city,
      addressCountry: "PL",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
    <div className="bg-background">
      {/* DB error banner */}
      {dbError && (
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/[0.08] px-5 py-4 text-sm text-amber-400">
            <AlertCircle className="size-5 shrink-0" aria-hidden />
            <div>
              <p className="font-semibold">Baza danych niedostępna</p>
              <p className="mt-0.5 text-xs opacity-75">
                Uruchom PostgreSQL i wykonaj:{" "}
                <code className="rounded bg-amber-500/20 px-1">npm run db:push</code>{" "}
                oraz{" "}
                <code className="rounded bg-amber-500/20 px-1">npm run db:seed</code>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hero */}
      <HeroSection />

      {/* Trust bar */}
      <section className="border-y border-border bg-muted/40 py-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-10 px-6">
          {[
            { icon: Truck, label: "Szybka dostawa" },
            { icon: ShieldCheck, label: "Bezpieczna płatność" },
            { icon: Leaf, label: "Świeże produkty" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-full border border-primary/25 bg-primary/[0.08]">
                <Icon className="size-3.5 text-primary" aria-hidden />
              </span>
              <span className="text-sm font-medium text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured products */}
      {featuredProducts.length > 0 && (
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-6">
            {/* Section header */}
            <div className="mb-12 flex items-end justify-between">
              <div>
                <p className="section-title-line animate-fade-up mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-primary">
                  Oferta
                </p>
                <h2 className="animate-fade-up text-3xl font-bold text-foreground sm:text-4xl" style={{ animationDelay: "60ms" }}>
                  Najnowsze produkty
                </h2>
              </div>
              <Link
                href="/produkty"
                className="group hidden cursor-pointer items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-primary sm:flex"
              >
                Zobacz wszystkie
                <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product, i) => (
                <div
                  key={product.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Mobile "see all" */}
            <div className="mt-10 text-center sm:hidden">
              <Link
                href="/produkty"
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border px-6 py-2.5 text-sm text-muted-foreground transition-all duration-200 hover:border-primary/40 hover:text-primary"
              >
                Zobacz wszystkie produkty
                <ArrowUpRight className="size-4" aria-hidden />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <section className="border-t border-border py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12">
              <p className="section-title-line animate-fade-up mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-primary">
                Przeglądaj
              </p>
              <h2 className="animate-fade-up text-3xl font-bold text-foreground sm:text-4xl" style={{ animationDelay: "60ms" }}>
                Kategorie
              </h2>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category, index) => {
                const image = CATEGORY_IMAGES[category.slug];
                const count = category._count.products;
                const countLabel =
                  count === 1 ? "produkt" : count < 5 ? "produkty" : "produktów";

                return image ? (
                  /* ── Image card ── */
                  <Link
                    key={category.id}
                    href={`/produkty?kategoria=${category.slug}`}
                    className="group animate-fade-up block w-full cursor-pointer sm:w-[calc(50%-6px)] lg:w-[calc(25%-9px)]"
                    style={{ animationDelay: `${index * 60 + 80}ms` }}
                  >
                    <div className="hover-lift-strong relative overflow-hidden rounded-xl aspect-[3/4]">
                      <Image
                        src={image}
                        alt={category.name}
                        fill
                        className="object-cover object-[center_20%] transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                      {/* Bottom gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" aria-hidden />
                      {/* Gold border glow on hover */}
                      <div className="absolute inset-0 rounded-xl ring-1 ring-white/10 transition-all duration-300 group-hover:ring-primary/50" aria-hidden />
                      {/* Text */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="font-semibold text-white transition-colors duration-200 group-hover:text-primary">
                          {category.name}
                        </h3>
                        <p className="mt-0.5 text-xs text-white/55">
                          {count} {countLabel}
                        </p>
                      </div>
                      {/* Arrow */}
                      <div className="absolute right-3 top-3 flex size-7 items-center justify-center rounded-full bg-black/40 text-white/60 backdrop-blur-sm transition-all duration-300 group-hover:bg-primary/20 group-hover:text-primary">
                        <ArrowUpRight className="size-3.5" aria-hidden />
                      </div>
                    </div>
                  </Link>
                ) : (
                  /* ── Text-only card ── */
                  <Link
                    key={category.id}
                    href={`/produkty?kategoria=${category.slug}`}
                    className="group animate-fade-up block w-full cursor-pointer sm:w-[calc(50%-6px)] lg:w-[calc(25%-9px)]"
                    style={{ animationDelay: `${index * 60 + 80}ms` }}
                  >
                    <div className="card-glass hover-lift-strong shimmer-on-hover flex items-center justify-between rounded-xl p-5 transition-all duration-300">
                      <div>
                        <h3 className="font-semibold text-foreground/75 transition-colors duration-200 group-hover:text-foreground">
                          {category.name}
                        </h3>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {count} {countLabel}
                        </p>
                      </div>
                      <ArrowUpRight className="size-4 text-muted-foreground/40 transition-all duration-200 group-hover:text-primary" aria-hidden />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA section */}
      <section className="border-t border-border py-24">
        <div className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl border border-border bg-card px-10 py-16 text-center">
          {/* Subtle primary glow */}
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 100%, hsl(var(--primary) / 0.12), transparent)",
            }}
            aria-hidden
          />
          <div className="relative z-10">
            <p className="section-title-line animate-fade-up mx-auto mb-4 w-fit text-xs font-semibold uppercase tracking-[0.15em] text-primary">
              Poznaj nas
            </p>
            <h2 className="animate-fade-up text-3xl font-bold text-foreground sm:text-4xl" style={{ animationDelay: "60ms" }}>
              Domowe smaki, świeże każdego dnia
            </h2>
            <p className="animate-fade-up mx-auto mt-5 max-w-lg text-sm leading-relaxed text-muted-foreground" style={{ animationDelay: "120ms" }}>
              Poznaj naszą historię i sposób na świeże, domowe smaki. Masz pytania? Chętnie pomożemy.
            </p>
            <div
              className="animate-fade-up mt-8 flex flex-wrap items-center justify-center gap-4"
              style={{ animationDelay: "180ms" }}
            >
              <Link
                href="/o-nas"
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border px-7 py-3 text-sm font-medium text-foreground/70 transition-all duration-300 hover:border-primary/40 hover:text-foreground"
              >
                O nas
              </Link>
              <Link
                href="/kontakt"
                className="group inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:shadow-[0_0_24px_hsl(var(--primary)/0.35)]"
              >
                Skontaktuj się
                <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
