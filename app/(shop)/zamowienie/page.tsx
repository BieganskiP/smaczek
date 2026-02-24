"use client";

import { useActionState } from "react";
import { createOrder, type OrderState } from "@/actions/orders";
import { useCart } from "@/components/shop/cart-context";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

export default function CheckoutPage() {
  const { items, totalPrice } = useCart();
  const { data: session } = useSession();
  const [state, formAction, isPending] = useActionState<OrderState, FormData>(
    createOrder,
    {},
  );

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="mb-2 text-2xl font-bold">Koszyk jest pusty</h1>
        <p className="mb-6 text-muted-foreground">
          Dodaj produkty przed złożeniem zamówienia.
        </p>
        <Link href="/produkty">
          <Button>Przeglądaj produkty</Button>
        </Link>
      </div>
    );
  }

  const shipping = totalPrice >= 150 ? 0 : 14.99;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Zamówienie</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <form action={formAction}>
            <input
              type="hidden"
              name="items"
              value={JSON.stringify(
                items.map((i) => ({
                  productId: i.productId,
                  quantity: i.quantity,
                })),
              )}
            />

            {state.error && (
              <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {state.error}
              </div>
            )}

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Dane kontaktowe</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Imię</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      defaultValue={session?.user?.name?.split(" ")[0] ?? ""}
                      required
                    />
                    {state.fieldErrors?.firstName && (
                      <p className="text-sm text-destructive">
                        {state.fieldErrors.firstName}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nazwisko</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      defaultValue={session?.user?.name?.split(" ")[1] ?? ""}
                      required
                    />
                    {state.fieldErrors?.lastName && (
                      <p className="text-sm text-destructive">
                        {state.fieldErrors.lastName}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={session?.user?.email ?? ""}
                    required
                  />
                  {state.fieldErrors?.email && (
                    <p className="text-sm text-destructive">
                      {state.fieldErrors.email}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="123456789"
                    required
                  />
                  {state.fieldErrors?.phone && (
                    <p className="text-sm text-destructive">
                      {state.fieldErrors.phone}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Adres dostawy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Ulica i numer</Label>
                  <Input id="address" name="address" required />
                  {state.fieldErrors?.address && (
                    <p className="text-sm text-destructive">
                      {state.fieldErrors.address}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Kod pocztowy</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      placeholder="00-000"
                      required
                    />
                    {state.fieldErrors?.postalCode && (
                      <p className="text-sm text-destructive">
                        {state.fieldErrors.postalCode}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Miasto</Label>
                    <Input id="city" name="city" required />
                    {state.fieldErrors?.city && (
                      <p className="text-sm text-destructive">
                        {state.fieldErrors.city}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button type="submit" size="lg" className="w-full" disabled={isPending}>
              {isPending ? "Przetwarzanie..." : "Zamów i zapłać"}
            </Button>
          </form>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Podsumowanie</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex justify-between text-sm"
                >
                  <span>
                    {item.name} &times; {item.quantity}
                  </span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="border-t pt-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Dostawa</span>
                  <span>{shipping === 0 ? "Gratis" : formatPrice(shipping)}</span>
                </div>
                <div className="mt-2 flex justify-between font-bold">
                  <span>Razem</span>
                  <span>{formatPrice(totalPrice + shipping)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
