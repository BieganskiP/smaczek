"use client";

import { useState, useEffect } from "react";
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

const NAV_LINKS = [
  { href: "/", label: "Strona główna" },
  { href: "/produkty", label: "Produkty" },
  { href: "/o-nas", label: "O nas" },
  { href: "/dostawa", label: "Dostawa" },
  { href: "/kontakt", label: "Kontakt" },
] as const;

export function Navbar() {
  const { totalItems } = useCart();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/[0.06] bg-black/90 backdrop-blur-xl shadow-[0_1px_0_0_hsl(36_72%_70%/0.12)]"
          : "border-b border-transparent bg-black/60 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-opacity duration-200 hover:opacity-80"
          aria-label="Smaczek Kłaczek – strona główna"
        >
          <Image
            src="/logo-simple.png"
            alt="Smaczek Kłaczek"
            width={200}
            height={200}
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop nav — centered */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 md:flex">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="gold-underline relative text-sm font-medium tracking-wide text-white/55 transition-colors duration-200 hover:text-white/90"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex md:items-center md:gap-1.5">
            {/* Cart */}
            <Link
              href="/koszyk"
              className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-white/60 transition-colors duration-200 hover:bg-white/[0.06] hover:text-white/90"
              aria-label="Koszyk"
            >
              <ShoppingCart className="size-[18px]" />
              {totalItems > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-black">
                  <span aria-hidden>{totalItems}</span>
                  <span className="sr-only">{totalItems} produktów w koszyku</span>
                </span>
              )}
            </Link>

            {session ? (
              <>
                {session.user?.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-white/10 px-3 text-xs font-medium text-white/60 transition-all duration-200 hover:border-primary/40 hover:text-white/90"
                    aria-label="Panel admina"
                  >
                    <LayoutDashboard className="size-3.5" />
                    <span>Admin</span>
                  </Link>
                )}
                <Link
                  href="/konto"
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-white/60 transition-colors duration-200 hover:bg-white/[0.06] hover:text-white/90"
                  title="Moje konto"
                  aria-label="Moje konto"
                >
                  <User className="size-[18px]" />
                </Link>
                <button
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-white/60 transition-colors duration-200 hover:bg-white/[0.06] hover:text-white/90"
                  title="Wyloguj się"
                  aria-label="Wyloguj się"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <LogOut className="size-[18px]" />
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="flex h-9 cursor-pointer items-center gap-2 rounded-full border border-primary/40 px-4 text-sm font-medium text-primary transition-all duration-200 hover:bg-primary/10"
              >
                Zaloguj się
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-white/60 transition-colors duration-200 hover:bg-white/[0.06] hover:text-white/90 md:hidden"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? "Zamknij menu" : "Otwórz menu"}
            aria-expanded={mobileMenuOpen}
          >
            <span className="relative flex size-5 items-center justify-center">
              <Menu
                className={`size-5 transition-all duration-200 ${
                  mobileMenuOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
                }`}
                aria-hidden={mobileMenuOpen}
              />
              <X
                className={`absolute size-5 transition-all duration-200 ${
                  mobileMenuOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
                }`}
                aria-hidden={!mobileMenuOpen}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`absolute left-0 right-0 top-16 z-40 border-b border-white/[0.06] bg-black/95 backdrop-blur-xl transition-all duration-300 ease-out md:hidden ${
          mobileMenuOpen
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "pointer-events-none -translate-y-3 opacity-0"
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        <nav className="flex flex-col px-6 py-6">
          {NAV_LINKS.map(({ href, label }, index) => (
            <Link
              key={href}
              href={href}
              className={`border-b border-white/[0.05] py-3.5 text-sm font-medium tracking-wide text-white/60 transition-all duration-300 hover:text-white/90 ${
                mobileMenuOpen ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
              }`}
              style={{ transitionDelay: mobileMenuOpen ? `${index * 40}ms` : "0ms" }}
              onClick={closeMobileMenu}
            >
              {label}
            </Link>
          ))}

          <div
            className={`mt-5 flex flex-col gap-2.5 transition-all duration-300 ${
              mobileMenuOpen ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            }`}
            style={{ transitionDelay: mobileMenuOpen ? `${NAV_LINKS.length * 40}ms` : "0ms" }}
          >
            <Link
              href="/koszyk"
              onClick={closeMobileMenu}
              className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/[0.06] px-4 py-3 text-sm text-white/60 transition-colors hover:border-white/10 hover:text-white/90"
            >
              <ShoppingCart className="size-4" />
              <span>Koszyk</span>
              {totalItems > 0 && (
                <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-black">
                  {totalItems}
                </span>
              )}
            </Link>

            {session ? (
              <>
                {session.user?.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    onClick={closeMobileMenu}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/[0.06] px-4 py-3 text-sm text-white/60 transition-colors hover:border-white/10 hover:text-white/90"
                  >
                    <LayoutDashboard className="size-4" />
                    Panel admina
                  </Link>
                )}
                <Link
                  href="/konto"
                  onClick={closeMobileMenu}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/[0.06] px-4 py-3 text-sm text-white/60 transition-colors hover:border-white/10 hover:text-white/90"
                >
                  <User className="size-4" />
                  Moje konto
                </Link>
                <button
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/[0.06] px-4 py-3 text-sm text-white/60 transition-colors hover:border-white/10 hover:text-white/90"
                  onClick={() => { signOut({ callbackUrl: "/" }); closeMobileMenu(); }}
                >
                  <LogOut className="size-4" />
                  Wyloguj się
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={closeMobileMenu}
                className="flex cursor-pointer items-center justify-center rounded-lg border border-primary/40 py-3 text-sm font-medium text-primary transition-all hover:bg-primary/10"
              >
                Zaloguj się
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
