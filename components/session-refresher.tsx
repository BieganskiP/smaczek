"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Po zalogowaniu signIn przekierowuje z ?session_refresh=1.
 * Ten komponent wykrywa to i wymusza odświeżenie sesji w SessionProvider,
 * żeby navbar od razu pokazał ikonę profilu i wylogowania.
 */
export function SessionRefresher() {
  const { update } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasRefreshed = useRef(false);

  useEffect(() => {
    if (searchParams.get("session_refresh") === "1" && !hasRefreshed.current) {
      hasRefreshed.current = true;
      update()
        .then(() => {
          router.replace("/", { scroll: false });
        })
        .catch((err) => console.error("Session refresh failed:", err));
    }
  }, [searchParams, update, router]);

  return null;
}
