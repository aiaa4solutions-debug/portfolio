"use client";

import { useLanguage } from "@/components/language-provider";
import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

const subscribeHydration = () => () => {};
const clientMounted = () => true;
const serverMounted = () => false;

export function ThemeToggle() {
  const { t } = useLanguage();
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = React.useSyncExternalStore(
    subscribeHydration,
    clientMounted,
    serverMounted,
  );

  if (!mounted) {
    return <div className="h-10 w-10" aria-hidden="true" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={t(isDark ? "Switch to light mode" : "Switch to dark mode")}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
