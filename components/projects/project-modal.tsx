"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { X, ExternalLink } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

export function ProjectModal({
  title,
  href,
  children,
}: {
  title: string;
  href: string;
  children: ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const headingId = useId();
  const router = useRouter();
  const { t } = useLanguage();
  useEffect(() => {
    const element = dialog.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const previousScroll = { left: window.scrollX, top: window.scrollY };
    element?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      element?.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected)
        previousFocus.focus({ preventScroll: true });
      window.scrollTo({ ...previousScroll, behavior: "instant" });
    };
  }, []);
  const close = () => router.back();
  return (
    <dialog
      ref={dialog}
      aria-labelledby={headingId}
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
      className="fixed inset-0 m-auto max-h-[92dvh] w-[min(96vw,1200px)] max-w-none overflow-auto rounded-xl border border-border bg-card p-0 text-foreground shadow-2xl backdrop:bg-black/80"
    >
      <div className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-border bg-card/95 p-4 backdrop-blur-md">
        <h2 id={headingId} className="min-w-0 text-sm font-semibold">
          {t("Project details")}: {t(title)}
        </h2>
        <div className="flex shrink-0 items-center gap-2">
          {/* A document navigation intentionally opens the canonical full page. */}
          <a
            href={href}
            aria-label={t("Open full page")}
            className="rounded-md border border-border p-2 hover:bg-muted"
          >
            <ExternalLink className="h-5 w-5" aria-hidden="true" />
          </a>
          <button
            type="button"
            onClick={close}
            aria-label={t("Close project details")}
            className="rounded-md border border-border p-2 hover:bg-muted"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="p-4 sm:p-8">{children}</div>
    </dialog>
  );
}
