import { siteConfig } from "@/config/site";
import {
  InstagramIcon,
  LinkedInIcon,
  MailIcon,
  YouTubeIcon,
} from "@/shared/components/icons";
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
      <ul className="-ml-2.5 flex flex-wrap gap-x-1">
        {footerLinks.map(({ label, href, Icon, alwaysLabelled }) => {
          const external = href.startsWith("http");
          return (
            <li key={href}>
              <a
                href={href}
                aria-label={label}
                {...(external && { target: "_blank", rel: "noopener" })}
                className="inline-flex min-h-12 items-center gap-2.5 px-2.5 text-sm font-medium text-muted transition-colors duration-150 hover:text-foreground"
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
      <span className="text-[.8125rem] text-muted">
        © {siteConfig.copyrightYear} {siteConfig.name}™
      </span>
    </footer>
  );
}
