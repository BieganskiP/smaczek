/**
 * Test script — sends all 3 email templates to the first ADMIN user.
 * Run with: npx tsx scripts/test-emails.ts
 */

import "dotenv/config";
import { prisma } from "../lib/prisma";
import { sendEmail, type OrderEmailData } from "../lib/email";
import { OrderPlacedEmail } from "../emails/order-placed";
import { PaymentConfirmedEmail } from "../emails/payment-confirmed";
import { OrderCancelledEmail } from "../emails/order-cancelled";

const mockOrder: OrderEmailData = {
  id: "test-order-id-1234abcd",
  firstName: "Jan",
  lastName: "Kowalski",
  email: "", // filled in below
  phone: "600 123 456",
  address: "ul. Przykładowa 12/3",
  city: "Warszawa",
  postalCode: "00-001",
  total: 149.97,
  createdAt: new Date(),
  payuOrderId: "PAYU-TEST-XYZ789",
  items: [
    { productName: "Karma sucha Royal Canin Adult 10kg", quantity: 2, price: 49.99 },
    { productName: "Przysmaki Dreamies Mix 3×60g", quantity: 1, price: 24.99 },
    { productName: "Miska ze stali nierdzewnej 0.5L", quantity: 1, price: 25.00 },
  ],
};

async function main() {
  const testEmail = "bieganski1996@gmail.com";
  mockOrder.email = testEmail;
  console.log(`Sending test emails to: ${testEmail}\n`);

  const results = await Promise.all([
    sendEmail({
      to: testEmail,
      subject: `[TEST] Zamówienie #${mockOrder.id.slice(-8).toUpperCase()} zostało złożone`,
      react: OrderPlacedEmail({ order: mockOrder }),
    }),
    sendEmail({
      to: testEmail,
      subject: `[TEST] Płatność za zamówienie #${mockOrder.id.slice(-8).toUpperCase()} potwierdzona`,
      react: PaymentConfirmedEmail({ order: mockOrder }),
    }),
    sendEmail({
      to: testEmail,
      subject: `[TEST] Zamówienie #${mockOrder.id.slice(-8).toUpperCase()} zostało anulowane`,
      react: OrderCancelledEmail({ order: mockOrder }),
    }),
  ]);

  const labels = ["order-placed", "payment-confirmed", "order-cancelled"];
  results.forEach((r, i) =>
    console.log(`${labels[i]}: ${r.success ? "✓ sent" : "✗ failed"}`)
  );

  await prisma.$disconnect?.();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
