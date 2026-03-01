"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingCart,
  User,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useCart } from "./cart-context";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "/", label: "Strona główna" },
  { href: "/produkty", label: "Produkty" },
  { href: "/o-nas", label: "O nas" },
  { href: "/dostawa", label: "Dostawa" },
  { href: "/kontakt", label: "Kontakt" },
] as const;

const navLinkClassName =
  "text-lg font-medium text-muted-foreground transition-all duration-200 hover:text-foreground hover:underline-offset-4 hover:underline";

export function Navbar() {
  const { totalItems } = useCart();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/50 shadow-soft backdrop-blur-lg supports-backdrop-filter:bg-background/40">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
          aria-label="Smaczek Kłaczek – strona główna"
        >
          <Image
            src="/logo-simple.png"
            alt="Smaczek Kłaczek"
            width={200}
            height={200}
            className="h-30 w-auto object-contain"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href} className={navLinkClassName}>
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          {/* Desktop: cart + auth */}
          <div className="hidden md:flex md:items-center md:gap-1">
            <Link href="/koszyk">
              <Button
                variant="ghost"
                size="icon"
                className="relative transition-transform hover:scale-105"
              >
                <ShoppingCart className="size-5" />
                {totalItems > 0 && (
                  <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground shadow-md">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
            {session ? (
              <>
                {session.user?.role === "ADMIN" && (
                  <Link href="/admin">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5"
                      title="Panel admina"
                    >
                      <LayoutDashboard className="size-4" />
                      <span className="hidden sm:inline">Admin</span>
                    </Button>
                  </Link>
                )}
                <Link href="/konto">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="transition-transform hover:scale-105"
                    title="Moje konto"
                  >
                    <User className="size-5" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="transition-transform hover:scale-105"
                  title="Wyloguj się"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <LogOut className="size-5" />
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button variant="outline" size="sm" className="shadow-sm">
                  Zaloguj się
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile: hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden transition-transform duration-200 hover:scale-105 active:scale-95"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? "Zamknij menu" : "Otwórz menu"}
            aria-expanded={mobileMenuOpen}
          >
            <span className="relative flex size-6 items-center justify-center">
              <Menu
                className={`size-6 transition-all duration-200 ${
                  mobileMenuOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
                }`}
                aria-hidden={mobileMenuOpen}
              />
              <X
                className={`absolute size-6 transition-all duration-200 ${
                  mobileMenuOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
                }`}
                aria-hidden={!mobileMenuOpen}
              />
            </span>
          </Button>
        </div>
      </div>

      {/* Mobile menu panel */}
      <div
        className={`absolute left-0 right-0 top-20 z-40 border-b border-border/40 bg-background/95 shadow-lg backdrop-blur-md transition-all duration-300 ease-out md:hidden ${
          mobileMenuOpen
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        <nav className="flex flex-col gap-1 px-4 py-4">
          {NAV_LINKS.map(({ href, label }, index) => (
            <Link
              key={href}
              href={href}
              className={
                navLinkClassName +
                " block py-3 transition-all duration-300 ease-out " +
                (mobileMenuOpen
                  ? "translate-y-0 opacity-100"
                  : "translate-y-2 opacity-0")
              }
              style={{
                transitionDelay: mobileMenuOpen ? `${index * 40}ms` : "0ms",
              }}
              onClick={closeMobileMenu}
            >
              {label}
            </Link>
          ))}
          <div
            className={`mt-4 flex flex-col gap-2 border-t border-border/40 pt-4 transition-all duration-300 ease-out ${
              mobileMenuOpen
                ? "translate-y-0 opacity-100"
                : "translate-y-2 opacity-0"
            }`}
            style={{
              transitionDelay: mobileMenuOpen ? `${NAV_LINKS.length * 40}ms` : "0ms",
            }}
          >
            <Link href="/koszyk" onClick={closeMobileMenu}>
              <Button
                variant="ghost"
                className="relative w-full justify-start gap-3"
              >
                <ShoppingCart className="size-5" />
                <span>Koszyk</span>
                {totalItems > 0 && (
                  <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
            {session ? (
              <>
                {session.user?.role === "ADMIN" && (
                  <Link href="/admin" onClick={closeMobileMenu}>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-3"
                    >
                      <LayoutDashboard className="size-4" />
                      Panel admina
                    </Button>
                  </Link>
                )}
                <Link href="/konto" onClick={closeMobileMenu}>
                  <Button variant="ghost" className="w-full justify-start gap-3">
                    <User className="size-5" />
                    Moje konto
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-muted-foreground"
                  onClick={() => {
                    signOut({ callbackUrl: "/" });
                    closeMobileMenu();
                  }}
                >
                  <LogOut className="size-5" />
                  Wyloguj się
                </Button>
              </>
            ) : (
              <Link href="/login" onClick={closeMobileMenu}>
                <Button variant="outline" className="w-full shadow-sm">
                  Zaloguj się
                </Button>
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
