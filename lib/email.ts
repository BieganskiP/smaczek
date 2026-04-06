import { Resend } from "resend";
import type { ReactElement } from "react";

let _resend: Resend | null = null;
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

export type OrderEmailData = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  total: number;
  createdAt: Date;
  payuOrderId?: string | null;
  items: Array<{
    productName: string;
    quantity: number;
    price: number;
  }>;
};

export async function sendEmail({
  to,
  subject,
  react,
}: {
  to: string;
  subject: string;
  react: ReactElement;
}): Promise<{ success: boolean }> {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is not set — skipping email:", subject);
    return { success: false };
  }

  try {
    const from =
      process.env.EMAIL_FROM ||
      "Smaczek Kłaczek <zamowienia@smaczekklaczek.pl>";
    await getResend().emails.send({ from, to, subject, react });
    return { success: true };
  } catch (err) {
    console.error("Failed to send email:", subject, err);
    return { success: false };
  }
}
