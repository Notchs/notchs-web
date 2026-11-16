"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

import {
  CheckIcon,
  ChevronDownIcon,
  MapPinIcon,
  SearchIcon,
} from "@/shared/components/icons";
import { cn } from "@/shared/lib/cn";

import { cityContent, requestCityHref } from "../content";
import type { City, CityStatus } from "../types";
import { useCity } from "./city-provider";

const groupOrder: CityStatus[] = ["active", "coming-soon", "not-yet"];

const normalise = (text: string) => text.trim().toLowerCase();

type CitySelectorProps = {
  className?: string;
  /** Where the list opens, relative to the button. */
  align?: "start" | "end";
};

/**
 * Searchable city picker: a button with the current city that opens a list
 * grouped by status. Arrow keys move, Enter picks, Escape closes. A search
 * with no match offers to ask for Notchs in that city.
 */
export function CitySelector({ className, align = "end" }: CitySelectorProps) {
  const { city, cities, setCity } = useCity();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();
  const listId = `${id}-list`;

  const matches = useMemo(() => {
    const q = normalise(query);
    const found = cities.filter(
      (c) =>
        !q || normalise(c.name).includes(q) || normalise(c.state).includes(q),
    );
    // Group order, so arrow keys follow what's on screen.
    return groupOrder.flatMap((status) =>
      found.filter((c) => c.status === status),
    );
  }, [cities, query]);

  function close(focusButton = true) {
    setOpen(false);
    setQuery("");
    if (focusButton) buttonRef.current?.focus();
  }

  function pick(next: City) {
    setCity(next.slug);
    close();
  }

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onPointer = (event: PointerEvent) => {
      if (rootRef.current?.contains(event.target as Node)) return;
      setOpen(false);
      setQuery("");
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open]);

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
    } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (matches.length === 0) return;
      const step = event.key === "ArrowDown" ? 1 : -1;
      setActive((i) => (i + step + matches.length) % matches.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      const target = matches[active];
      if (target) pick(target);
    }
  }

  const optionId = (slug: string) => `${id}-${slug}`;
  const trimmed = query.trim();

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`${cityContent.trigger}: ${city.name}`}
        onClick={() => (open ? close() : setOpen(true))}
        className="relative inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full px-3 text-[.9375rem] font-medium transition-colors duration-150 hover:text-foreground"
      >
        <MapPinIcon className="size-4.5" />
        {city.name}
        <ChevronDownIcon
          className={cn(
            "size-4 text-muted transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={cityContent.trigger}
          className={cn(
            "absolute top-full z-50 mt-2 w-72 animate-pop rounded-[20px] glass p-2 text-foreground",
            align === "end" ? "right-0" : "left-0",
          )}
        >
          <label className="flex h-11 items-center gap-2 rounded-[14px] border border-line bg-card px-3 focus-within:border-foreground">
            <SearchIcon className="size-4.5 flex-none text-muted" />
            <span className="sr-only">{cityContent.search}</span>
            <input
              ref={inputRef}
              role="combobox"
              aria-expanded="true"
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={
                matches[active] ? optionId(matches[active].slug) : undefined
              }
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActive(0);
              }}
              onKeyDown={onKeyDown}
              placeholder={cityContent.search}
              className="min-w-0 flex-1 bg-transparent text-base placeholder:text-muted focus:outline-none"
            />
          </label>

          <ul
            id={listId}
            role="listbox"
            aria-label={cityContent.trigger}
            className="mt-2 max-h-72 overflow-y-auto"
          >
            {groupOrder.map((status) => {
              const group = matches.filter((c) => c.status === status);
              if (group.length === 0) return null;
              return (
                <li key={status} role="presentation">
                  <span className="block px-3 pt-2 pb-1 text-xs font-semibold tracking-[.08em] text-muted uppercase">
                    {cityContent.groups[status]}
                  </span>
                  <ul role="group" aria-label={cityContent.groups[status]}>
                    {group.map((option) => {
                      const index = matches.indexOf(option);
                      const selected = option.slug === city.slug;
                      return (
                        <li
                          key={option.slug}
                          id={optionId(option.slug)}
                          role="option"
                          aria-selected={selected}
                          onPointerMove={() => setActive(index)}
                          onClick={() => pick(option)}
                          className={cn(
                            "flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-[12px] px-3",
                            index === active && "bg-foreground/8",
                          )}
                        >
                          <span className="flex flex-col">
                            <span className="font-medium">{option.name}</span>
                            <span className="text-xs text-muted">
                              {option.state}
                            </span>
                          </span>
                          {selected && <CheckIcon className="size-4.5" />}
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
          </ul>

          {matches.length === 0 && trimmed && (
            <div className="flex flex-col gap-2 px-3 py-3 text-[.9375rem]">
              <p className="text-muted">{cityContent.noMatch(trimmed)}</p>
              <a
                href={requestCityHref(trimmed)}
                className="font-semibold underline underline-offset-[3px]"
              >
                {cityContent.askFor(trimmed)}
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
