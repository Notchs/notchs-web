import Link from "next/link";

import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import {
  InstagramIcon,
  LinkedInIcon,
  MailIcon,
  YouTubeIcon,
} from "@/shared/components/icons";
import { GlassGroup } from "@/shared/components/glass/glass-group";
import {
  GlassLensTrack,
  LENS_ITEM,
} from "@/shared/components/glass/glass-lens-track";
import { cn } from "@/shared/lib/cn";

const footerLinks = [
  {
    label: "Instagram",
    href: siteConfig.social.instagram,
    Icon: InstagramIcon,
  },
  { label: "YouTube", href: siteConfig.social.youtube, Icon: YouTubeIcon },
  { label: "LinkedIn", href: siteConfig.social.linkedin, Icon: LinkedInIcon },
  {
    label: siteConfig.contactEmail,
    href: `mailto:${siteConfig.contactEmail}`,
    Icon: MailIcon,
    alwaysLabelled: true,
  },
];

export function SiteFooter() {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-line px-gutter py-5">
      {/* A glass lens follows the pointer along the links. */}
      <GlassGroup self={false}>
        <GlassLensTrack lensRadius={20} inset={2}>
          <ul className="-ml-2.5 flex flex-wrap gap-x-1">
            {footerLinks.map(({ label, href, Icon, alwaysLabelled }) => {
              const external = href.startsWith("http");
              return (
                <li key={href}>
                  <a
                    href={href}
                    aria-label={label}
                    {...(external && { target: "_blank", rel: "noopener" })}
                    className="relative inline-flex min-h-12 items-center gap-2.5 rounded-full px-2.5 text-sm font-medium text-muted transition-colors duration-150 hover:text-foreground"
                    {...LENS_ITEM}
                  >
                    <Icon className="size-4.5 flex-none" />
                    <span className={cn(!alwaysLabelled && "hidden sm:inline")}>
                      {label}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </GlassLensTrack>
      </GlassGroup>
      <span className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[.8125rem] text-muted">
        <Link
          href={routes.privacy}
          className="inline-flex min-h-12 items-center underline-offset-4 hover:text-foreground hover:underline"
        >
          Privacy
        </Link>
        <Link
          href={routes.terms}
          className="inline-flex min-h-12 items-center underline-offset-4 hover:text-foreground hover:underline"
        >
          Terms
        </Link>
        <span>
          © {siteConfig.copyrightYear} {siteConfig.name}™
        </span>
      </span>
    </footer>
  );
}
