import Image from "next/image";
import Link from "next/link";
import { COMPANY } from "@/lib/company";

export function Footer() {
  return (
    <footer className="relative mt-auto border-t border-border/60 bg-linear-to-b from-card to-card/80 shadow-[0_-4px_20px_-8px_rgba(0,0,0,0.06)]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,hsl(var(--primary)/0.12),transparent)] opacity-0 dark:opacity-100" />
      <div className="relative mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <Link href="/" className="mb-5 inline-block">
              <Image
                src="/logo.png"
                alt={COMPANY.shortName}
                width={220}
                height={55}
                className="h-50 w-auto object-contain"
              />
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Najlepsza karma dla Twojego pupila. Szeroki wybór karmy dla psów,
              kotów i innych zwierząt domowych.
            </p>
            <div className="mt-4 text-xs text-muted-foreground">
              <p>{COMPANY.name}</p>
              <p>
                {COMPANY.address.street}, {COMPANY.address.postalCode}{" "}
                {COMPANY.address.city}
              </p>
              <p>NIP: {COMPANY.nip}</p>
            </div>
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
                  href="/regulamin"
                  className="transition-colors hover:text-foreground"
                >
                  Regulamin
                </Link>
              </li>
              <li>
                <Link
                  href="/polityka-prywatnosci"
                  className="transition-colors hover:text-foreground"
                >
                  Polityka prywatności
                </Link>
              </li>
              <li>
                <Link
                  href="/polityka-cookies"
                  className="transition-colors hover:text-foreground"
                >
                  Polityka cookies
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
          &copy; {new Date().getFullYear()} {COMPANY.shortName}. Wszystkie prawa
          zastrzeżone.
        </div>
      </div>
    </footer>
  );
}
