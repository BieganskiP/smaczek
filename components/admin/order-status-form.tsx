"use client";

import { useActionState } from "react";
import { updateOrderStatus, type OrderStatusState } from "@/actions/admin-orders";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

export function OrderStatusForm({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const action = updateOrderStatus.bind(null, orderId);
  const [state, formAction, isPending] = useActionState<
    OrderStatusState,
    FormData
  >(action, {});

  return (
    <form action={formAction} className="space-y-3">
      {state.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}
      {state.success && (
        <p className="text-sm text-green-600">Status zaktualizowany</p>
      )}
      <Select name="status" defaultValue={currentStatus}>
        <option value="PENDING">Oczekujące</option>
        <option value="PAID">Opłacone</option>
        <option value="CANCELLED">Anulowane</option>
      </Select>
      <Button type="submit" disabled={isPending} size="sm">
        {isPending ? "Aktualizacja..." : "Zmień status"}
      </Button>
    </form>
  );
}
