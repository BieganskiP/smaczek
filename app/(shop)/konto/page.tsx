import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function AccountPage() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Moje konto</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Dane konta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Imię</span>
            <span>{session.user.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email</span>
            <span>{session.user.email}</span>
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
