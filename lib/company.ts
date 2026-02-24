/**
 * Dane przedsiębiorcy – wymagane prawnie na stronie sklepu.
 * Zaktualizuj zgodnie z danymi swojej firmy.
 */
export const COMPANY = {
  name: "Smaczek Kłaczek Sp. z o.o.",
  shortName: "Smaczek Kłaczek",
  nip: "1234567890",
  regon: "123456789",
  krs: "0000123456",
  address: {
    street: "ul. Zwierzacza 15",
    postalCode: "00-001",
    city: "Warszawa",
  },
  email: "kontakt@smaczek-klaczek.pl",
  phone: "+48 123 456 789",
  workingHours: "Pn–Pt 9:00–17:00",
} as const;
