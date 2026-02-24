import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Link2 } from "lucide-react";

export async function RefLinksFilter({
  currentRef,
  statusParam,
}: {
  currentRef?: string;
  statusParam?: string;
}) {
  const refLinks = await prisma.order.findMany({
    where: { refLink: { not: null } },
    select: { refLink: true },
    distinct: ["refLink"],
  });

  const refs = refLinks
    .map((r) => r.refLink)
    .filter((r): r is string => r != null)
    .sort();

  if (refs.length === 0) return null;

  const baseHref = statusParam
    ? `/admin/zamowienia?status=${statusParam}`
    : "/admin/zamowienia";

  return (
    <div className="mb-6">
      <p className="mb-2 text-sm font-medium text-muted-foreground">
        Filtruj po ref linku:
      </p>
      <div className="flex flex-wrap gap-2">
        {refs.map((ref) => {
          const href = `${baseHref}${baseHref.includes("?") ? "&" : "?"}ref=${encodeURIComponent(ref)}`;
          return (
            <Link key={ref} href={href}>
              <Button
                variant={currentRef === ref ? "default" : "outline"}
                size="sm"
                className="gap-1.5"
              >
                <Link2 className="size-3.5" />
                {ref}
              </Button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
