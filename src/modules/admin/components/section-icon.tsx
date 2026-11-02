import type { ComponentProps, ComponentType } from "react";

import { NotchGlyph } from "@/shared/components/brand/notch-glyph";
import {
  DashboardIcon,
  SettingsIcon,
  UsersIcon,
  VenueIcon,
} from "@/shared/components/icons";

import type { AdminSectionKey } from "../content";

const icons: Record<AdminSectionKey, ComponentType<ComponentProps<"svg">>> = {
  dashboard: DashboardIcon,
  venues: VenueIcon,
  customers: UsersIcon,
  notchs: NotchGlyph,
  settings: SettingsIcon,
};

/** The sidebar icon for an admin section. */
export function SectionIcon({
  section,
  ...props
}: ComponentProps<"svg"> & { section: AdminSectionKey }) {
  const Icon = icons[section];
  return <Icon {...props} />;
}
