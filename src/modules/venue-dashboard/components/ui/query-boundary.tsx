import type { ReactNode } from "react";

import { content } from "../../content";
import { NotLiveError } from "../../services/not-live";
import { Badge } from "./badges";
import { ErrorState, PageSkeleton, UnavailableBox } from "./states";

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
  if (query.error instanceof NotLiveError) {
    return (
      <UnavailableBox
        badge={<Badge tone="soft">{content.common.notLiveBadge}</Badge>}
        title={content.common.notLiveTitle}
        body={content.common.notLiveBody}
      />
    );
  }
  if (query.error) return <ErrorState onRetry={query.refresh} />;
  if (query.data === undefined) return skeleton ?? <PageSkeleton />;
  return children(query.data);
}
