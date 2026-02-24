import type { Role } from "@/app/generated/prisma/client";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role?: Role;
  }
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: Role;
    };
  }
}

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string | null;
  slug: string;
};

export type Cart = {
  items: CartItem[];
};
