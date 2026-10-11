"use client";

import { useState } from "react";

const cutClassName = "animate-cut fill-ink [transform-box:fill-box]";

/**
 * The Volt block with both notches cut in on load. Clicking it replays the
 * cut. The backing square is always Ink so Volt never sits on Paper.
 */
export function NotchMarkCut() {
  const [replay, setReplay] = useState(0);

  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className="w-full cursor-pointer [-webkit-tap-highlight-color:transparent]"
      onClick={() => setReplay((count) => count + 1)}
    >
      <rect className="fill-ink" width="32" height="32" rx="7" />
      {/* A new key remounts the group, which restarts the animations. */}
      <g key={replay} transform="translate(4 4)">
        <rect className="fill-volt" width="24" height="24" rx="4" />
        <polygon
          className={`${cutClassName} origin-top [animation-delay:250ms]`}
          points="8.173,-1 18,-1 18,16.02 8.75,0"
        />
        <polygon
          className={`${cutClassName} origin-bottom [animation-delay:550ms]`}
          points="15.827,25 6,25 6,7.98 15.25,24"
        />
      </g>
    </svg>
  );
}
