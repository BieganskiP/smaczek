import { PawPrint } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <PawPrint className="size-6 text-primary" />
              <span className="text-lg font-bold">Smaczek</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Najlepsza karma dla Twojego pupila. Szeroki wybór karmy dla psów,
              kotów i innych zwierząt domowych.
            </p>
          </div>
          <div>
            <h3 className="mb-4 font-semibold">Sklep</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/produkty" className="hover:text-foreground">
                  Produkty
                </Link>
              </li>
              <li>
                <Link href="/koszyk" className="hover:text-foreground">
                  Koszyk
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-semibold">Konto</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/login" className="hover:text-foreground">
                  Logowanie
                </Link>
              </li>
              <li>
                <Link href="/rejestracja" className="hover:text-foreground">
                  Rejestracja
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Smaczek. Wszystkie prawa
          zastrzeżone.
        </div>
      </div>
    </footer>
  );
}
