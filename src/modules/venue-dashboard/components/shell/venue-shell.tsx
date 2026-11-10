"use client";

import { useState, type ReactNode } from "react";

import { DateRangeProvider } from "../../hooks/use-date-range";
import { SessionProvider } from "../../hooks/use-session";
import { ToastProvider } from "../../hooks/use-toast";
import { VenueDraftProvider } from "../../hooks/use-venue-draft";
import { jetbrainsMono } from "../../fonts";
import { NavigationDrawerContext } from "./navigation-drawer";
import { VenueSidebar } from "./venue-sidebar";

/** Frame of every dashboard page. Always the Paper theme, as designed. */
export function VenueShell({ children }: { children: ReactNode }) {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div
      className={`${jetbrainsMono.variable} row-span-full grid h-svh grid-cols-1 overflow-hidden bg-background tone-paper text-foreground sm:grid-cols-[68px_minmax(0,1fr)] wide:grid-cols-[248px_minmax(0,1fr)]`}
    >
      <ToastProvider>
        <SessionProvider>
          <DateRangeProvider>
            <VenueDraftProvider>
              <NavigationDrawerContext.Provider value={setNavOpen}>
                <VenueSidebar
                  open={navOpen}
                  onClose={() => setNavOpen(false)}
                />
                {navOpen && (
                  <div
                    aria-hidden="true"
                    onClick={() => setNavOpen(false)}
                    className="fixed inset-0 z-30 bg-ink/45 sm:hidden"
                  />
                )}
                {children}
              </NavigationDrawerContext.Provider>
            </VenueDraftProvider>
          </DateRangeProvider>
        </SessionProvider>
      </ToastProvider>
    </div>
  );
}
