"use client";

import { useActionState } from "react";
import {
  createCategory,
  updateCategory,
  type CategoryState,
} from "@/actions/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import type { Category } from "@/app/generated/prisma/client";

export function CategoryForm({ category }: { category?: Category }) {
  const action = category
    ? updateCategory.bind(null, category.id)
    : createCategory;

  const [state, formAction, isPending] = useActionState<
    CategoryState,
    FormData
  >(action, {});

  return (
    <Card className="max-w-lg">
      <CardContent className="pt-6">
        <form action={formAction} className="space-y-4">
          {state.error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {state.error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="name">Nazwa</Label>
            <Input
              id="name"
              name="name"
              defaultValue={category?.name ?? ""}
              required
            />
            {state.fieldErrors?.name && (
              <p className="text-sm text-destructive">
                {state.fieldErrors.name}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Opis (opcjonalny)</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={category?.description ?? ""}
              rows={3}
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={isPending}>
              {isPending
                ? "Zapisywanie..."
                : category
                  ? "Zapisz zmiany"
                  : "Utwórz kategorię"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
