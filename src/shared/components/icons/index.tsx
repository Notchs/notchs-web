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

export function EyeIcon(props: IconProps) {
  return (
    <OutlineIcon {...props}>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </OutlineIcon>
  );
}

export function EyeOffIcon(props: IconProps) {
  return (
    <OutlineIcon strokeLinecap="round" {...props}>
      <path d="M9.9 5.75A9.6 9.6 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-2.6 3.4M6.6 6.6C3.9 8.3 2.5 12 2.5 12S6 18.5 12 18.5a9.3 9.3 0 0 0 5.4-1.6M9.9 9.9a3 3 0 0 0 4.2 4.2M3.5 3.5l17 17" />
    </OutlineIcon>
  );
}

export function MapPinIcon(props: IconProps) {
  return (
    <OutlineIcon {...props}>
      <path d="M12 21s-6.75-5.6-6.75-11.25a6.75 6.75 0 0 1 13.5 0C18.75 15.4 12 21 12 21Z" />
      <circle cx="12" cy="9.75" r="2.5" />
    </OutlineIcon>
  );
}

export function GiftIcon(props: IconProps) {
  return (
    <OutlineIcon strokeLinecap="round" {...props}>
      <rect x="3.5" y="8" width="17" height="4" rx="1" />
      <path d="M5 12v8h14v-8M12 8v12M12 8S10.5 3.5 8 4.25 8.5 8 12 8ZM12 8s1.5-4.5 4-3.75S15.5 8 12 8Z" />
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

export function MoreIcon(props: IconProps) {
  return (
    <OutlineIcon stroke="none" fill="currentColor" {...props}>
      <circle cx="12" cy="5.5" r="1.75" />
      <circle cx="12" cy="12" r="1.75" />
      <circle cx="12" cy="18.5" r="1.75" />
    </OutlineIcon>
  );
}
