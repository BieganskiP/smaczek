import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Zwraca listę zatwierdzonych kodów ref (tylko te utworzone przez admina).
 * Endpoint publiczny - używany przez RefLinkTracker do walidacji.
 */
export async function GET() {
  try {
    const refs = await prisma.refLink.findMany({
      select: { code: true },
      orderBy: { code: "asc" },
    });
    return NextResponse.json(
      refs.map((r) => r.code),
      { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" } }
    );
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
