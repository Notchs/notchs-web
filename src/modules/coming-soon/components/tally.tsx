/** Four tally strokes and the strike through them, with their draw delays. */
const strokes = [
  { d: "M8 3v18", delay: "1.1s" },
  { d: "M16 3v18", delay: "1.22s" },
  { d: "M24 3v18", delay: "1.34s" },
  { d: "M32 3v18", delay: "1.46s" },
  { d: "M3 16L41 8", delay: "1.7s", strike: true },
];

export function Tally() {
  return (
    <svg
      viewBox="0 0 44 24"
      aria-hidden="true"
      className="h-6 w-11 flex-none"
      fill="none"
      strokeWidth={2}
      strokeLinecap="round"
    >
      {strokes.map(({ d, delay, strike }) => (
        <path
          key={d}
          d={d}
          pathLength={1}
          strokeDasharray={1}
          style={{ animationDelay: delay }}
          className={`animate-draw ${strike ? "stroke-unnotched" : "stroke-foreground"}`}
        />
      ))}
    </svg>
  );
}
