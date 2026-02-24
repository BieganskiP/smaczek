import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { RefLinkGenerator } from "@/components/admin/ref-link-generator";

export const metadata = {
  title: "Ref linki",
  description: "Generator i zarządzanie ref linkami marketingowymi",
};

export default async function AdminRefLinksPage() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const refLinks = await prisma.refLink.findMany({
    orderBy: { createdAt: "desc" },
  });

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://smaczek-klaczek.pl";

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Ref linki</h1>

      <RefLinkGenerator baseUrl={baseUrl} refLinks={refLinks} />
    </div>
  );
}
