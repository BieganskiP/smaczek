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
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Utwórz konto</CardTitle>
          <CardDescription>
            Wprowadź swoje dane, aby utworzyć konto
          </CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="space-y-4">
            {state.error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {state.error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Imię</Label>
              <Input
                id="name"
                name="name"
                placeholder="Jan Kowalski"
                required
              />
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
