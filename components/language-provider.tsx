"use client";

import {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
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

const languageEvent = "portfolio-language-change";
let memoryPreference: Language | undefined;

function browserLanguage(): Language {
  if (memoryPreference) return memoryPreference;
  try {
    const saved = localStorage.getItem("portfolio-language");
    if (saved === "fr" || saved === "en") return saved;
  } catch {
    /* Storage can be disabled. */
  }
  return (navigator.languages?.[0] ?? navigator.language ?? "en")
    .toLowerCase()
    .startsWith("fr")
    ? "fr"
    : "en";
}
function subscribeLanguage(notify: () => void) {
  window.addEventListener(languageEvent, notify);
  window.addEventListener("storage", notify);
  window.addEventListener("languagechange", notify);
  return () => {
    window.removeEventListener(languageEvent, notify);
    window.removeEventListener("storage", notify);
    window.removeEventListener("languagechange", notify);
  };
}
const serverLanguage = (): Language => "en";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const language = useSyncExternalStore(
    subscribeLanguage,
    browserLanguage,
    serverLanguage,
  );
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
  function setLanguage(value: Language) {
    try {
      localStorage.setItem("portfolio-language", value);
      memoryPreference = undefined;
    } catch {
      memoryPreference = value;
    }
    window.dispatchEvent(new Event(languageEvent));
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
          aria-label={value === "fr" ? "FR (Français)" : "EN (English)"}
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
