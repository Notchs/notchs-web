"use client";

import { useEffect, useSyncExternalStore } from "react";

import { siteConfig } from "@/config/site";
import { ThemeIcon } from "@/shared/components/icons";
import { cn } from "@/shared/lib/cn";
import {
  THEME_ATTRIBUTE,
  THEME_CHANGE_EVENT,
  THEME_STORAGE_KEY,
  type Theme,
} from "@/shared/lib/theme";

const LIGHT_QUERY = "(prefers-color-scheme: light)";

function getChosenTheme(): Theme | null {
  const value = document.documentElement.getAttribute(THEME_ATTRIBUTE);
  return value === "light" || value === "dark" ? value : null;
}

function getTheme(): Theme {
  return (
    getChosenTheme() ??
    (window.matchMedia(LIGHT_QUERY).matches ? "light" : "dark")
  );
}

function getServerTheme(): Theme {
  return "dark";
}

function subscribe(onChange: () => void) {
  const media = window.matchMedia(LIGHT_QUERY);
  media.addEventListener("change", onChange);
  window.addEventListener(THEME_CHANGE_EVENT, onChange);
  return () => {
    media.removeEventListener("change", onChange);
    window.removeEventListener(THEME_CHANGE_EVENT, onChange);
  };
}

/** Keeps the browser chrome colour in step with a theme the user chose. */
function syncThemeColor(theme: Theme) {
  document
    .querySelectorAll('meta[name="theme-color"]')
    .forEach((meta) =>
      meta.setAttribute("content", siteConfig.themeColors[theme]),
    );
}

function chooseTheme(theme: Theme) {
  document.documentElement.setAttribute(THEME_ATTRIBUTE, theme);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage can be blocked; the choice still applies for this visit.
  }
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, getTheme, getServerTheme);
  const nextTheme: Theme = theme === "dark" ? "light" : "dark";

  useEffect(() => {
    const chosen = getChosenTheme();
    if (chosen) syncThemeColor(chosen);
  }, [theme]);

  return (
    <button
      type="button"
      aria-label={`Switch to ${nextTheme} theme`}
      onClick={() => chooseTheme(nextTheme)}
      className={cn(
        "relative inline-grid size-11 cursor-pointer place-items-center rounded-full",
        className,
      )}
    >
      <ThemeIcon className="size-4.5" />
    </button>
  );
}
