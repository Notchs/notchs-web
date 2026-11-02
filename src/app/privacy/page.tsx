import { LegalPage, privacyContent, privacyMetadata } from "@/modules/legal";

export const metadata = privacyMetadata;

export default function PrivacyPage() {
  return <LegalPage content={privacyContent} />;
}
