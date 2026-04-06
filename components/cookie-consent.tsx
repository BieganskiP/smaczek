"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const CONSENT_KEY = "smaczek_cookie_consent";

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) setShow(true);
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setShow(false);
  };

  const acceptEssential = () => {
    localStorage.setItem(CONSENT_KEY, "essential");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.3)]"
      role="dialog"
      aria-label="Informacja o cookies"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Używamy plików cookies niezbędnych do działania sklepu oraz, za Twoją
          zgodą, marketingowych (śledzenie polecenia). Niezbędne cookies są
          zawsze aktywne.{" "}
          <Link
            href="/polityka-cookies"
            className="text-primary underline hover:no-underline"
          >
            Więcej informacji
          </Link>
        </p>
        <div className="flex shrink-0 gap-2">
          <Button onClick={acceptEssential} size="sm" variant="outline">
            Tylko niezbędne
          </Button>
          <Button onClick={accept} size="sm">
            Akceptuję wszystkie
          </Button>
        </div>
      </div>
    </div>
  );
}
