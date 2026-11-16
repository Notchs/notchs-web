"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { cities as allCities } from "../content";
import type { City } from "../types";

const STORAGE_KEY = "notchs-city";
const PARAM = "city";

type CityState = {
  city: City;
  cities: readonly City[];
  setCity: (slug: string) => void;
};

const CityContext = createContext<CityState | null>(null);

export function useCity() {
  const state = useContext(CityContext);
  if (!state) throw new Error("useCity must be used inside <CityProvider>.");
  return state;
}

const findCity = (cities: readonly City[], slug: string | null) =>
  slug ? cities.find((city) => city.slug === slug) : undefined;

function readStored() {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

/**
 * Holds the chosen city for the page. It starts on the first live city (so
 * the server and the first paint agree), then switches to `?city=` or the
 * visitor's last choice. Picking a city remembers it and puts it in the URL,
 * so the link can be shared.
 */
export function CityProvider({
  children,
  cities = allCities,
}: {
  children: ReactNode;
  cities?: readonly City[];
}) {
  const fallback = cities.find((city) => city.status === "active") ?? cities[0];
  const [slug, setSlug] = useState(fallback.slug);

  useEffect(() => {
    const fromUrl = new URL(window.location.href).searchParams.get(PARAM);
    const saved = findCity(cities, fromUrl) ?? findCity(cities, readStored());
    // Reading the address bar and storage once, after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved) setSlug(saved.slug);
  }, [cities]);

  const setCity = useCallback(
    (next: string) => {
      if (!findCity(cities, next)) return;
      setSlug(next);
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // Private mode or blocked storage: the choice lasts for this visit.
      }
      const url = new URL(window.location.href);
      url.searchParams.set(PARAM, next);
      window.history.replaceState(window.history.state, "", url);
    },
    [cities],
  );

  const value = useMemo(
    () => ({ city: findCity(cities, slug) ?? fallback, cities, setCity }),
    [cities, slug, fallback, setCity],
  );

  return <CityContext value={value}>{children}</CityContext>;
}
