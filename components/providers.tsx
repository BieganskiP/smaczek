"use client";

import { Suspense } from "react";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/components/shop/cart-context";
import { SessionRefresher } from "@/components/session-refresher";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Suspense fallback={null}>
        <SessionRefresher />
      </Suspense>
      <CartProvider>{children}</CartProvider>
    </SessionProvider>
  );
}
