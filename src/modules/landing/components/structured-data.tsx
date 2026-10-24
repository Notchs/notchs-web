import { siteConfig } from "@/config/site";

const organizationId = `${siteConfig.url}/#organization`;

/**
 * schema.org data that tells search engines what Notchs is: the company, its
 * logo and its official profiles, and the website it publishes. Helps Google
 * tell the brand apart from others with similar names.
 */
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": organizationId,
      name: siteConfig.name,
      url: siteConfig.url,
      logo: new URL("/icon-512.png", siteConfig.url).toString(),
      email: siteConfig.contactEmail,
      sameAs: Object.values(siteConfig.social),
    },
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      name: siteConfig.name,
      url: siteConfig.url,
      inLanguage: "en-IN",
      publisher: { "@id": organizationId },
    },
  ],
};

/** Static data from siteConfig only; "<" is escaped so it can't end the tag. */
export function StructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
      }}
    />
  );
}
