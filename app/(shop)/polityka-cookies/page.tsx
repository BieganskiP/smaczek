import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Polityka cookies",
  description: "Informacje o plikach cookies używanych w sklepie",
};

export default function PolitykaCookiesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-8 text-4xl font-bold">Polityka cookies</h1>

      <div className="prose prose-invert max-w-none space-y-8 text-muted-foreground">
        <p className="text-sm">
          Ostatnia aktualizacja: {new Date().toLocaleDateString("pl-PL")}
        </p>

        <section>
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            1. Czym są pliki cookies?
          </h2>
          <p>
            Cookies to małe pliki tekstowe zapisywane na Twoim urządzeniu przez
            przeglądarkę. Służą m.in. do zapamiętywania preferencji, utrzymania
            sesji logowania oraz analityki.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            2. Jakie cookies używamy?
          </h2>
          <ul className="list-inside list-disc space-y-2">
            <li>
              <strong>Niezbędne</strong> – wymagane do działania sklepu (koszyk,
              sesja, uwierzytelnianie). Nie wymagają zgody.
            </li>
            <li>
              <strong>Funkcjonalne</strong> – np. zapamiętanie preferencji,
              ref linków marketingowych. Wymagają zgody.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            3. Jak zarządzać cookies?
          </h2>
          <p>
            Możesz zmienić ustawienia cookies w swojej przeglądarce. Blokada
            cookies niezbędnych może uniemożliwić korzystanie z niektórych
            funkcji sklepu (np. koszyka).
          </p>
          <p>
            Informacje o zarządzaniu cookies w popularnych przeglądarkach:
          </p>
          <ul className="list-inside list-disc space-y-1">
            <li>Chrome: Ustawienia → Prywatność i bezpieczeństwo → Pliki cookie</li>
            <li>Firefox: Opcje → Prywatność i bezpieczeństwo</li>
            <li>Safari: Preferencje → Prywatność</li>
            <li>Edge: Ustawienia → Pliki cookie i uprawnienia witryny</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            4. Podstawa prawna
          </h2>
          <p>
            Stosowanie cookies niezbędnych wynika z art. 6 ust. 1 lit. f RODO
            (prawnie uzasadniony interes). Cookies funkcjonalne wymagają Twojej
            zgody (art. 6 ust. 1 lit. a RODO).
          </p>
        </section>
      </div>
    </div>
  );
}
