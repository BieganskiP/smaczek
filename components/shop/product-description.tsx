import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

function ChevronDownIcon() {
  return <ChevronDown className="size-5" aria-hidden />;
}

type Attributes = Record<string, string> | null;

function formatDescriptionBlock(block: string): ReactNode {
  const trimmed = block.trim();
  if (!trimmed) return null;

  const lines = trimmed.split("\n").map((l) => l.trim()).filter(Boolean);

  const bulletChars = ["·", "•", "-", "–", "—"];
  const isBulletLine = (line: string) =>
    bulletChars.some((b) => line.startsWith(b)) || /^\d+[.)]\s/.test(line);

  if (lines.length === 1) {
    const line = lines[0];
    const looksLikeHeading =
      line.length < 60 && (line.endsWith("?") || line.endsWith(":"));
    if (looksLikeHeading) {
      return (
        <h3 className="mt-6 text-base font-semibold text-foreground first:mt-0">
          {line}
        </h3>
      );
    }
    return (
      <p className="leading-relaxed text-muted-foreground">{line}</p>
    );
  }

  if (lines.every(isBulletLine)) {
    return (
      <ul className="mt-3 list-inside list-disc space-y-1.5 text-muted-foreground">
        {lines.map((line, i) => {
          const text = line.replace(/^[·•\-–—]\s*|\d+[.)]\s*/, "").trim();
          return (
            <li key={i} className="leading-relaxed">
              {text}
            </li>
          );
        })}
      </ul>
    );
  }

  const parts: ReactNode[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const looksLikeHeading =
      line.length < 60 && (line.endsWith("?") || line.endsWith(":"));
    if (looksLikeHeading) {
      parts.push(
        <h3
          key={i}
          className="mt-6 text-base font-semibold text-foreground first:mt-0"
        >
          {line}
        </h3>,
      );
      i++;
      continue;
    }
    if (isBulletLine(line)) {
      const bulletLines: string[] = [];
      while (i < lines.length && isBulletLine(lines[i])) {
        bulletLines.push(
          lines[i].replace(/^[·•\-–—]\s*|\d+[.)]\s*/, "").trim(),
        );
        i++;
      }
      parts.push(
        <ul
          key={i}
          className="mt-2 list-inside list-disc space-y-1 text-muted-foreground"
        >
          {bulletLines.map((l, j) => (
            <li key={j} className="leading-relaxed">
              {l}
            </li>
          ))}
        </ul>,
      );
      continue;
    }
    const paraLines: string[] = [line];
    i++;
    const isHeadingLine = (l: string) =>
      l.length < 60 && (l.endsWith("?") || l.endsWith(":"));
    while (
      i < lines.length &&
      !isBulletLine(lines[i]) &&
      !isHeadingLine(lines[i])
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    parts.push(
      <p key={i} className="leading-relaxed text-muted-foreground">
        {paraLines.join(" ")}
      </p>,
    );
  }
  return <>{parts}</>;
}

export function ProductDescription({
  shortDescription,
  description,
  attributes,
  className,
}: {
  shortDescription: string | null;
  description: string;
  attributes: Attributes;
  className?: string;
}) {
  const blocks = description
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);

  const attrs =
    attributes && typeof attributes === "object" && !Array.isArray(attributes)
      ? (attributes as Record<string, string>)
      : null;

  const specItems: { key: string; value: string }[] = [];
  const seenValues = new Map<string, string>();

  if (attrs) {
    for (const [key, value] of Object.entries(attrs)) {
      const normalized = value.trim().replace(/\s+/g, " ");
      if (seenValues.has(normalized)) continue;
      seenValues.set(normalized, key);
      const keysWithSameValue = Object.entries(attrs).filter(
        ([, v]) => v.trim().replace(/\s+/g, " ") === normalized,
      );
      specItems.push({
        key: keysWithSameValue.length > 1 ? "Informacje ogólne" : key,
        value,
      });
    }
  }

  return (
    <div className={cn("space-y-8", className)}>
      {shortDescription?.trim() && (
        <p className="text-lg leading-relaxed text-foreground/90">
          {shortDescription.trim().replace(/\n/g, " ")}
        </p>
      )}

      {specItems.length > 0 && (
        <section className="rounded-xl border border-border/60 bg-muted/30 overflow-hidden">
          <h2 className="border-b border-border/60 px-5 py-4 text-lg font-semibold">
            Specyfikacja
          </h2>
          <div className="divide-y divide-border/60">
            {specItems.map(({ key, value }, idx) => (
              <details
                key={`${key}-${idx}`}
                className="group [&_summary]:list-none [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 font-medium text-foreground/90 transition-colors hover:bg-muted/50">
                  <span>{key.replace(/\s*\*$/, "")}</span>
                  <span className="shrink-0 text-muted-foreground transition-transform duration-200 ease-out group-open:rotate-180">
                    <ChevronDownIcon />
                  </span>
                </summary>
                <div className="grid grid-template-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out group-open:grid-template-rows-[1fr]">
                  <div className="min-h-0 overflow-hidden">
                    <div className="border-t border-border/40 bg-background/50 px-5 py-4">
                      <p className="min-w-0 wrap-break-words text-sm leading-relaxed text-muted-foreground">
                        {value}
                      </p>
                    </div>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-4 text-lg font-semibold">Opis</h2>
        <div className="prose prose-sm max-w-none dark:prose-invert prose-p:text-muted-foreground prose-li:text-muted-foreground prose-h3:mt-6 prose-h3:text-base prose-h3:font-semibold prose-h3:text-foreground">
          {blocks.map((block, i) => (
            <div key={i}>{formatDescriptionBlock(block)}</div>
          ))}
        </div>
      </section>
    </div>
  );
}
