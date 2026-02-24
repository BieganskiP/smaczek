"use client";

import { useActionState } from "react";
import { createRefLink, deleteRefLink, type RefLinkState } from "@/actions/admin-reflinks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link2, Copy, Trash2 } from "lucide-react";

type RefLink = { id: string; code: string; label: string | null };

export function RefLinkGenerator({
  baseUrl,
  refLinks,
}: {
  baseUrl: string;
  refLinks: RefLink[];
}) {
  const [state, formAction, isPending] = useActionState<RefLinkState, FormData>(
    createRefLink,
    {}
  );

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="size-5" />
            Nowy ref link
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Tylko zatwierdzone ref linki będą śledzone przy zamówieniach.
          </p>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            {state.error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {state.error}
              </div>
            )}
            {state.success && (
              <div className="rounded-md bg-green-500/10 p-3 text-sm text-green-600">
                Ref link utworzony.
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="code">Kod (np. facebook_ads, newsletter_01)</Label>
              <Input
                id="code"
                name="code"
                placeholder="facebook_ads"
                className="font-mono"
                required
              />
              <p className="text-xs text-muted-foreground">
                Tylko litery, cyfry, _ i -. Będzie znormalizowany do małych liter.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="label">Etykieta (opcjonalnie)</Label>
              <Input
                id="label"
                name="label"
                placeholder="Kampania Facebook Ads"
              />
            </div>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Tworzenie..." : "Utwórz ref link"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Twoje ref linki</CardTitle>
          <p className="text-sm text-muted-foreground">
            Kliknij link, aby skopiować do schowka.
          </p>
        </CardHeader>
        <CardContent>
          {refLinks.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              Brak ref linków. Utwórz pierwszy po lewej.
            </p>
          ) : (
            <div className="space-y-2">
              {refLinks.map((rl) => {
                const url = `${baseUrl}?ref=${encodeURIComponent(rl.code)}`;
                return (
                  <div
                    key={rl.id}
                    className="flex items-center justify-between gap-4 rounded-lg border border-border/70 bg-muted/30 p-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">
                        {rl.label || rl.code}
                        {rl.label && (
                          <span className="ml-2 text-xs text-muted-foreground">
                            ({rl.code})
                          </span>
                        )}
                      </p>
                      <p className="truncate font-mono text-sm text-muted-foreground">
                        {url}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        title="Kopiuj"
                        onClick={() => copyUrl(url)}
                      >
                        <Copy className="size-4" />
                      </Button>
                      <form action={deleteRefLink}>
                        <input type="hidden" name="id" value={rl.id} />
                        <Button
                          type="submit"
                          variant="outline"
                          size="icon"
                          title="Usuń"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </form>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
