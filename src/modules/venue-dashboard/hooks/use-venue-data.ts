"use client";

import { useCallback } from "react";

import { venueData } from "../services/venue-data.service";
import { useDateRange } from "./use-date-range";
import { useVenueQuery } from "./use-venue-query";

/** One hook per screen: pages never touch the service directly. */
export function useOverview() {
  const { range } = useDateRange();
  return useVenueQuery(
    useCallback(() => venueData.getOverview(range), [range]),
  );
}

export function useCustomers() {
  const { range } = useDateRange();
  return useVenueQuery(
    useCallback(() => venueData.getCustomers(range), [range]),
  );
}

export function useVisits() {
  const { range } = useDateRange();
  return useVenueQuery(useCallback(() => venueData.getVisits(range), [range]));
}

export const useNotchCard = () => useVenueQuery(venueData.getNotchCard);
export const useFoundingVenue = () => useVenueQuery(venueData.getFoundingVenue);

export function useAnalytics() {
  const { range } = useDateRange();
  return useVenueQuery(
    useCallback(() => venueData.getAnalytics(range), [range]),
  );
}

export const useRevenue = () => useVenueQuery(venueData.getRevenue);
export const useReviews = () => useVenueQuery(venueData.getReviews);

export function useDiscover() {
  const { range } = useDateRange();
  return useVenueQuery(
    useCallback(() => venueData.getDiscover(range), [range]),
  );
}

export const useRewards = () => useVenueQuery(venueData.getRewards);
export const useCounter = () => useVenueQuery(venueData.getCounter);
export const useTeam = () => useVenueQuery(venueData.getTeam);
export const useBilling = () => useVenueQuery(venueData.getBilling);
export const useSettings = () => useVenueQuery(venueData.getSettings);
