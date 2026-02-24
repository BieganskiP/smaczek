"use client";

import { useActionState } from "react";
import {
  createProduct,
  updateProduct,
  type ProductState,
} from "@/actions/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import type { Product, Category } from "@/app/generated/prisma/client";
import Image from "next/image";

export function ProductForm({
  product,
  categories,
}: {
  product?: Product;
  categories: Category[];
}) {
  const action = product
    ? updateProduct.bind(null, product.id)
    : createProduct;

  const [state, formAction, isPending] = useActionState<
    ProductState,
    FormData
  >(action, {});

  return (
    <Card className="max-w-2xl">
      <CardContent className="pt-6">
        <form action={formAction} className="space-y-4">
          {state.error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {state.error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Nazwa produktu</Label>
            <Input
              id="name"
              name="name"
              defaultValue={product?.name ?? ""}
              required
            />
            {state.fieldErrors?.name && (
              <p className="text-sm text-destructive">
                {state.fieldErrors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Opis</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={product?.description ?? ""}
              rows={4}
              required
            />
            {state.fieldErrors?.description && (
              <p className="text-sm text-destructive">
                {state.fieldErrors.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Cena (PLN)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0.01"
                defaultValue={product?.price ?? ""}
                required
              />
              {state.fieldErrors?.price && (
                <p className="text-sm text-destructive">
                  {state.fieldErrors.price}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stan magazynowy</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                min="0"
                defaultValue={product?.stock ?? 0}
                required
              />
              {state.fieldErrors?.stock && (
                <p className="text-sm text-destructive">
                  {state.fieldErrors.stock}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoryId">Kategoria</Label>
            <Select
              id="categoryId"
              name="categoryId"
              defaultValue={product?.categoryId ?? ""}
              required
            >
              <option value="">Wybierz kategorię</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </Select>
            {state.fieldErrors?.categoryId && (
              <p className="text-sm text-destructive">
                {state.fieldErrors.categoryId}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Zdjęcie produktu</Label>
            {product?.imageUrl && (
              <div className="mb-2">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={200}
                  height={200}
                  className="rounded-md object-cover"
                />
              </div>
            )}
            <Input id="image" name="image" type="file" accept="image/*" />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="active"
              name="active"
              defaultChecked={product?.active ?? true}
              className="size-4 rounded border-input"
            />
            <Label htmlFor="active">Aktywny (widoczny w sklepie)</Label>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={isPending}>
              {isPending
                ? "Zapisywanie..."
                : product
                  ? "Zapisz zmiany"
                  : "Utwórz produkt"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
