import React from 'react';

/**
 * ClockTowerScene — the atmospheric backdrop of the Memory City.
 *
 * "The Forgotten Clock Tower": a deep blue night, a low fog bank drifting
 * over an old city, and one golden clock tower still burning above the fog.
 *
 * The whole scene is decorative: it is exposed to assistive technologies as
 * `aria-hidden` and never intercepts pointer events. All of its motion is
 * neutralised by the reduced-motion rules in index.css.
 */

/** Deterministic pseudo-random generator so the skyline never flickers. */
function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

interface Building {
  x: number;
  width: number;
  height: number;
  lit: number[];
}

function buildSkyline(seed: number, count: number, maxHeight: number): Building[] {
  const rand = seededRandom(seed);
  const buildings: Building[] = [];
  let x = -20;
  const step = 1440 / count;
  for (let i = 0; i < count; i += 1) {
    const width = step * (0.55 + rand() * 0.5);
    const height = maxHeight * (0.25 + rand() * 0.75);
    const windows: number[] = [];
    const windowCount = Math.floor(rand() * 3);
    for (let w = 0; w < windowCount; w += 1) {
      windows.push(Math.round(rand() * 3));
    }
    buildings.push({ x: Math.round(x), width: Math.round(width), height: Math.round(height), lit: windows });
    x += width + step * 0.12;
  }
  return buildings;
}

const FAR_BUILDINGS = buildSkyline(20261116, 26, 150);
const NEAR_BUILDINGS = buildSkyline(777001, 16, 210);
const STARS = (() => {
  const rand = seededRandom(424242);
  return Array.from({ length: 90 }, () => ({
    x: Math.round(rand() * 1440),
    y: Math.round(rand() * 520),
    r: Math.round((rand() * 1.4 + 0.4) * 10) / 10,
    o: Math.round((rand() * 0.6 + 0.25) * 100) / 100,
  }));
})();

const farCity = FAR_BUILDINGS.map((b) => (
  <rect
    key={`far-${b.x}`}
    className="bridge-canvas__tower--far"
    x={b.x}
    y={420 - b.height}
    width={b.width}
    height={b.height}
    fill="#070E18"
    stroke="rgba(120,160,200,0.14)"
    strokeWidth="1"
  />
));

const nearCity = NEAR_BUILDINGS.map((b) => (
  <g key={`near-${b.x}`}>
    <rect
      x={b.x}
      y={420 - b.height}
      width={b.width}
      height={b.height}
      fill="#04080F"
      stroke="rgba(120,160,200,0.1)"
      strokeWidth="1"
    />
    {b.lit.map((offset, index) => (
      <rect
        key={index}
        x={b.x + 8 + offset * 14}
        y={420 - b.height + 16 + index * 26}
        width="5"
        height="8"
        fill="rgba(224,167,95,0.55)"
      />
    ))}
  </g>
));

export const ClockTowerScene: React.FC = () => {
  return (
    <div className="clock-scene" aria-hidden="true">
      <div className="clock-scene__moon" />

      <svg
        className="clock-scene__stars"
        viewBox="0 0 1440 620"
        preserveAspectRatio="xMidYMin slice"
      >
        {STARS.map((star, index) => (
          <circle
            key={index}
            cx={star.x}
            cy={star.y}
            r={star.r}
            fill="#DCE8F5"
            opacity={star.o}
            style={{ animation: `star-flicker ${6 + (index % 7)}s ease-in-out ${index % 5}s infinite` }}
          />
        ))}
      </svg>

      <div className="clock-scene__tower-glow" />

      {/* The tower itself — silhouette with a single burning clock face */}
      <svg
        className="clock-scene__tower"
        viewBox="0 0 200 460"
        preserveAspectRatio="xMidYMax meet"
      >
        <defs>
          <radialGradient id="towerHalo" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="rgba(224,167,95,0.55)" />
            <stop offset="45%" stopColor="rgba(224,167,95,0.16)" />
            <stop offset="100%" stopColor="rgba(224,167,95,0)" />
          </radialGradient>
        </defs>

        <circle cx="100" cy="180" r="90" fill="url(#towerHalo)" />

        {/* Spire */}
        <polygon points="100,8 106,44 94,44" fill="#050A11" />
        <line x1="100" y1="44" x2="100" y2="66" stroke="#050A11" strokeWidth="2" />

        {/* Roof */}
        <polygon points="64,150 100,70 136,150" fill="#050A11" stroke="rgba(140,180,215,0.2)" />

        {/* Body */}
        <path
          d="M70 150 L64 430 L136 430 L130 150 Z"
          fill="#050A11"
          stroke="rgba(140,180,215,0.22)"
          strokeWidth="1.4"
        />

        {/* Lit windows */}
        {[
          [82, 250],
          [110, 250],
          [82, 300],
          [110, 300],
          [82, 350],
          [110, 350],
        ].map(([wx, wy]) => (
          <rect
            key={`${wx}-${wy}`}
            x={wx}
            y={wy}
            width="8"
            height="14"
            rx="2"
            fill="rgba(224,167,95,0.42)"
          />
        ))}

        {/* Clock chamber */}
        <rect
          x="70"
          y="152"
          width="60"
          height="62"
          rx="3"
          fill="#050A11"
          stroke="rgba(140,180,215,0.26)"
          strokeWidth="1.4"
        />
        <circle cx="100" cy="183" r="21" fill="rgba(224,167,95,0.62)" />
        <circle cx="100" cy="183" r="21" fill="none" stroke="rgba(255,236,200,0.55)" strokeWidth="1.5" />
        <line x1="100" y1="183" x2="100" y2="170" stroke="#0B1421" strokeWidth="2.4" strokeLinecap="round" />
        <line x1="100" y1="183" x2="109" y2="187" stroke="#0B1421" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="100" cy="183" r="2.4" fill="#0B1421" />

        {/* Plinth */}
        <rect x="54" y="424" width="92" height="36" fill="#03060C" />
      </svg>

      {/* Old city */}
      <svg
        className="clock-scene__city"
        viewBox="0 0 1440 420"
        preserveAspectRatio="xMidYMax slice"
      >
        {farCity}
        {nearCity}
      </svg>

      <div className="clock-scene__fog clock-scene__fog--back" />
      <div className="clock-scene__fog clock-scene__fog--front" />
      <div className="clock-scene__vignette" />
    </div>
  );
};

export default ClockTowerScene;
