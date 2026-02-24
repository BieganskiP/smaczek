"use client";

import Link from "next/link";
import { ShoppingCart, User, PawPrint } from "lucide-react";
import { useCart } from "./cart-context";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { totalItems } = useCart();
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <PawPrint className="size-7 text-primary" />
          <span className="text-xl font-bold">Smaczek</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/produkty"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Produkty
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/koszyk">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="size-5" />
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>
          {session ? (
            <Link href="/konto">
              <Button variant="ghost" size="icon">
                <User className="size-5" />
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button variant="outline" size="sm">
                Zaloguj się
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
