import crypto from "crypto";

const PAYU_BASE_URL = process.env.PAYU_BASE_URL!;
const PAYU_CLIENT_ID = process.env.PAYU_CLIENT_ID!;
const PAYU_CLIENT_SECRET = process.env.PAYU_CLIENT_SECRET!;
const PAYU_MERCHANT_POS_ID = process.env.PAYU_MERCHANT_POS_ID!;
const PAYU_SECOND_KEY = process.env.PAYU_SECOND_KEY!;

async function getAccessToken(): Promise<string> {
  const response = await fetch(`${PAYU_BASE_URL}/pl/standard/user/oauth/authorize`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: PAYU_CLIENT_ID,
      client_secret: PAYU_CLIENT_SECRET,
    }),
  });

  if (!response.ok) {
    throw new Error(`PayU auth failed: ${response.status}`);
  }

  const data = await response.json();
  return data.access_token;
}

type PayUOrderRequest = {
  orderId: string;
  description: string;
  totalAmount: number; // in grosze (1 PLN = 100 groszy)
  customerEmail: string;
  customerFirstName: string;
  customerLastName: string;
  customerPhone: string;
  products: {
    name: string;
    unitPrice: number; // in grosze
    quantity: number;
  }[];
  continueUrl: string;
  notifyUrl: string;
  customerIp: string;
};

export async function createPayUOrder(params: PayUOrderRequest): Promise<string> {
  const token = await getAccessToken();

  const body = {
    notifyUrl: params.notifyUrl,
    continueUrl: params.continueUrl,
    customerIp: params.customerIp,
    merchantPosId: PAYU_MERCHANT_POS_ID,
    description: params.description,
    currencyCode: "PLN",
    totalAmount: String(params.totalAmount),
    extOrderId: params.orderId,
    buyer: {
      email: params.customerEmail,
      firstName: params.customerFirstName,
      lastName: params.customerLastName,
      phone: params.customerPhone,
    },
    products: params.products.map((p) => ({
      name: p.name,
      unitPrice: String(p.unitPrice),
      quantity: String(p.quantity),
    })),
  };

  const response = await fetch(`${PAYU_BASE_URL}/api/v2_1/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
    redirect: "manual",
  });

  // PayU returns 302 redirect on success
  if (response.status === 302) {
    const redirectUrl = response.headers.get("Location");
    if (redirectUrl) return redirectUrl;
  }

  // Or 200 with JSON containing redirectUri
  if (response.ok) {
    const data = await response.json();
    if (data.redirectUri) return data.redirectUri;
  }

  const errorText = await response.text().catch(() => "Unknown error");
  throw new Error(`PayU order creation failed: ${response.status} ${errorText}`);
}

export function verifyPayUSignature(
  body: string,
  signatureHeader: string,
): boolean {
  const parts = signatureHeader.split(";");
  const signatureMap: Record<string, string> = {};
  for (const part of parts) {
    const [key, value] = part.split("=");
    if (key && value) signatureMap[key.trim()] = value.trim();
  }

  const incomingSignature = signatureMap["signature"];
  const algorithm = signatureMap["algorithm"] || "MD5";

  if (!incomingSignature) return false;

  const concatenated = body + PAYU_SECOND_KEY;

  let expectedSignature: string;
  if (algorithm === "SHA-256" || algorithm === "SHA256") {
    expectedSignature = crypto
      .createHash("sha256")
      .update(concatenated)
      .digest("hex");
  } else {
    expectedSignature = crypto
      .createHash("md5")
      .update(concatenated)
      .digest("hex");
  }

  return incomingSignature.toLowerCase() === expectedSignature.toLowerCase();
}
