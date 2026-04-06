import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Smaczek Kłaczek - Karma dla zwierząt",
    template: "%s | Smaczek Kłaczek",
  },
  description:
    "Najlepsza karma dla Twojego pupila. Szeroki wybór karmy dla psów, kotów i innych zwierząt domowych.",
  openGraph: {
    type: "website",
    locale: "pl_PL",
    siteName: "Smaczek Kłaczek",
    title: "Smaczek Kłaczek - Karma dla zwierząt",
    description:
      "Najlepsza karma dla Twojego pupila. Szeroki wybór karmy dla psów, kotów i innych zwierząt domowych.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Smaczek Kłaczek - Karma dla zwierząt",
    description:
      "Najlepsza karma dla Twojego pupila. Szeroki wybór karmy dla psów, kotów i innych zwierząt domowych.",
  },
  alternates: {
    canonical: baseUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
