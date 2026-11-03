import type { ReactNode } from "react";

import { ErrorState, PageSkeleton } from "./states";

/** Standard loading and error handling around a screen's data. */
export function QueryBoundary<T>({
  query,
  skeleton,
  children,
}: {
  query: { data: T | undefined; error: unknown; refresh: () => void };
  skeleton?: ReactNode;
  children: (data: T) => ReactNode;
}) {
  if (query.error) return <ErrorState onRetry={query.refresh} />;
  if (query.data === undefined) return skeleton ?? <PageSkeleton />;
  return children(query.data);
}
