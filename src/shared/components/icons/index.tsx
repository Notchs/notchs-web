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

export function ArrowRightIcon(props: IconProps) {
  return (
    <OutlineIcon strokeWidth={2.25} strokeLinecap="round" {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </OutlineIcon>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <OutlineIcon strokeWidth={2} strokeLinecap="round" {...props}>
      <path d="M12 5v14M5 12h14" />
    </OutlineIcon>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <OutlineIcon strokeWidth={2} strokeLinecap="round" {...props}>
      <path d="M4 8h16M4 16h16" />
    </OutlineIcon>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <OutlineIcon strokeWidth={2} strokeLinecap="round" {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </OutlineIcon>
  );
}

export function SendIcon(props: IconProps) {
  return (
    <OutlineIcon strokeWidth={2} strokeLinecap="round" {...props}>
      <path d="M4 12l16-8-6 16-3-7z" />
    </OutlineIcon>
  );
}

export function ReplayIcon(props: IconProps) {
  return (
    <OutlineIcon strokeWidth={2} strokeLinecap="round" {...props}>
      <path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4" />
    </OutlineIcon>
  );
}

export function DashboardIcon(props: IconProps) {
  return (
    <OutlineIcon {...props}>
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
    </OutlineIcon>
  );
}

export function VenueIcon(props: IconProps) {
  return (
    <OutlineIcon strokeLinecap="round" {...props}>
      <path d="M4 9.5 5.5 4h13L20 9.5M4 9.5h16M4 9.5a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0M5.5 12v8h13v-8M10 20v-4.5h4V20" />
    </OutlineIcon>
  );
}

export function UsersIcon(props: IconProps) {
  return (
    <OutlineIcon strokeLinecap="round" {...props}>
      <circle cx="9" cy="8.5" r="3.5" />
      <path d="M3 19.5c.6-3.2 3-5 6-5s5.4 1.8 6 5M15.5 5.2a3.5 3.5 0 0 1 0 6.6M17.5 14.8c1.9.6 3.1 2.2 3.5 4.7" />
    </OutlineIcon>
  );
}

export function SettingsIcon(props: IconProps) {
  return (
    <OutlineIcon strokeLinecap="round" {...props}>
      <path d="M4 7h9M17 7h3M4 17h3M11 17h9" />
      <circle cx="15" cy="7" r="2" />
      <circle cx="9" cy="17" r="2" />
    </OutlineIcon>
  );
}

export function MoreIcon(props: IconProps) {
  return (
    <OutlineIcon stroke="none" fill="currentColor" {...props}>
      <circle cx="12" cy="5.5" r="1.75" />
      <circle cx="12" cy="12" r="1.75" />
      <circle cx="12" cy="18.5" r="1.75" />
    </OutlineIcon>
  );
}
