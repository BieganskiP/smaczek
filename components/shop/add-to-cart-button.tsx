"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "./cart-context";
import { ShoppingCart, Check } from "lucide-react";

type Props = {
  product: {
    productId: string;
    name: string;
    price: number;
    imageUrl: string | null;
    slug: string;
  };
};

export function AddToCartButton({ product }: Props) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem({ ...product, quantity });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="flex items-center gap-3">
      <Input
        type="number"
        min={1}
        max={99}
        value={quantity}
        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
        className="w-20"
      />
      <Button onClick={handleAdd} size="lg" className="gap-2" disabled={added}>
        {added ? (
          <>
            <Check className="size-4" />
            Dodano!
          </>
        ) : (
          <>
            <ShoppingCart className="size-4" />
            Dodaj do koszyka
          </>
        )}
      </Button>
    </div>
  );
}
