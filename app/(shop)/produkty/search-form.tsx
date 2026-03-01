import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export function SearchForm({
  defaultValue,
  categorySlug,
}: {
  defaultValue: string;
  categorySlug?: string;
}) {
  return (
    <form action="/produkty" method="GET" className="flex max-w-md gap-2">
      {categorySlug && <input type="hidden" name="kategoria" value={categorySlug} />}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          name="szukaj"
          defaultValue={defaultValue}
          placeholder="Szukaj po nazwie..."
          className="pl-9"
          aria-label="Szukaj produktów"
        />
      </div>
      <Button type="submit" variant="secondary" size="default">
        Szukaj
      </Button>
    </form>
  );
}
