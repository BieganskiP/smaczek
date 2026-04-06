import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Row,
  Column,
} from "@react-email/components";
import type { OrderEmailData } from "@/lib/email";

const GOLD = "#E9BC7A";
const BG = "#f9f9f9";
const CARD_BG = "#ffffff";
const TEXT = "#1a1a1a";
const MUTED = "#666666";
const BORDER = "#e5e5e5";

function formatPrice(amount: number) {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
  }).format(amount);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function OrderCancelledEmail({ order }: { order: OrderEmailData }) {
  return (
    <Html lang="pl">
      <Head />
      <Preview>
        Zamówienie #{order.id.slice(-8).toUpperCase()} zostało anulowane
      </Preview>
      <Body style={{ background: BG, fontFamily: "Arial, sans-serif", margin: 0, padding: "32px 0" }}>
        <Container style={{ maxWidth: 600, margin: "0 auto" }}>
          {/* Header */}
          <Section style={{ background: "#1a1a1a", borderRadius: "8px 8px 0 0", padding: "24px 32px", textAlign: "center" }}>
            <Heading style={{ color: GOLD, margin: 0, fontSize: 24, fontWeight: 700, letterSpacing: "0.05em" }}>
              Smaczek Kłaczek
            </Heading>
          </Section>

          {/* Body */}
          <Section style={{ background: CARD_BG, padding: "32px", borderLeft: `1px solid ${BORDER}`, borderRight: `1px solid ${BORDER}` }}>
            {/* Status badge */}
            <Section style={{ textAlign: "center", marginBottom: 24 }}>
              <Text style={{ display: "inline-block", background: "#fee2e2", color: "#dc2626", borderRadius: 20, padding: "6px 16px", fontSize: 13, fontWeight: 700, margin: 0 }}>
                ✕ Zamówienie anulowane
              </Text>
            </Section>

            <Heading as="h2" style={{ color: TEXT, margin: "0 0 8px", fontSize: 22 }}>
              Twoje zamówienie zostało anulowane
            </Heading>
            <Text style={{ color: MUTED, margin: "0 0 24px", fontSize: 15 }}>
              Płatność nie została zrealizowana lub została odrzucona przez
              system płatności. Jeśli pieniądze zostały pobrane z Twojego konta,
              zostaną automatycznie zwrócone przez operatora płatności w ciągu
              kilku dni roboczych.
            </Text>

            {/* Order meta */}
            <Section style={{ background: "#f5f5f5", borderRadius: 6, padding: "16px 20px", marginBottom: 24 }}>
              <Row>
                <Column>
                  <Text style={{ color: MUTED, margin: "0 0 4px", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Numer zamówienia
                  </Text>
                  <Text style={{ color: TEXT, margin: 0, fontSize: 16, fontWeight: 700 }}>
                    #{order.id.slice(-8).toUpperCase()}
                  </Text>
                </Column>
                <Column>
                  <Text style={{ color: MUTED, margin: "0 0 4px", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Data zamówienia
                  </Text>
                  <Text style={{ color: TEXT, margin: 0, fontSize: 14 }}>
                    {formatDate(order.createdAt)}
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* Items */}
            <Text style={{ color: TEXT, fontSize: 14, fontWeight: 700, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Anulowane produkty
            </Text>
            <Section style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden" }}>
              {order.items.map((item, i) => (
                <Row
                  key={i}
                  style={{
                    padding: "12px 16px",
                    borderBottom: i < order.items.length - 1 ? `1px solid ${BORDER}` : "none",
                    background: i % 2 === 0 ? CARD_BG : "#fafafa",
                  }}
                >
                  <Column style={{ width: "60%" }}>
                    <Text style={{ color: TEXT, margin: 0, fontSize: 14 }}>
                      {item.productName}
                    </Text>
                    <Text style={{ color: MUTED, margin: "2px 0 0", fontSize: 12 }}>
                      {formatPrice(item.price)} × {item.quantity}
                    </Text>
                  </Column>
                  <Column style={{ textAlign: "right" }}>
                    <Text style={{ color: TEXT, margin: 0, fontSize: 14, fontWeight: 700 }}>
                      {formatPrice(item.price * item.quantity)}
                    </Text>
                  </Column>
                </Row>
              ))}
            </Section>

            {/* Total */}
            <Row style={{ padding: "16px 0 0" }}>
              <Column>
                <Text style={{ color: TEXT, margin: 0, fontSize: 16, fontWeight: 700 }}>
                  Wartość zamówienia
                </Text>
              </Column>
              <Column style={{ textAlign: "right" }}>
                <Text style={{ color: MUTED, margin: 0, fontSize: 20, fontWeight: 700, textDecoration: "line-through" }}>
                  {formatPrice(order.total)}
                </Text>
              </Column>
            </Row>

            <Hr style={{ borderColor: BORDER, margin: "24px 0" }} />

            <Text style={{ color: MUTED, margin: 0, fontSize: 14 }}>
              Chcesz spróbować ponownie? Zapraszamy na{" "}
              <a href={process.env.NEXT_PUBLIC_APP_URL || "https://smaczekklaczek.pl"} style={{ color: GOLD }}>
                smaczekklaczek.pl
              </a>
            </Text>
          </Section>

          {/* Footer */}
          <Section style={{ background: "#1a1a1a", borderRadius: "0 0 8px 8px", padding: "20px 32px", textAlign: "center" }}>
            <Text style={{ color: "#666", margin: 0, fontSize: 12 }}>
              Smaczek Kłaczek — najlepsza karma dla Twojego pupila
            </Text>
            <Text style={{ color: "#444", margin: "8px 0 0", fontSize: 11 }}>
              Ten email został wysłany automatycznie. Nie odpowiadaj na tę wiadomość.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default OrderCancelledEmail;
