import { PassportShell } from "@/modules/passport";

export default function PassportLayout({ children }: LayoutProps<"/passport">) {
  return <PassportShell>{children}</PassportShell>;
}
