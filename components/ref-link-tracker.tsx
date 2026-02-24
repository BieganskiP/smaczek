"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const REF_COOKIE = "smaczek_ref";
const REF_COOKIE_DAYS = 30;

function setRefCookie(value: string) {
  const maxAge = REF_COOKIE_DAYS * 24 * 60 * 60;
  document.cookie = `${REF_COOKIE}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function RefLinkTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref && ref.length <= 100) {
      setRefCookie(ref.trim());
    }
  }, [searchParams]);

  return null;
}
