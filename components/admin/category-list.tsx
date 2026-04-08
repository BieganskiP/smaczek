"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
import { deleteCategory } from "@/actions/categories";
import { useRouter } from "next/navigation";
import { useState } from "react";

type CategoryWithCount = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  _count: { products: number };
};

export function CategoryList({
  categories,
}: {
  categories: CategoryWithCount[];
}) {
  if (categories.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Brak kategorii. Dodaj pierwszą kategorię.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {categories.map((category) => (
        <CategoryRow key={category.id} category={category} />
      ))}
    </div>
  );
}

function CategoryRow({ category }: { category: CategoryWithCount }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    if (!confirm(`Czy na pewno chcesz usunąć kategorię "${category.name}"?`))
      return;
    setDeleting(true);
    setError(null);
    const result = await deleteCategory(category.id);
    if (result.error) {
      setError(result.error);
      setDeleting(false);
    } else {
      router.refresh();
    }
  }

  return (
    <Card>
      <CardContent className="flex items-center justify-between py-4">
        <div>
          <h3 className="font-medium">{category.name}</h3>
          <p className="text-sm text-muted-foreground">
            {category._count.products} produktów
            {category.description && ` · ${category.description}`}
          </p>
          {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/kategorie/${category.id}`} aria-label={`Edytuj kategorię ${category.name}`}>
            <Button variant="outline" size="icon" aria-label={`Edytuj kategorię ${category.name}`}>
              <Pencil className="size-4" aria-hidden />
            </Button>
          </Link>
          <Button
            variant="outline"
            size="icon"
            onClick={handleDelete}
            disabled={deleting}
            aria-label={`Usuń kategorię ${category.name}`}
          >
            <Trash2 className="size-4" aria-hidden />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
