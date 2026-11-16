/**
 * - `active`: Notchs is live here; discovery sections show this city's content.
 * - `coming-soon`: the team has confirmed a launch. Set only when it's true.
 * - `not-yet`: no launch planned yet; people can ask for Notchs here.
 */
export type CityStatus = "active" | "coming-soon" | "not-yet";

export type Neighbourhood = {
  slug: string;
  name: string;
};

export type City = {
  /** The backend city id once the API serves it (`/dropdowns?names=cities`). */
  id: string;
  name: string;
  slug: string;
  state: string;
  country: string;
  status: CityStatus;
  image?: string;
  /** Only for live cities; never reuse one city's areas for another. */
  neighbourhoods: readonly Neighbourhood[];
};
