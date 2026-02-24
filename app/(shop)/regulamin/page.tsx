import { COMPANY } from "@/lib/company";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Regulamin sklepu",
  description: "Regulamin sklepu internetowego Smaczek Kłaczek",
};

export default function RegulaminPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-8 text-4xl font-bold">Regulamin sklepu</h1>

      <div className="prose prose-invert max-w-none space-y-8 text-muted-foreground">
        <section>
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            §1. Postanowienia ogólne
          </h2>
          <p>
            1. Niniejszy regulamin określa zasady korzystania ze sklepu
            internetowego prowadzonego pod adresem{" "}
            {process.env.NEXT_PUBLIC_APP_URL || "sklep.smaczek-klaczek.pl"} przez{" "}
            {COMPANY.name}, z siedzibą w {COMPANY.address.city},{" "}
            {COMPANY.address.street}, {COMPANY.address.postalCode}{" "}
            {COMPANY.address.city}, NIP: {COMPANY.nip}, REGON: {COMPANY.regon},
            KRS: {COMPANY.krs}.
          </p>
          <p>
            2. Sklep realizuje sprzedaż na podstawie ustawy z dnia 23 kwietnia
            1964 r. – Kodeks cywilny oraz ustawy z dnia 30 maja 2014 r. o
            prawach konsumenta i o zmianie ustawy o ochronie praw konsumenta.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            §2. Składanie zamówień
          </h2>
          <p>
            1. Zamówienie można złożyć przez formularz zamówienia dostępny w
            sklepie internetowym.
          </p>
          <p>
            2. Złożenie zamówienia jest równoznaczne z akceptacją niniejszego
            regulaminu.
          </p>
          <p>
            3. Sklep potwierdza przyjęcie zamówienia poprzez wysłanie wiadomości
            e-mail na adres podany przy składaniu zamówienia.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            §3. Ceny i płatności
          </h2>
          <p>
            1. Wszystkie ceny podane są w złotówkach polskich (PLN) i zawierają
            podatek VAT.
          </p>
          <p>
            2. Sklep akceptuje płatności poprzez system PayU (karta płatnicza,
            przelew, BLIK).
          </p>
          <p>
            3. Zamówienie jest realizowane po zaksięgowaniu płatności.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            §4. Dostawa
          </h2>
          <p>
            1. Koszt dostawy jest podawany przed złożeniem zamówienia.
          </p>
          <p>
            2. Czas realizacji zamówienia wynosi do 3 dni roboczych od momentu
            zaksięgowania płatności.
          </p>
          <p>
            3. Szczegółowe informacje o dostawie znajdują się na stronie
            &quot;Dostawa i płatności&quot;.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            §5. Prawo do odstąpienia od umowy (konsumenci)
          </h2>
          <p>
            1. Konsument ma prawo odstąpić od umowy w terminie 14 dni bez
            podawania przyczyny.
          </p>
          <p>
            2. Termin do odstąpienia od umowy wygasa po upływie 14 dni od dnia,
            w którym konsument wszedł w posiadanie rzeczy.
          </p>
          <p>
            3. Aby skorzystać z prawa odstąpienia, należy poinformować nas o
            swojej decyzji w drodze jednoznacznego oświadczenia (np. e-mail na
            adres {COMPANY.email}).
          </p>
          <p>
            4. W przypadku odstąpienia od umowy zwracamy wszystkie otrzymane
            płatności, w tym koszty dostawy, niezwłocznie, nie później niż w
            terminie 14 dni od dnia otrzymania zwracanego towaru.
          </p>
          <p>
            5. Prawo odstąpienia nie przysługuje w odniesieniu do produktów
            łatwo psujących się lub o krótkim terminie ważności.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            §6. Reklamacje
          </h2>
          <p>
            1. Reklamacje można składać na adres e-mail {COMPANY.email} lub
            pisemnie na adres siedziby firmy.
          </p>
          <p>
            2. Sklep rozpatruje reklamacje w terminie 14 dni od ich otrzymania.
          </p>
          <p>
            3. Odpowiedź na reklamację zostanie wysłana na adres e-mail podany w
            zamówieniu.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            §7. Postanowienia końcowe
          </h2>
          <p>
            1. W sprawach nieuregulowanych niniejszym regulaminem stosuje się
            przepisy prawa polskiego.
          </p>
          <p>
            2. Konsument ma prawo skorzystać z pozasądowych sposobów
            rozpatrywania reklamacji i dochodzenia roszczeń (m.in. przez
            stały polubowny sąd konsumencki).
          </p>
          <p>
            3. Regulamin wchodzi w życie z dniem publikacji na stronie sklepu.
          </p>
        </section>
      </div>
    </div>
  );
}
