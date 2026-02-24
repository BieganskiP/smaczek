"use client";

import { useCart } from "@/components/shop/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { Trash2, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-2xl bg-muted/50">
          <ShoppingCart className="size-10 text-muted-foreground/40" />
        </div>
        <h1 className="mb-2 text-2xl font-bold">Koszyk jest pusty</h1>
        <p className="mb-8 text-muted-foreground">
          Dodaj produkty do koszyka, aby złożyć zamówienie.
        </p>
        <Link href="/produkty">
          <Button size="lg" className="shadow-md">
            Przeglądaj produkty
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="mb-8 text-3xl font-bold">Koszyk</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <Card
              key={item.productId}
              className="border-border/60 shadow-soft transition-smooth hover:shadow-card"
            >
              <CardContent className="flex items-center gap-4 py-5">
                <Link
                  href={`/produkty/${item.slug}`}
                  className="size-20 shrink-0 overflow-hidden rounded-md bg-muted"
                >
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
                      Brak
                    </div>
                  )}
                </Link>

                <div className="flex-1">
                  <Link
                    href={`/produkty/${item.slug}`}
                    className="font-medium hover:underline"
                  >
                    {item.name}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {formatPrice(item.price)} / szt.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={1}
                    max={99}
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(
                        item.productId,
                        parseInt(e.target.value) || 1,
                      )
                    }
                    className="w-20"
                  />
                </div>

                <div className="w-24 text-right font-semibold">
                  {formatPrice(item.price * item.quantity)}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(item.productId)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <Card className="sticky top-24 border-border/60 shadow-card">
            <CardContent className="p-6">
              <h2 className="mb-4 text-lg font-semibold">Podsumowanie</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Produkty</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dostawa</span>
                  <span>
                    {totalPrice >= 150 ? "Gratis" : formatPrice(14.99)}
                  </span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between text-base font-bold">
                    <span>Razem</span>
                    <span>
                      {formatPrice(
                        totalPrice + (totalPrice >= 150 ? 0 : 14.99),
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <Link href="/zamowienie" className="mt-4 block">
                <Button
                  className="w-full shadow-md transition-all hover:shadow-lg"
                  size="lg"
                >
                  Złóż zamówienie
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
