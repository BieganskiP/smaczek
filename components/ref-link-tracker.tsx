"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const REF_COOKIE = "smaczek_ref";
const REF_COOKIE_DAYS = 30;
const CONSENT_KEY = "smaczek_cookie_consent";
const APPROVED_CACHE_KEY = "smaczek_ref_approved";
const APPROVED_CACHE_TTL = 5 * 60 * 1000; // 5 min

function setRefCookie(value: string) {
  const maxAge = REF_COOKIE_DAYS * 24 * 60 * 60;
  document.cookie = `${REF_COOKIE}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

async function getApprovedRefCodes(): Promise<string[]> {
  try {
    const cached = sessionStorage.getItem(APPROVED_CACHE_KEY);
    if (cached) {
      const { codes, ts } = JSON.parse(cached);
      if (Date.now() - ts < APPROVED_CACHE_TTL) return codes;
    }
    const res = await fetch("/api/ref-links");
    const codes: string[] = await res.json();
    sessionStorage.setItem(
      APPROVED_CACHE_KEY,
      JSON.stringify({ codes, ts: Date.now() })
    );
    return codes;
  } catch {
    return [];
  }
}

export function RefLinkTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get("ref")?.trim();
    if (!ref || ref.length > 100) return;

    const hasConsent = localStorage.getItem(CONSENT_KEY) === "accepted";
    if (!hasConsent) return;

    const run = async () => {
      const codes = await getApprovedRefCodes();
      const normalized = ref
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/[^a-z0-9_-]/g, "");
      const isApproved =
        codes.includes(ref) ||
        codes.includes(normalized) ||
        codes.some((c) => c === normalized);
      if (isApproved) {
        setRefCookie(ref);
      }
    };
    run();
  }, [searchParams]);

  return null;
}
