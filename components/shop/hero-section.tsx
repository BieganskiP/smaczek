import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

/**
 * Hero z opcjonalnym video w tle.
 * Aby włączyć video: dodaj plik wideo do folderu public/ i ustaw w .env:
 *   HERO_VIDEO_URL=/nazwa-pliku.mp4
 * (lub NEXT_PUBLIC_HERO_VIDEO_URL jeśli wolisz zmienną publiczną)
 */
export function HeroSection() {
  const videoUrl =
    process.env.NEXT_PUBLIC_HERO_VIDEO_URL ??
    process.env.HERO_VIDEO_URL ??
    null;

  return (
    <section className="relative min-h-[85vh] overflow-hidden py-20 lg:py-28">
      {/* Tło: video lub gradient */}
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
            className="absolute inset-0 bg-linear-to-r from-background/95 via-background/80 to-background/50"
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
          <div className="absolute inset-0 bg-linear-to-r from-background/90 via-background/70 to-background/40" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_20%_10%,hsl(var(--primary)/0.12),transparent_55%)]" />
        </>
      )}

      {/* Treść */}
      <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-7xl items-center px-4">
        <div className="max-w-2xl">
          <div className="animate-fade-up mb-5 inline-flex rounded-full border border-primary/35 bg-primary/10 px-4 py-1.5 text-xs font-medium tracking-wide text-primary">
            Smaczek Kłaczek • sklep premium
          </div>

          <h1 className="animate-fade-up text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl [animation-delay:80ms]">
            Lepsza karma.
            <br />
            <span className="bg-linear-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Zdrowszy pupil.
            </span>
          </h1>

          <p className="animate-fade-up mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground [animation-delay:180ms]">
            Starannie wyselekcjonowana oferta karm i przysmaków dla psów i
            kotów. Wysoka jakość, szybka dostawa i wygodne zakupy online.
          </p>

          <div className="animate-fade-up mt-8 flex flex-wrap items-center gap-3 [animation-delay:260ms]">
            <Link href="/produkty">
              <Button
                size="lg"
                className="hover-lift-strong gap-2 border border-primary/35 bg-primary shadow-md"
              >
                Zobacz ofertę
                <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/dostawa">
              <Button
                variant="outline"
                size="lg"
                className="hover-lift-strong border-primary/30 bg-card"
              >
                Dostawa i płatności
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
