import { Suspense } from "react";

import { venueRoutes } from "@/config/routes";
import { PairDisplay, displayMetadata } from "@/modules/counter-display";

export const metadata = displayMetadata;

export default function PairDisplayPage() {
  return (
    <Suspense>
      <PairDisplay screenHref={venueRoutes.display} />
    </Suspense>
  );
}
