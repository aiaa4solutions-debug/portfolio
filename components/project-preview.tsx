"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

export function ProjectPreview({
  src,
  title,
  description,
  href,
}: {
  src: string;
  title: string;
  description: string;
  href: string;
}) {
  const { t } = useLanguage();
  return (
    <figure className="mb-5">
      <Link
        href={href}
        scroll={false}
        aria-label={`${t("View project details")}: ${t(title)}`}
        className="group/preview relative block w-full overflow-hidden rounded-md border border-border bg-slate-950"
      >
        <Image
          src={src}
          alt={t(description)}
          width={1536}
          height={1024}
          sizes="(min-width: 1280px) 568px, (min-width: 768px) 45vw, 90vw"
          className="aspect-[3/2] w-full object-cover transition-transform duration-300 group-hover/preview:scale-[1.025] motion-reduce:transition-none"
        />
        <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full border border-white/20 bg-slate-950/85 px-3 py-1.5 text-xs text-white backdrop-blur-sm">
          {t("View project details")}
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      </Link>
      <figcaption className="mt-2 font-mono text-[11px] text-muted-foreground">
        {t("Concept preview · Fictional data")}
      </figcaption>
    </figure>
  );
}
