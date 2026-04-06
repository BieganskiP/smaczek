import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Moje konto",
  robots: { index: false, follow: false },
};
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function AccountPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      address: true,
      city: true,
      postalCode: true,
    },
  });

  if (!user) redirect("/login");

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Moje konto</h1>

      <Card className="mb-6 border-border/60 shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg">Dane konta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Imię i nazwisko</span>
            <span>{user.firstName} {user.lastName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email</span>
            <span>{user.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Telefon</span>
            <span>{user.phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Adres</span>
            <span>{user.address}, {user.postalCode} {user.city}</span>
          </div>
        </CardContent>
      </Card>

      <Link href="/konto/zamowienia">
        <Button variant="outline" className="w-full">
          Moje zamówienia
        </Button>
      </Link>
    </div>
  );
}
