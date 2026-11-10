"use client";

import { useSyncExternalStore } from "react";

import { content } from "../../content";
import {
  getScenario,
  scenariosFor,
  setScenario,
  type ScenarioPage,
} from "../../mock/scenario";
import {
  getDataVersion,
  subscribeDataVersion,
} from "../../services/data-version";
import { Icon } from "../ui/icon";
import { MenuPopover, menuItemStyles } from "./menu-popover";

/**
 * Labels the page as example data and, for reviewers, switches it between
 * its states. Only rendered in mock mode, so it leaves with the mock data.
 */
export function PreviewStateMenu({ page }: { page: ScenarioPage }) {
  useSyncExternalStore(subscribeDataVersion, getDataVersion, getDataVersion);
  const current = getScenario(page);

  return (
    <MenuPopover
      trigger={({ open, toggle }) => (
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label={content.shell.previewLabel(current)}
          onClick={toggle}
          className="flex h-8 cursor-pointer items-center gap-1.5 rounded-md px-2 font-mono text-[10px] tracking-[.08em] text-muted uppercase shadow-[inset_0_0_0_1px_rgb(15_15_20/0.16)] hover:bg-ink/5"
        >
          {content.common.example}
          <span className="hidden max-w-28 truncate sm:inline">
            · {current}
          </span>
          <Icon name="chevD" size={12} />
        </button>
      )}
    >
      {(close) => (
        <>
          <span className="px-2.5 pt-2 pb-1 text-[11px] font-semibold tracking-[.08em] text-muted uppercase">
            {content.shell.previewTitle}
          </span>
          {scenariosFor(page).map((scenario) => (
            <button
              key={scenario}
              type="button"
              role="menuitemradio"
              aria-checked={scenario === current}
              onClick={() => {
                setScenario(page, scenario);
                close();
              }}
              className={menuItemStyles}
            >
              {scenario}
              {scenario === current && (
                <Icon name="check" size={16} className="ml-auto" />
              )}
            </button>
          ))}
        </>
      )}
    </MenuPopover>
  );
}
