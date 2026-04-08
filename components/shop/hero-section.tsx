import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function HeroSection() {
  const videoUrl =
    process.env.NEXT_PUBLIC_HERO_VIDEO_URL ??
    process.env.HERO_VIDEO_URL ??
    null;

  return (
    <section className="relative min-h-[92vh] overflow-hidden">
      {/* Background */}
      {videoUrl ? (
        <>
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 size-full object-cover"
            aria-hidden
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
          <div
            className="absolute inset-0 bg-linear-to-r from-black/95 via-black/75 to-black/40"
            aria-hidden
          />
        </>
      ) : (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url(/hero.png)" }}
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-linear-to-r from-black/95 via-black/80 to-black/50"
            aria-hidden
          />
        </>
      )}

      {/* Decorative gold glow */}
      <div
        className="pointer-events-none absolute -left-32 top-1/3 h-96 w-96 rounded-full opacity-20 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, hsl(36 72% 70%) 0%, transparent 70%)",
        }}
        aria-hidden
      />

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-7xl items-center px-6 py-24">
        <div className="max-w-2xl">
          {/* Label */}
          <div
            className="animate-fade-up mb-7 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/8 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.12em] text-primary"
            style={{ animationDelay: "0ms" }}
          >
            <Sparkles className="size-3" aria-hidden />
            Smaczek Kłaczek • sklep premium
          </div>

          {/* Heading */}
          <h1
            className="animate-fade-up text-5xl font-bold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl xl:text-[5.5rem]"
            style={{ animationDelay: "80ms" }}
          >
            <span className="block text-white">Lepsza karma.</span>
            <span className="mt-2 block text-gold-gradient">
              Zdrowszy pupil.
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="animate-fade-up mt-7 max-w-lg text-base leading-relaxed text-white/50 sm:text-lg"
            style={{ animationDelay: "160ms" }}
          >
            Starannie wyselekcjonowana oferta karm i przysmaków dla psów i
            kotów. Wysoka jakość, szybka dostawa i wygodne zakupy online.
          </p>

          {/* CTAs */}
          <div
            className="animate-fade-up mt-10 flex flex-wrap items-center gap-4"
            style={{ animationDelay: "240ms" }}
          >
            <Link
              href="/produkty"
              className="group inline-flex cursor-pointer items-center gap-2.5 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-black transition-all duration-300 hover:bg-primary/90 hover:shadow-[0_0_24px_hsl(36_72%_70%/0.4)]"
            >
              Zobacz ofertę
              <ArrowRight
                className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
            <Link
              href="/dostawa"
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/15 px-7 py-3.5 text-sm font-medium text-white/70 transition-all duration-300 hover:border-primary/40 hover:text-white/90"
            >
              Dostawa i płatności
            </Link>
          </div>

          {/* Stats bar */}
          <div
            className="animate-fade-up mt-14 flex flex-wrap items-center gap-8"
            style={{ animationDelay: "320ms" }}
          >
            {[
              { value: "100+", label: "produktów" },
              { value: "24h", label: "dostawa" },
              { value: "5.0★", label: "ocena klientów" },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col">
                <span className="text-xl font-bold text-primary">{value}</span>
                <span className="text-xs text-white/40">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-black to-transparent"
        aria-hidden
      />
    </section>
  );
}
