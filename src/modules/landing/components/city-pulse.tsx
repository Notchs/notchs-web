import { saturdayContent } from "../content";
import { SaturdayMap } from "./saturday-map";
import { SectionHeading } from "./section-heading";

/** "What's happening around your city?": the Ahmedabad map tour. */
export function CityPulse() {
  return (
    <>
      <SectionHeading
        className="mb-10 reveal"
        kicker={saturdayContent.kicker}
        title={saturdayContent.title}
        description={saturdayContent.description}
      />
      <SaturdayMap />
    </>
  );
}
