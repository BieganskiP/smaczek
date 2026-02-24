import { COMPANY } from "@/lib/company";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Polityka prywatności",
  description: "Polityka prywatności i ochrony danych osobowych RODO",
};

export default function PolitykaPrywatnosciPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-8 text-4xl font-bold">Polityka prywatności</h1>

      <div className="prose prose-invert max-w-none space-y-8 text-muted-foreground">
        <p className="text-sm">
          Ostatnia aktualizacja: {new Date().toLocaleDateString("pl-PL")}
        </p>

        <section>
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            1. Administrator danych
          </h2>
          <p>
            Administratorem Twoich danych osobowych jest {COMPANY.name}, z
            siedzibą w {COMPANY.address.city}, {COMPANY.address.street},{" "}
            {COMPANY.address.postalCode} {COMPANY.address.city}.
          </p>
          <p>
            Kontakt: {COMPANY.email}, tel. {COMPANY.phone}
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            2. Cele i podstawy prawne przetwarzania
          </h2>
          <p>Przetwarzamy Twoje dane osobowe w następujących celach:</p>
          <ul className="list-inside list-disc space-y-2">
            <li>
              <strong>Realizacja zamówienia</strong> – art. 6 ust. 1 lit. b RODO
              (wykonanie umowy)
            </li>
            <li>
              <strong>Rejestracja konta</strong> – art. 6 ust. 1 lit. b RODO
              (wykonanie umowy)
            </li>
            <li>
              <strong>Kontakt</strong> – art. 6 ust. 1 lit. f RODO (prawnie
              uzasadniony interes)
            </li>
            <li>
              <strong>Obowiązki księgowe i podatkowe</strong> – art. 6 ust. 1
              lit. c RODO (obowiązek prawny)
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            3. Odbiorcy danych
          </h2>
          <p>
            Twoje dane mogą być przekazywane: dostawcom usług IT (hosting),
            operatorom płatności (PayU), firmom kurierskim, biurom rachunkowym.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            4. Okres przechowywania
          </h2>
          <p>
            Dane przechowujemy przez okres niezbędny do realizacji zamówienia,
            a następnie przez okres wymagany przepisami prawa (np. 5 lat dla
            dokumentacji księgowej). Dane konta użytkownika – do momentu
            usunięcia konta.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            5. Twoje prawa
          </h2>
          <p>Masz prawo do:</p>
          <ul className="list-inside list-disc space-y-2">
            <li>Dostępu do swoich danych</li>
            <li>Sprostowania danych</li>
            <li>Usunięcia danych („prawo do bycia zapomnianym”)</li>
            <li>Ograniczenia przetwarzania</li>
            <li>Przenoszenia danych</li>
            <li>Sprzeciwu wobec przetwarzania</li>
            <li>Cofnięcia zgody (gdy przetwarzanie oparte jest na zgodzie)</li>
            <li>Wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych
              (PUODO)
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            6. Bezpieczeństwo
          </h2>
          <p>
            Stosujemy środki techniczne i organizacyjne zapewniające ochronę
            danych osobowych przed nieuprawnionym dostępem, utratą lub
            zniszczeniem.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            7. Cookies
          </h2>
          <p>
            Szczegółowe informacje o plikach cookies znajdują się w{" "}
            <a href="/polityka-cookies" className="text-primary hover:underline">
              Polityce cookies
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
