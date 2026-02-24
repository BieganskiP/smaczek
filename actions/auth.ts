"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

const registerSchema = z.object({
  firstName: z.string().min(2, "Imię musi mieć co najmniej 2 znaki"),
  lastName: z.string().min(2, "Nazwisko musi mieć co najmniej 2 znaki"),
  email: z.string().email("Nieprawidłowy adres email"),
  phone: z.string().min(9, "Nieprawidłowy numer telefonu"),
  password: z.string().min(6, "Hasło musi mieć co najmniej 6 znaków"),
  address: z.string().min(3, "Adres jest wymagany"),
  city: z.string().min(2, "Miasto jest wymagane"),
  postalCode: z.string().regex(/^\d{2}-\d{3}$/, "Kod pocztowy: format XX-XXX"),
});

export type AuthState = {
  error?: string;
  fieldErrors?: Record<string, string>;
  success?: boolean;
};

export async function register(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = registerSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
    address: formData.get("address"),
    city: formData.get("city"),
    postalCode: formData.get("postalCode"),
  });

  if (!parsed.success) {
    return {
      fieldErrors: Object.fromEntries(
        parsed.error.issues.map((i) => [i.path[0], i.message]),
      ),
    };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });

  if (existingUser) {
    return { error: "Użytkownik z tym adresem email już istnieje" };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  await prisma.user.create({
    data: {
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      address: parsed.data.address,
      city: parsed.data.city,
      postalCode: parsed.data.postalCode,
      passwordHash,
    },
  });

  return { success: true };
}

export async function login(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  try {
    await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirectTo: "/?session_refresh=1",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Nieprawidłowy email lub hasło" };
    }
    throw error;
  }
  redirect("/");
}
