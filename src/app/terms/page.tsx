import { LegalPage, termsContent, termsMetadata } from "@/modules/legal";

export const metadata = termsMetadata;

export default function TermsPage() {
  return <LegalPage content={termsContent} />;
}
