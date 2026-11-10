"use client";

import { useMemo, useState } from "react";

export type SortState<K extends string> = { key: K; ascending: boolean };

/** Pages through rows; the page stays valid when the rows shrink. */
export function usePagedRows<T>(rows: T[], pageSize: number) {
  const [requestedPage, setPage] = useState(0);
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const page = Math.min(requestedPage, pageCount - 1);
  const pageRows = useMemo(
    () => rows.slice(page * pageSize, page * pageSize + pageSize),
    [rows, page, pageSize],
  );
  return { page, pageCount, pageRows, setPage };
}

/** Clicking the sorted column flips it; a new column starts descending. */
export function useSort<K extends string>(initial: SortState<K>) {
  const [sort, setSort] = useState(initial);
  const toggle = (key: K) =>
    setSort((current) =>
      current.key === key
        ? { key, ascending: !current.ascending }
        : { key, ascending: false },
    );
  return { sort, toggle };
}
