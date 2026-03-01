import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 12;

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  kategoria?: string;
  szukaj?: string;
  widok?: string;
};

function buildPageUrl(page: number, props: PaginationProps): string {
  const params = new URLSearchParams();
  if (props.kategoria) params.set("kategoria", props.kategoria);
  if (props.szukaj?.trim()) params.set("szukaj", props.szukaj.trim());
  if (props.widok && props.widok !== "siatka") params.set("widok", props.widok);
  if (page > 1) params.set("strona", String(page));
  const q = params.toString();
  return `/produkty${q ? `?${q}` : ""}`;
}

export { PAGE_SIZE };

export function Pagination({
  currentPage,
  totalPages,
  totalCount,
  kategoria,
  szukaj,
  widok,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const from = (currentPage - 1) * PAGE_SIZE + 1;
  const to = Math.min(currentPage * PAGE_SIZE, totalCount);

  return (
    <nav
      className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-between"
      aria-label="Paginacja"
    >
      <p className="text-sm text-muted-foreground">
        {from}–{to} z {totalCount} produktów
      </p>
      <div className="flex items-center gap-2">
        <Link
          href={buildPageUrl(currentPage - 1, {
            currentPage,
            totalPages,
            totalCount,
            kategoria,
            szukaj,
            widok,
          })}
          className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
        >
          <Button variant="outline" size="icon" disabled={currentPage <= 1} aria-label="Poprzednia strona">
            <ChevronLeft className="size-4" />
          </Button>
        </Link>
        <span className="flex flex-wrap items-center justify-center gap-1 px-2 text-sm">
          {(() => {
            const maxVisible = 7;
            const pages: (number | "ellipsis")[] = [];
            if (totalPages <= maxVisible) {
              for (let p = 1; p <= totalPages; p++) pages.push(p);
            } else {
              const left = Math.max(2, currentPage - 1);
              const right = Math.min(totalPages - 1, currentPage + 1);
              pages.push(1);
              if (left > 2) pages.push("ellipsis");
              for (let p = left; p <= right; p++) pages.push(p);
              if (right < totalPages - 1) pages.push("ellipsis");
              if (totalPages > 1) pages.push(totalPages);
            }
            return pages.map((page, i) =>
              page === "ellipsis" ? (
                <span key={`e-${i}`} className="px-1 text-muted-foreground">
                  …
                </span>
              ) : (
                <Link
                  key={page}
                  href={buildPageUrl(page, {
                    currentPage,
                    totalPages,
                    totalCount,
                    kategoria,
                    szukaj,
                    widok,
                  })}
                >
                  <Button
                    variant={currentPage === page ? "default" : "outline"}
                    size="icon"
                    className="min-w-9"
                    aria-label={`Strona ${page}`}
                    aria-current={currentPage === page ? "page" : undefined}
                  >
                    {page}
                  </Button>
                </Link>
              ),
            );
          })()}
        </span>
        <Link
          href={buildPageUrl(currentPage + 1, {
            currentPage,
            totalPages,
            totalCount,
            kategoria,
            szukaj,
            widok,
          })}
          className={
            currentPage >= totalPages ? "pointer-events-none opacity-50" : ""
          }
        >
          <Button
            variant="outline"
            size="icon"
            disabled={currentPage >= totalPages}
            aria-label="Następna strona"
          >
            <ChevronRight className="size-4" />
          </Button>
        </Link>
      </div>
    </nav>
  );
}
