import Image from "next/image";
import Link from "next/link";
import { COMPANY } from "@/lib/company";

const SHOP_LINKS = [
  { href: "/produkty", label: "Produkty" },
  { href: "/koszyk", label: "Koszyk" },
  { href: "/dostawa", label: "Dostawa i płatności" },
] as const;

const COMPANY_LINKS = [
  { href: "/o-nas", label: "O nas" },
  { href: "/kontakt", label: "Kontakt" },
  { href: "/regulamin", label: "Regulamin" },
  { href: "/polityka-prywatnosci", label: "Polityka prywatności" },
  { href: "/polityka-cookies", label: "Polityka cookies" },
  { href: "/login", label: "Logowanie" },
  { href: "/rejestracja", label: "Rejestracja" },
] as const;

export function Footer() {
  return (
    <footer className="relative border-t border-border bg-card">
      {/* Top accent line */}
      <div className="h-px w-full bg-linear-to-r from-transparent via-primary/40 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-3">
          {/* Brand column */}
          <div>
            <Link
              href="/"
              className="mb-6 inline-block transition-opacity duration-200 hover:opacity-75"
            >
              <Image
                src="/logo-simple.png"
                alt={COMPANY.shortName}
                width={110}
                height={55}
                className="h-11 w-auto object-contain"
              />
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Najlepsza karma dla Twojego pupila. Szeroki wybór karmy dla psów,
              kotów i innych zwierząt domowych.
            </p>
            <div className="mt-5 space-y-1 text-xs text-muted-foreground">
              <p>{COMPANY.name}</p>
              <p>
                {COMPANY.address.street}, {COMPANY.address.postalCode}{" "}
                {COMPANY.address.city}
              </p>
              <p>NIP: {COMPANY.nip}</p>
            </div>
          </div>

          {/* Sklep */}
          <div>
            <h3 className="section-title-line mb-5 text-xs font-semibold uppercase tracking-[0.15em] text-foreground/60">
              Sklep
            </h3>
            <ul className="space-y-3">
              {SHOP_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground transition-colors duration-200 hover:text-primary"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Firma */}
          <div>
            <h3 className="section-title-line mb-5 text-xs font-semibold uppercase tracking-[0.15em] text-foreground/60">
              Firma
            </h3>
            <ul className="space-y-3">
              {COMPANY_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground transition-colors duration-200 hover:text-primary"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} {COMPANY.shortName}. Wszystkie
            prawa zastrzeżone.
          </p>
          <p className="text-xs text-muted-foreground/70">Made with care in Poland</p>
        </div>
      </div>
    </footer>
  );
}
