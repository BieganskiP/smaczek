"use client";

import { useCart } from "./cart-context";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

export function CartCheckoutGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { items } = useCart();

  if (items.length === 0) {
    return (
      <div className="py-24 text-center">
        <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-2xl bg-muted/50">
          <ShoppingCart className="size-10 text-muted-foreground/40" />
        </div>
        <h2 className="mb-2 text-2xl font-bold">Koszyk jest pusty</h2>
        <p className="mb-8 text-muted-foreground">
          Dodaj produkty przed złożeniem zamówienia.
        </p>
        <Link href="/produkty">
          <Button size="lg" className="shadow-md">
            Przeglądaj produkty
          </Button>
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
