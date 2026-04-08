"use client";

import { useActionState } from "react";
import { login, type AuthState } from "@/actions/auth";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState<AuthState, FormData>(
    login,
    {},
  );

  return (
    <div className="flex min-h-screen relative">
      {/* ── Left column: form ── */}
      <div className="absolute left-0 top-0 flex w-full flex-col items-center justify-center px-6 md:w-1/2 md:px-12 z-10 h-full">
        {/* Back button — pinned top-left */}
        <Link
          href="/"
          className="absolute left-6 top-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Wróć do sklepu
        </Link>

        {/* Centered content */}
        <div className="w-full max-w-sm bg-background/50 p-10 rounded-lg">
          <h1 className="text-3xl font-bold tracking-tight">Zaloguj się</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Wprowadź swoje dane, aby się zalogować
          </p>

          <form action={formAction} className="mt-8 space-y-5">
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
              <Input id="password" name="password" type="password" required />
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Logowanie..." : "Zaloguj się"}
            </Button>
          </form>

          <p className="mt-6 text-sm text-muted-foreground">
            Nie masz konta?{" "}
            <Link href="/rejestracja" className="text-primary hover:underline">
              Zarejestruj się
            </Link>
          </p>
        </div>
      </div>

      {/* ── Right column: hero image (hidden on mobile) ── */}
      <div className="relative hidden overflow-hidden md:block w-full">
        <Image
          src="/hero.png"
          alt=""
          fill
          className="object-cover object-center"
          priority
          aria-hidden
        />
      </div>

      {/* ── Mobile: hero image behind the form, anchored right ── */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 md:hidden"
        aria-hidden
      >
        <Image
          src="/hero.png"
          alt=""
          fill
          className="object-cover object-right"
          priority
        />
      </div>
    </div>
  );
}
