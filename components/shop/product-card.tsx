import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { PawPrint } from "lucide-react";

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
    <Link href={`/produkty/${product.slug}`} className="group block animate-fade-up">
      <Card className="hover-lift-strong overflow-hidden border-border/60 bg-card shadow-card">
        <div className="relative aspect-square overflow-hidden bg-muted/50 shimmer-on-hover">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={400}
              height={400}
              className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex size-full items-center justify-center">
              <PawPrint className="size-12 text-muted-foreground/30 transition-transform duration-300 group-hover:scale-110" />
            </div>
          )}
        </div>
        <CardContent className="p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {product.category.name}
          </p>
          <h3 className="mt-1.5 font-semibold leading-tight group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {product.description}
          </p>
          <p className="mt-3 text-lg font-bold text-primary transition-transform duration-300 group-hover:scale-[1.02]">
            {formatPrice(product.price)}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
