"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import french from "@/lib/i18n/fr.json";

export type Language = "en" | "fr";
const LanguageContext = createContext({
  language: "en" as Language,
  setLanguage: (_: Language) => {},
  t: (text: string) => text,
});
const translations: Record<string, string> = french;

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, updateLanguage] = useState<Language>("en");
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem("portfolio-language");
    } catch {
      /* Storage can be disabled. */
    }
    const detected = (navigator.languages?.[0] ?? navigator.language ?? "en")
      .toLowerCase()
      .startsWith("fr")
      ? "fr"
      : "en";
    updateLanguage(saved === "fr" || saved === "en" ? saved : detected);
  }, []);
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
  function setLanguage(value: Language) {
    updateLanguage(value);
    try {
      localStorage.setItem("portfolio-language", value);
    } catch {
      /* Keep the in-memory preference. */
    }
  }
  const t = (text: string) =>
    language === "fr" ? (translations[text] ?? text) : text;
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
export function useLanguage() {
  return useContext(LanguageContext);
}
export function Translated({ text }: { text: string }) {
  const { t } = useLanguage();
  return <>{t(text)}</>;
}
export function LanguageSwitch() {
  const { language, setLanguage, t } = useLanguage();
  return (
    <div
      role="group"
      aria-label={t("Language")}
      className="flex shrink-0 rounded-md border border-border bg-card/80 p-0.5"
    >
      {(["en", "fr"] as const).map((value) => (
        <button
          key={value}
          type="button"
          lang={value}
          aria-label={value === "fr" ? "Français" : "English"}
          aria-pressed={language === value}
          onClick={() => setLanguage(value)}
          className={`rounded px-2 py-1.5 text-xs font-semibold transition-colors ${language === value ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          {value.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
