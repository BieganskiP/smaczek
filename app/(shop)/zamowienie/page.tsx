import { getUserProfileForCheckout } from "@/actions/profile";
import { CheckoutForm } from "@/components/shop/checkout-form";
import { CartCheckoutGuard } from "@/components/shop/cart-checkout-guard";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function CheckoutPage() {
  const userProfile = await getUserProfileForCheckout();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="mb-8 text-3xl font-bold">Zamówienie</h1>

      <CartCheckoutGuard>
        <CheckoutForm userProfile={userProfile} />
      </CartCheckoutGuard>
    </div>
  );
}
