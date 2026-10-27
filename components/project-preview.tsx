"use client";

import Image from "next/image";
import { useRef } from "react";
import { X, ZoomIn } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

export function ProjectPreview({
  src,
  title,
  description,
}: {
  src: string;
  title: string;
  description: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const { t } = useLanguage();
  return (
    <figure className="mb-5">
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        aria-label={`${t("Enlarge preview")}: ${t(title)}`}
        className="group/preview relative block w-full overflow-hidden rounded-md border border-border bg-slate-950 text-left"
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
          <ZoomIn className="h-3.5 w-3.5" aria-hidden="true" />
          {t("Enlarge preview")}
        </span>
      </button>
      <figcaption className="mt-2 font-mono text-[11px] text-muted-foreground">
        {t("Concept preview · Fictional data")}
      </figcaption>
      <dialog
        ref={dialog}
        aria-label={`${t("Demo preview")}: ${t(title)}`}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
        className="fixed inset-0 m-auto max-h-[90dvh] w-[min(96vw,1200px)] max-w-none overflow-auto rounded-xl border border-border bg-card p-0 text-foreground shadow-2xl backdrop:bg-black/80"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-border bg-card p-4">
          <div>
            <h4 className="font-semibold">{t(title)}</h4>
            <p className="mt-1 text-xs text-muted-foreground">
              {t("Concept preview · Fictional data")}
            </p>
          </div>
          <button
            type="button"
            autoFocus
            onClick={() => dialog.current?.close()}
            aria-label={t("Close preview")}
            className="shrink-0 rounded-md border border-border p-2 hover:bg-muted"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <Image
          src={src}
          alt={t(description)}
          width={1536}
          height={1024}
          sizes="96vw"
          className="h-auto w-full"
        />
      </dialog>
    </figure>
  );
}
