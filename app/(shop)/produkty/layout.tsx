import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Produkty",
  description:
    "Przeglądaj naszą ofertę karmy dla zwierząt. Najlepsze marki i najwyższa jakość dla Twojego pupila.",
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
