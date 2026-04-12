import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";

function getIp(req: { headers: { get: (key: string) => string | null } }): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

function tooManyRequests(retryAfterSeconds: number): NextResponse {
  return new NextResponse("Too Many Requests", {
    status: 429,
    headers: { "Retry-After": String(retryAfterSeconds) },
  });
}

export const proxy = auth((req) => {
  const { pathname } = req.nextUrl;
  const ip = getIp(req);

  // Auth endpoint — brute-force protection: 10 attempts / 10 min per IP
  if (pathname.startsWith("/api/auth")) {
    const { allowed, retryAfterSeconds } = checkRateLimit(`auth:${ip}`, 10, 10 * 60 * 1000);
    if (!allowed) return tooManyRequests(retryAfterSeconds);
  }

  // Ref-links — DB-backed public endpoint: 20 req / min per IP
  if (pathname === "/api/ref-links") {
    const { allowed, retryAfterSeconds } = checkRateLimit(`ref:${ip}`, 20, 60_000);
    if (!allowed) return tooManyRequests(retryAfterSeconds);
  }

  // PayU webhook — legitimate traffic is very low: 30 req / min per IP
  if (pathname === "/api/webhooks/payu") {
    const { allowed, retryAfterSeconds } = checkRateLimit(`payu:${ip}`, 30, 60_000);
    if (!allowed) return tooManyRequests(retryAfterSeconds);
  }

  // Admin route protection
  if (pathname.startsWith("/admin")) {
    if (!req.auth) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (req.auth.user?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
