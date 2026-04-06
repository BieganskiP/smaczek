import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 mb-6">
        <Search className="size-8 text-primary" />
      </div>
      <p className="text-6xl font-bold text-primary mb-4">404</p>
      <h1 className="text-3xl font-bold text-foreground mb-3">
        Nie znaleziono strony
      </h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        Strona, której szukasz, nie istnieje lub została przeniesiona.
      </p>
      <Link href="/produkty" className={buttonVariants()}>
        Przeglądaj produkty
      </Link>
    </div>
  );
}
