import type { ComponentProps, ReactNode } from "react";

import { CloseIcon } from "@/shared/components/icons";

type IconProps = ComponentProps<"svg">;

function Icon({ children, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

/** Icons for the benefit and "All you need" cards, by the name in content.ts. */
export const venueIcons = {
  close: CloseIcon,
  crown: (props: IconProps) => (
    <Icon {...props}>
      <path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z" />
    </Icon>
  ),
  clock: (props: IconProps) => (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </Icon>
  ),
  search: (props: IconProps) => (
    <Icon {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.8-3.8" />
    </Icon>
  ),
  phone: (props: IconProps) => (
    <Icon {...props}>
      <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
      <path d="M11 18h2" />
    </Icon>
  ),
  counter: (props: IconProps) => (
    <Icon {...props}>
      <path d="M3 20h18M6 20V10h12v10M9 10l3-6 3 6" />
    </Icon>
  ),
  timer: (props: IconProps) => (
    <Icon {...props}>
      <circle cx="12" cy="14" r="7.5" />
      <path d="M9.5 2.5h5M12 10v4l2.5 1.5" />
    </Icon>
  ),
};

export function HeartIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 20s-8-4.9-8-10.7A4.6 4.6 0 0 1 12 6.6a4.6 4.6 0 0 1 8 2.7C20 15.1 12 20 12 20z" />
    </Icon>
  );
}
