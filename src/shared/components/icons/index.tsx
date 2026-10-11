import type { ComponentProps } from "react";

type IconProps = ComponentProps<"svg">;

/** Shared attributes for the outlined 24 x 24 icon set. */
function OutlineIcon({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <OutlineIcon strokeWidth={2.25} strokeLinecap="round" {...props}>
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </OutlineIcon>
  );
}

export function ThemeIcon(props: IconProps) {
  return (
    <OutlineIcon {...props}>
      <circle cx="12" cy="12" r="8.25" />
      <path
        d="M12 3.75a8.25 8.25 0 0 1 0 16.5Z"
        fill="currentColor"
        stroke="none"
      />
    </OutlineIcon>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <OutlineIcon {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.25" cy="6.75" r=".9" fill="currentColor" stroke="none" />
    </OutlineIcon>
  );
}

export function YouTubeIcon(props: IconProps) {
  return (
    <OutlineIcon {...props}>
      <rect x="2" y="5" width="20" height="14" rx="4" />
      <path d="M10 9l5 3-5 3z" fill="currentColor" />
    </OutlineIcon>
  );
}

export function LinkedInIcon(props: IconProps) {
  return (
    <OutlineIcon strokeLinecap="round" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 10.5V16.5" />
      <circle cx="8" cy="7.6" r=".9" fill="currentColor" stroke="none" />
      <path d="M11.5 16.5v-6M11.5 13a2.5 2.5 0 0 1 5 0v3.5" />
    </OutlineIcon>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <OutlineIcon {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="M3.5 6.5l8.5 6.5 8.5-6.5" />
    </OutlineIcon>
  );
}
