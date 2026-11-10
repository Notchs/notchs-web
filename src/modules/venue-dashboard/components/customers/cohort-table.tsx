import { content } from "../../content";
import type { CohortRow } from "../../types";
import { InfoTip } from "../ui/badges";
import { Card, SectionHead } from "../ui/card";
import { Table, TableWrap, Td, Th } from "../ui/table";

const MONTH_COLUMNS = [0, 1, 2];

/** Shared by Customers and the Retention tab of Analytics. */
export function CohortTable({ cohorts }: { cohorts: CohortRow[] }) {
  const copy = content.customers;
  return (
    <Card>
      <SectionHead title={copy.cohortTitle}>
        <InfoTip text={copy.cohortTip} />
      </SectionHead>
      <TableWrap>
        <Table className="min-w-90">
          <thead>
            <tr>
              {copy.cohortColumns.map((column) => (
                <Th key={column}>{column}</Th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cohorts.map((row) => (
              <tr key={row.month}>
                <Td>
                  <b>{row.month}</b>
                </Td>
                <Td className="font-mono">{row.guests}</Td>
                {MONTH_COLUMNS.map((month) => {
                  const value = row.retention[month];
                  return value == null ? (
                    <Td key={month} className="font-mono text-muted">
                      —
                    </Td>
                  ) : (
                    <Td key={month}>
                      <span
                        className={`inline-block min-w-13 rounded-md px-1.5 py-1 text-center font-mono ${value > 45 ? "text-paper" : "text-ink"}`}
                        style={{
                          background: `rgb(15 15 20 / ${((value / 100) * 0.85).toFixed(2)})`,
                        }}
                      >
                        {value}%
                      </span>
                    </Td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </Table>
      </TableWrap>
      <span className="text-[13px] text-muted">{copy.cohortNote}</span>
    </Card>
  );
}
