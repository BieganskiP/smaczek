"use client";

import { useActionState } from "react";
import { createOrder, type OrderState } from "@/actions/orders";
import { useCart } from "./cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

type UserProfile = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
} | null;

export function CheckoutForm({ userProfile }: { userProfile: UserProfile }) {
  const { items, totalPrice } = useCart();
  const [state, formAction, isPending] = useActionState<OrderState, FormData>(
    createOrder,
    {},
  );

  const shipping = totalPrice >= 150 ? 0 : 14.99;

  return (
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

          <Card className="mb-6 border-border/60 shadow-soft">
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
                    defaultValue={userProfile?.firstName ?? ""}
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
                    defaultValue={userProfile?.lastName ?? ""}
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
                  defaultValue={userProfile?.email ?? ""}
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
                  defaultValue={userProfile?.phone ?? ""}
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

          <Card className="mb-6 border-border/60 shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg">Adres dostawy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Ulica i numer</Label>
                <Input
                  id="address"
                  name="address"
                  defaultValue={userProfile?.address ?? ""}
                  placeholder="ul. Kwiatowa 10/5"
                  required
                />
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
                    defaultValue={userProfile?.postalCode ?? ""}
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
                  <Input
                    id="city"
                    name="city"
                    defaultValue={userProfile?.city ?? ""}
                    placeholder="Warszawa"
                    required
                  />
                  {state.fieldErrors?.city && (
                    <p className="text-sm text-destructive">
                      {state.fieldErrors.city}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mb-6">
            <label className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                name="acceptRegulamin"
                required
                className="mt-1 size-4 rounded border-border"
              />
              <span>
                Akceptuję{" "}
                <Link
                  href="/regulamin"
                  target="_blank"
                  className="text-primary underline hover:no-underline"
                >
                  regulamin sklepu
                </Link>{" "}
                oraz wyrażam zgodę na przetwarzanie danych w celu realizacji
                zamówienia (zgodnie z{" "}
                <Link
                  href="/polityka-prywatnosci"
                  target="_blank"
                  className="text-primary underline hover:no-underline"
                >
                  polityką prywatności
                </Link>
                )
              </span>
            </label>
            {state.fieldErrors?.acceptRegulamin && (
              <p className="mt-1 text-sm text-destructive">
                {state.fieldErrors.acceptRegulamin}
              </p>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full shadow-md transition-all hover:shadow-lg disabled:opacity-70"
            disabled={isPending}
          >
            {isPending ? "Przetwarzanie..." : "Zamów i zapłać"}
          </Button>
        </form>
      </div>

      <div>
        <Card className="sticky top-24 border-border/60 shadow-card">
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
  );
}
