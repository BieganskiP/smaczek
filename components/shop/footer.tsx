import { PawPrint } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative mt-auto border-t border-border/60 bg-linear-to-b from-card to-card/80 shadow-[0_-4px_20px_-8px_rgba(0,0,0,0.06)]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,hsl(var(--primary)/0.12),transparent)] opacity-0 dark:opacity-100" />
      <div className="relative mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="mb-5 flex items-center gap-2.5">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 shadow-sm">
                <PawPrint className="size-5 text-primary" />
              </div>
              <span className="text-lg font-bold tracking-tight">
                Smaczek Kłaczek
              </span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Najlepsza karma dla Twojego pupila. Szeroki wybór karmy dla psów,
              kotów i innych zwierząt domowych.
            </p>
          </div>
          <div>
            <h3 className="mb-4 font-semibold">Sklep</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/produkty"
                  className="transition-colors hover:text-foreground"
                >
                  Produkty
                </Link>
              </li>
              <li>
                <Link
                  href="/koszyk"
                  className="transition-colors hover:text-foreground"
                >
                  Koszyk
                </Link>
              </li>
              <li>
                <Link
                  href="/dostawa"
                  className="transition-colors hover:text-foreground"
                >
                  Dostawa i płatności
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-semibold">Firma</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/o-nas"
                  className="transition-colors hover:text-foreground"
                >
                  O nas
                </Link>
              </li>
              <li>
                <Link
                  href="/kontakt"
                  className="transition-colors hover:text-foreground"
                >
                  Kontakt
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="transition-colors hover:text-foreground"
                >
                  Logowanie
                </Link>
              </li>
              <li>
                <Link
                  href="/rejestracja"
                  className="transition-colors hover:text-foreground"
                >
                  Rejestracja
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-border/60 pt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Smaczek Kłaczek. Wszystkie prawa
          zastrzeżone.
        </div>
      </div>
    </footer>
  );
}
