import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rejestracja",
  description: "Utwórz konto w sklepie Smaczek Kłaczek.",
  robots: { index: false, follow: false },
};

export default function RejestracjaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
