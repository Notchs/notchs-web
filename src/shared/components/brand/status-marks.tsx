import { NOTCH_PATH } from "./notch-geometry";

/** A blank block with the notches only outlined: nothing was cut here. */
export function GhostMark() {
  const ghostProps = {
    className: "animate-blink stroke-unnotched",
    fill: "none",
    strokeWidth: 0.35,
    strokeDasharray: "1 .8",
    strokeLinejoin: "round",
  } as const;

  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className="w-full">
      <g transform="translate(4 4)">
        <rect className="fill-block" width="24" height="24" rx="4" />
        <polygon {...ghostProps} points="8.75,0 18,0 18,16.02" />
        <polygon {...ghostProps} points="15.25,24 6,24 6,7.98" />
      </g>
    </svg>
  );
}

/** The "N" struck through by a bar: access is locked. */
export function LockedMark() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className="w-full">
      <g transform="translate(4 4)">
        <path className="fill-block" d={NOTCH_PATH} />
        <rect
          className="origin-left animate-slide fill-unnotched [transform-box:fill-box]"
          x="-3"
          y="10.75"
          width="30"
          height="2.5"
          rx="1.25"
        />
      </g>
    </svg>
  );
}
