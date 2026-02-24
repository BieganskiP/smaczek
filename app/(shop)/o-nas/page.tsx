import { PawPrint, Heart, Leaf, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "O nas",
  description:
    "Poznaj Smaczek Kłaczek – sklep z karmą dla zwierząt, który stawia na jakość i troskę o Twojego pupila.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="mb-16 text-center">
        <div className="mx-auto mb-8 flex size-24 items-center justify-center rounded-2xl bg-primary/10 shadow-card">
          <PawPrint className="size-12 text-primary" />
        </div>
        <h1 className="mb-4 text-4xl font-bold tracking-tight">
          O Smaczek Kłaczek
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Jesteśmy sklepem z pasją do zwierząt. Od lat pomagamy opiekunom
          wybierać najlepszą karmę dla ich pupili.
        </p>
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="mb-6 text-2xl font-bold">Nasza misja</h2>
          <p className="leading-relaxed text-muted-foreground">
            W Smaczek Kłaczek wierzymy, że każdy zwierzak zasługuje na
            pełnowartościową, zdrową dietę. Dlatego oferujemy wyłącznie produkty
            od sprawdzonych producentów – karmy suche i mokre dla psów i kotów,
            przysmaki oraz akcesoria. Dbamy o to, aby każdy produkt w naszej
            ofercie spełniał najwyższe standardy jakości.
          </p>
        </section>

        <div className="grid gap-6 sm:grid-cols-2">
          <Card className="border-border/60 shadow-soft">
            <CardContent className="flex items-start gap-4 p-6">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Leaf className="size-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Jakość przede wszystkim</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Współpracujemy tylko z renomowanymi markami. Każdy produkt
                  przechodzi naszą wewnętrzną weryfikację.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-soft">
            <CardContent className="flex items-start gap-4 p-6">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Heart className="size-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Z miłości do zwierząt</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Sami jesteśmy opiekunami zwierząt. Wiemy, jak ważna jest
                  odpowiednia dieta dla zdrowia i samopoczucia pupila.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <section>
          <h2 className="mb-6 text-2xl font-bold">Dlaczego warto nas wybrać?</h2>
          <ul className="space-y-4">
            {[
              "Szeroki wybór karmy dla psów, kotów i innych zwierząt domowych",
              "Darmowa dostawa przy zamówieniach powyżej 150 zł",
              "Bezpieczne płatności przez PayU",
              "Szybka realizacja zamówień",
              "Pomoc w doborze produktów – chętnie odpowiemy na pytania",
            ].map((item, i) => (
              <li
                key={i}
                className="flex items-center gap-3 rounded-lg border border-border/60 bg-muted/30 px-4 py-3"
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                  {i + 1}
                </span>
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex items-center gap-6 p-8">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
              <Users className="size-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Dołącz do nas</h3>
              <p className="mt-1 text-muted-foreground">
                Załóż konto i ciesz się wygodnymi zakupami, historią zamówień i
                szybkim procesem realizacji.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
