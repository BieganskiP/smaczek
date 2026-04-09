import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { PawPrint, ArrowUpRight } from "lucide-react";

type ProductCardProps = {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    description: string;
    imageUrl: string | null;
    category: { name: string };
  };
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/produkty/${product.slug}`}
      className="group block h-full animate-fade-up cursor-pointer"
    >
      <article className="card-glass hover-lift-strong flex h-full flex-col overflow-hidden rounded-2xl transition-all duration-300">
        {/* Image */}
        <div className="relative aspect-[4/3] shrink-0 overflow-hidden bg-muted/50">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={400}
              height={300}
              className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex size-full items-center justify-center">
              <PawPrint
                className="size-12 text-muted-foreground/30 transition-transform duration-300 group-hover:scale-110"
                aria-hidden
              />
            </div>
          )}

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Category badge */}
          <span className="absolute left-3 top-3 rounded-full border border-border bg-background/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground backdrop-blur-sm">
            {product.category.name}
          </span>

          {/* Arrow icon on hover */}
          <span className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full border border-primary/40 bg-background/80 text-primary opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
            <ArrowUpRight className="size-4" aria-hidden />
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-2 p-4">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground/80 transition-colors duration-200 group-hover:text-foreground">
            {product.name}
          </h3>
          <p className="line-clamp-2 flex-1 text-xs leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
            <p className="text-base font-bold text-primary">
              {formatPrice(product.price)}
            </p>
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground transition-colors duration-200 group-hover:text-primary/80">
              Sprawdź
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
