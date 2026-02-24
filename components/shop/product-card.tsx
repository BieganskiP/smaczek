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
    <Link href={`/produkty/${product.slug}`} className="group block">
      <Card className="overflow-hidden border-border/60 bg-card shadow-card transition-smooth group-hover:-translate-y-1 group-hover:[box-shadow:0_12px_24px_-8px_rgb(0_0_0/0.12),0_20px_40px_-12px_rgb(0_0_0/0.1)]">
        <div className="relative aspect-square overflow-hidden bg-muted/50">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={400}
              height={400}
              className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
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
          <p className="mt-3 text-lg font-bold text-primary">
            {formatPrice(product.price)}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
