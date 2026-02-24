import { Truck, CreditCard, Package, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Dostawa i płatności",
  description:
    "Informacje o dostawie zamówień i metodach płatności w sklepie Smaczek Kłaczek.",
};

export default function ShippingPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="mb-16 text-center">
        <div className="mx-auto mb-8 flex size-24 items-center justify-center rounded-2xl bg-primary/10 shadow-card">
          <Truck className="size-12 text-primary" />
        </div>
        <h1 className="mb-4 text-4xl font-bold tracking-tight">
          Dostawa i płatności
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Wszystko, co musisz wiedzieć o wysyłce zamówień i sposobach płatności.
        </p>
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold">
            <Package className="size-6 text-primary" />
            Dostawa
          </h2>
          <div className="space-y-4 rounded-xl border border-border/60 bg-muted/30 p-6">
            <div className="flex justify-between border-b border-border/60 pb-4">
              <span className="font-medium">Kurier DPD / InPost</span>
              <span className="text-muted-foreground">2–4 dni robocze</span>
            </div>
            <div className="flex justify-between border-b border-border/60 pb-4">
              <span className="font-medium">Koszt dostawy</span>
              <span className="text-muted-foreground">14,99 zł</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Darmowa dostawa</span>
              <span className="font-semibold text-primary">
                Przy zamówieniach powyżej 150 zł
              </span>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold">
            <CreditCard className="size-6 text-primary" />
            Płatności
          </h2>
          <Card className="border-border/60 shadow-soft">
            <CardContent className="p-6">
              <p className="mb-4 text-muted-foreground">
                Akceptujemy płatności przez PayU – bezpieczny system płatności
                online. Możesz zapłacić:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Kartą płatniczą (Visa, Mastercard, Maestro)</li>
                <li>• Przelewem bankowym</li>
                <li>• BLIK</li>
                <li>• Płatnością ratalną (jeśli dostępna)</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold">
            <Clock className="size-6 text-primary" />
            Czas realizacji
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            Zamówienia złożone do godziny 14:00 w dni robocze wysyłamy tego
            samego dnia. Po opłaceniu zamówienia otrzymasz e-mail z numerem
            śledzenia przesyłki. W razie pytań skontaktuj się z nami – chętnie
            pomożemy.
          </p>
        </section>
      </div>
    </div>
  );
}
