import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import slugifyLib from "slugify";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
  }).format(price);
}

export function generateSlug(name: string): string {
  return slugifyLib(name, { lower: true, strict: true, locale: "pl" });
}
