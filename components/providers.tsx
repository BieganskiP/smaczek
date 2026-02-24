"use client";

import { Suspense } from "react";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/components/shop/cart-context";
import { SessionRefresher } from "@/components/session-refresher";
import { RefLinkTracker } from "@/components/ref-link-tracker";
import { CookieConsent } from "@/components/cookie-consent";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Suspense fallback={null}>
        <SessionRefresher />
        <RefLinkTracker />
      </Suspense>
      <CartProvider>{children}</CartProvider>
      <CookieConsent />
    </SessionProvider>
  );
}
