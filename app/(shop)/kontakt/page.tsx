import { Mail, MapPin, Phone, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Kontakt",
  description:
    "Skontaktuj się z nami – chętnie odpowiemy na pytania dotyczące produktów i zamówień.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="mb-16 text-center">
        <div className="mx-auto mb-8 flex size-24 items-center justify-center rounded-2xl bg-primary/10 shadow-card">
          <MessageCircle className="size-12 text-primary" />
        </div>
        <h1 className="mb-4 text-4xl font-bold tracking-tight">Kontakt</h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Masz pytania? Chętnie pomożemy w doborze karmy lub odpowiemy na
          pytania dotyczące zamówień.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border/60 shadow-soft">
          <CardContent className="flex items-start gap-4 p-6">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Mail className="size-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">E-mail</h3>
              <a
                href="mailto:kontakt@smaczek-klaczek.pl"
                className="mt-2 block text-primary hover:underline"
              >
                kontakt@smaczek-klaczek.pl
              </a>
              <p className="mt-1 text-sm text-muted-foreground">
                Odpowiadamy w ciągu 24 godzin
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-soft">
          <CardContent className="flex items-start gap-4 p-6">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Phone className="size-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Telefon</h3>
              <a
                href="tel:+48123456789"
                className="mt-2 block text-primary hover:underline"
              >
                +48 123 456 789
              </a>
              <p className="mt-1 text-sm text-muted-foreground">
                Pn–Pt 9:00–17:00
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8 border-border/60 shadow-soft">
        <CardContent className="flex items-start gap-4 p-6">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <MapPin className="size-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Adres</h3>
            <p className="mt-2 text-muted-foreground">
              Smaczek Kłaczek Sp. z o.o.
              <br />
              ul. Zwierzacza 15
              <br />
              00-001 Warszawa
            </p>
          </div>
        </CardContent>
      </Card>

      <p className="mt-12 text-center text-sm text-muted-foreground">
        W przypadku pytań o zamówienie podaj numer zamówienia – ułatwi to
        udzielenie szybkiej odpowiedzi.
      </p>
    </div>
  );
}
