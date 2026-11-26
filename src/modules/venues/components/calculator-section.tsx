import { SectionHeading } from "@/modules/landing";

import { calculatorContent } from "../content";
import { FeeCalculator } from "./fee-calculator";

export function CalculatorSection() {
  return (
    <>
      <SectionHeading
        kicker={calculatorContent.kicker}
        title={calculatorContent.title}
        description={calculatorContent.description}
        className="mb-10 sm:mb-12"
      />
      <FeeCalculator />
    </>
  );
}
