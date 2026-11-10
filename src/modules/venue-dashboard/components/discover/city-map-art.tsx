const ROADS = [
  "M-20 46 L120 41",
  "M45 -20 L49 120",
  "M-20 22 L60 30 L120 24",
  "M9 -20 L24 120",
  "M-20 74 L120 67",
  "M78 -20 L86 120",
  "M15 15 Q50 -5 86 20 Q105 55 80 86 Q50 104 20 86 Q-4 55 15 15",
];

/** Placeholder street art until a map tile provider is chosen. */
export function CityMapArt({ transform }: { transform?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="absolute inset-0 size-full"
    >
      <g transform={transform}>
        <rect x="-60" y="-60" width="220" height="220" fill="#e9e6db" />
        <path
          d="M20 12h16v14H20zM30 68h12v9H30zM78 74h10v10H78z"
          fill="#dce2cf"
        />
        <path
          d="M60 -20 C 63 20, 71 35, 66 55 S 70 90, 77 130"
          fill="none"
          stroke="#cdd5d2"
          strokeWidth="16"
          vectorEffect="non-scaling-stroke"
        />
        {ROADS.map((road, index) => (
          <path
            key={road}
            d={road}
            fill="none"
            stroke="#ffffff"
            strokeWidth={index === 6 ? 5 : index < 2 ? 4 : 2.5}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </g>
    </svg>
  );
}
