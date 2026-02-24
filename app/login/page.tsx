"use client";

import { useActionState } from "react";
import { login, type AuthState } from "@/actions/auth";
import Link from "next/link";
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

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState<AuthState, FormData>(
    login,
    {},
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md border-border/60 shadow-card">
        <CardHeader className="text-center">
          <CardTitle>Zaloguj się</CardTitle>
          <CardDescription>
            Wprowadź swoje dane, aby się zalogować
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
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Logowanie..." : "Zaloguj się"}
            </Button>
            <p className="text-sm text-muted-foreground">
              Nie masz konta?{" "}
              <Link
                href="/rejestracja"
                className="text-primary hover:underline"
              >
                Zarejestruj się
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
