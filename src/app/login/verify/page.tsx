import { VerifyLogin, verifyMetadata } from "@/modules/auth";

export const metadata = verifyMetadata;

export default function LoginVerify() {
  return <VerifyLogin />;
}
