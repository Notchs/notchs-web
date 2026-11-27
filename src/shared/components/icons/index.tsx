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

/** A coffee cup: a café on the map. */
export function CupIcon(props: IconProps) {
  return (
    <OutlineIcon strokeWidth={2} strokeLinecap="round" {...props}>
      <path d="M4 9h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM16 11h1.5a2.5 2.5 0 0 1 0 5H16M8 3.5v2M12 3.5v2" />
    </OutlineIcon>
  );
}

export function MinusIcon(props: IconProps) {
  return (
    <OutlineIcon strokeWidth={2} strokeLinecap="round" {...props}>
      <path d="M5 12h14" />
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

export function SearchIcon(props: IconProps) {
  return (
    <OutlineIcon strokeLinecap="round" {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4.4-4.4" />
    </OutlineIcon>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <OutlineIcon strokeWidth={2} strokeLinecap="round" {...props}>
      <path d="m6 9 6 6 6-6" />
    </OutlineIcon>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <OutlineIcon strokeWidth={2.25} strokeLinecap="round" {...props}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </OutlineIcon>
  );
}

export function HomeIcon(props: IconProps) {
  return (
    <OutlineIcon strokeLinecap="round" {...props}>
      <path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5.5h-5V20H5a1 1 0 0 1-1-1z" />
    </OutlineIcon>
  );
}

export function TrophyIcon(props: IconProps) {
  return (
    <OutlineIcon strokeLinecap="round" {...props}>
      <path d="M7.5 4h9v5a4.5 4.5 0 0 1-9 0zM7.5 6H4.5a3 3 0 0 0 3 4.5M16.5 6h3a3 3 0 0 1-3 4.5M12 13.5V17M8.5 20h7M9.5 17h5v3h-5z" />
    </OutlineIcon>
  );
}

export function BellIcon(props: IconProps) {
  return (
    <OutlineIcon strokeLinecap="round" {...props}>
      <path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15zM10 21h4" />
    </OutlineIcon>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <OutlineIcon strokeLinecap="round" {...props}>
      <circle cx="12" cy="8.5" r="3.75" />
      <path d="M4.5 20c.8-3.6 3.8-5.75 7.5-5.75s6.7 2.15 7.5 5.75" />
    </OutlineIcon>
  );
}

export function ChartIcon(props: IconProps) {
  return (
    <OutlineIcon strokeLinecap="round" {...props}>
      <path d="M4 20h16M7 16v-4M12 16V8M17 16V5" />
    </OutlineIcon>
  );
}

export function BadgeIcon(props: IconProps) {
  return (
    <OutlineIcon strokeLinecap="round" {...props}>
      <circle cx="12" cy="9" r="5" />
      <path d="m8.5 12.5-1.5 7.5 5-2.5 5 2.5-1.5-7.5" />
    </OutlineIcon>
  );
}

export function CardIcon(props: IconProps) {
  return (
    <OutlineIcon strokeLinecap="round" {...props}>
      <rect x="6" y="3" width="12" height="18" rx="2.5" />
      <path d="M9 15h6M9 18h3" />
    </OutlineIcon>
  );
}

export function ScanIcon(props: IconProps) {
  return (
    <OutlineIcon strokeLinecap="round" {...props}>
      <path d="M4 8.5V6a2 2 0 0 1 2-2h2.5M15.5 4H18a2 2 0 0 1 2 2v2.5M20 15.5V18a2 2 0 0 1-2 2h-2.5M8.5 20H6a2 2 0 0 1-2-2v-2.5M7.5 12h9" />
    </OutlineIcon>
  );
}

export function ChatIcon(props: IconProps) {
  return (
    <OutlineIcon strokeLinecap="round" {...props}>
      <path d="M12 4a8 8 0 0 0-6.9 12.05L4 20l4.05-1.07A8 8 0 1 0 12 4z" />
      <path d="M9 11h6M9 14h3.5" />
    </OutlineIcon>
  );
}

export function StarIcon(props: IconProps) {
  return (
    <OutlineIcon strokeLinecap="round" {...props}>
      <path d="m12 3.5 2.6 5.3 5.9.85-4.25 4.15 1 5.85L12 16.9l-5.25 2.75 1-5.85L3.5 9.65l5.9-.85z" />
    </OutlineIcon>
  );
}
