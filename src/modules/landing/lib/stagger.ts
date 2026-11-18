/* Used with <StaggerReveal>. Kept out of that client file so server
   components can use them. */

/** Classes for each child card: hidden below, then rising into place. */
export const staggerItem =
  "transition-[opacity,translate] duration-800 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[opacity,translate] group-data-[reveal=hidden]/reveal:translate-y-[70px] group-data-[reveal=hidden]/reveal:opacity-0 group-data-[reveal=hidden]/reveal:transition-none motion-reduce:transition-none";

/** Delay for the card at `index`, so they rise one after another. */
export const staggerDelay = (index: number) => ({
  transitionDelay: `${index * 180}ms`,
});
