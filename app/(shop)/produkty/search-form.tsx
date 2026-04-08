"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

export function SearchForm({ defaultValue }: { defaultValue: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(defaultValue);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  function navigate(next: string) {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (next.trim()) {
        params.set("szukaj", next.trim());
      } else {
        params.delete("szukaj");
      }
      params.delete("strona");
      router.push(`/produkty?${params.toString()}`);
    }, 350);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = e.target.value;
    setValue(next);
    navigate(next);
  }

  function handleClear() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setValue("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("szukaj");
    params.delete("strona");
    router.push(`/produkty?${params.toString()}`);
  }

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return (
    <div className="relative max-w-md flex-1">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
      <Input
        type="search"
        value={value}
        onChange={handleChange}
        placeholder="Szukaj po nazwie..."
        className="pl-9 pr-9 [&::-webkit-search-cancel-button]:hidden"
        aria-label="Szukaj produktów"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Wyczyść wyszukiwanie"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-sm p-1.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="h-3.5 w-3.5" aria-hidden />
        </button>
      )}
    </div>
  );
}
