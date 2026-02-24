"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const REF_COOKIE = "smaczek_ref";
const REF_COOKIE_DAYS = 30;
const CONSENT_KEY = "smaczek_cookie_consent";

function setRefCookie(value: string) {
  const maxAge = REF_COOKIE_DAYS * 24 * 60 * 60;
  document.cookie = `${REF_COOKIE}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function RefLinkTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get("ref");
    const hasConsent = localStorage.getItem(CONSENT_KEY) === "accepted";
    if (ref && ref.length <= 100 && hasConsent) {
      setRefCookie(ref.trim());
    }
  }, [searchParams]);

  return null;
}
