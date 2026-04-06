"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 mb-6">
        <AlertTriangle className="size-8 text-primary" />
      </div>
      <h1 className="text-3xl font-bold text-foreground mb-3">
        Coś poszło nie tak
      </h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        Wystąpił nieoczekiwany błąd. Spróbuj odświeżyć stronę lub wróć do
        sklepu.
      </p>
      <div className="flex gap-3">
        <Button onClick={reset}>Spróbuj ponownie</Button>
        <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
          Strona główna
        </Link>
      </div>
    </div>
  );
}
