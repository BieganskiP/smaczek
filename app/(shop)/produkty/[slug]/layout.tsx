import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product) {
    return { title: "Produkt nie znaleziony" };
  }

  const description = (product.shortDescription ?? product.description).slice(0, 160);

  return {
    title: product.name,
    description,
    alternates: { canonical: `/produkty/${product.slug}` },
    openGraph: {
      title: `${product.name} | Smaczek Kłaczek`,
      description,
      type: "website",
      ...(product.imageUrl ? { images: [{ url: product.imageUrl, alt: product.name }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Smaczek Kłaczek`,
      description,
      ...(product.imageUrl ? { images: [product.imageUrl] } : {}),
    },
  };
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
