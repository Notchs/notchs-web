"use client";

import { createContext } from "react";

/** Lets the top bar's menu button open the phone navigation. */
export const NavigationDrawerContext = createContext<
  ((open: boolean) => void) | null
>(null);
