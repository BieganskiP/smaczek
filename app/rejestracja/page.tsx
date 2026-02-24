"use client";

import { useActionState, useEffect } from "react";
import { register, type AuthState } from "@/actions/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState<AuthState, FormData>(
    register,
    {},
  );
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      router.push("/login?registered=true");
    }
  }, [state.success, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-lg border-border/60 shadow-card">
        <CardHeader className="text-center">
          <CardTitle>Utwórz konto</CardTitle>
          <CardDescription>
            Wprowadź swoje dane – adres będzie używany przy dostawie zamówień
          </CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="space-y-4">
            {state.error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {state.error}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Imię</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="Jan"
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
                  placeholder="Kowalski"
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
                placeholder="jan@example.com"
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
            <div className="space-y-2">
              <Label htmlFor="address">Ulica i numer</Label>
              <Input
                id="address"
                name="address"
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
                <Input id="city" name="city" placeholder="Warszawa" required />
                {state.fieldErrors?.city && (
                  <p className="text-sm text-destructive">
                    {state.fieldErrors.city}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Hasło</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Min. 6 znaków"
                required
              />
              {state.fieldErrors?.password && (
                <p className="text-sm text-destructive">
                  {state.fieldErrors.password}
                </p>
              )}
            </div>
            <div className="space-y-4 border-t border-border pt-4">
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
                  </Link>
                </span>
              </label>
              {state.fieldErrors?.acceptRegulamin && (
                <p className="text-sm text-destructive">
                  {state.fieldErrors.acceptRegulamin}
                </p>
              )}
              <label className="flex items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  name="acceptPrivacy"
                  required
                  className="mt-1 size-4 rounded border-border"
                />
                <span>
                  Wyrażam zgodę na przetwarzanie moich danych osobowych zgodnie z{" "}
                  <Link
                    href="/polityka-prywatnosci"
                    target="_blank"
                    className="text-primary underline hover:no-underline"
                  >
                    polityką prywatności
                  </Link>{" "}
                  (RODO)
                </span>
              </label>
              {state.fieldErrors?.acceptPrivacy && (
                <p className="text-sm text-destructive">
                  {state.fieldErrors.acceptPrivacy}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Rejestracja..." : "Zarejestruj się"}
            </Button>
            <p className="text-sm text-muted-foreground">
              Masz już konto?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Zaloguj się
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
