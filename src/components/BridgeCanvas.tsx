import React from 'react';

/**
 * BridgeCanvas — the signature interaction of the investigation.
 *
 * Two claims (1920 old tower / 1922 new tower) stand on either side of a
 * chasm. The investigator's chosen research path decides what happens:
 *
 *  - idle   : the void is still there, only the ghost of a bridge is drawn.
 *  - formed : the bridge materialises, a 1921 keystone locks it, and the
 *             clock of the far tower finally lights up.
 *  - broken : the path stops half-way and fractures — it never reaches the
 *             other shore, so the two claims stay unrelated.
 *
 * The canvas is decorative (`role="img"` with a text alternative); the same
 * information is always available as text next to it, so the meaning never
 * depends on colour or motion alone.
 */

export type BridgeState = 'idle' | 'formed' | 'broken';

interface BridgeCanvasProps {
  state: BridgeState;
  /** Short name of the left-hand claim (e.g. "Vieille tour"). */
  leftLabel: string;
  /** Short name of the right-hand claim (e.g. "Nouvelle tour"). */
  rightLabel: string;
  /** Year displayed under each side. */
  leftYear: string;
  rightYear: string;
  /** Name of the document that locks the bridge, when it is formed. */
  keystoneLabel?: string | null;
  /** Text alternative describing the current state of the bridge. */
  stateLabel: string;
  /** Mirrors the scene for right-to-left languages. */
  isRtl?: boolean;
}

export const BridgeCanvas: React.FC<BridgeCanvasProps> = ({
  state,
  leftLabel,
  rightLabel,
  leftYear,
  rightYear,
  keystoneLabel,
  stateLabel,
  isRtl = false,
}) => {
  const isFormed = state === 'formed';
  const isBroken = state === 'broken';

  // In RTL the two shores swap sides; the geometry is mirrored but the labels
  // are drawn outside the mirror so the text itself is never reversed.
  const mirror = isRtl ? 'translate(800, 0) scale(-1, 1)' : undefined;
  const xOldTower = isRtl ? 700 : 100;
  const xNewTower = isRtl ? 100 : 700;
  const xBreakMark = isRtl ? 320 : 480;

  return (
    <svg
      className="bridge-canvas"
      viewBox="0 0 800 340"
      role="img"
      aria-label={stateLabel}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="bridgeChasm" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(4,8,14,0.2)" />
          <stop offset="100%" stopColor="rgba(2,4,8,0.98)" />
        </linearGradient>
        <radialGradient id="bridgeAura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(224,167,95,0.35)" />
          <stop offset="100%" stopColor="rgba(224,167,95,0)" />
        </radialGradient>
      </defs>

      {/* Aura behind the chasm — intensifies when the bridge is complete */}
      <ellipse
        cx="400"
        cy="240"
        rx="240"
        ry="90"
        fill="url(#bridgeAura)"
        opacity={isFormed ? 1 : 0.35}
      />

      {/* Chasm */}
      <rect className="bridge-canvas__chasm" x="190" y="244" width="420" height="96" />

      {/* Cliffs */}
      <polygon className="bridge-canvas__cliff" points="0,340 0,244 190,244 190,340" />
      <polygon className="bridge-canvas__cliff" points="610,340 610,244 800,244 800,340" />

      <g transform={mirror}>
        {/* Left tower — the 1920 claim */}
        <g>
          <polygon className="bridge-canvas__roof" points="58,96 100,24 142,96" />
          <path className="bridge-canvas__tower" d="M68 96 L60 244 L140 244 L132 96 Z" />
          <circle
            className={`bridge-canvas__clock${isFormed ? ' bridge-canvas__clock--lit' : ''}`}
            cx="100"
            cy="132"
            r="25"
          />
          <line className="bridge-canvas__hand" x1="100" y1="132" x2="100" y2="116" />
          <line className="bridge-canvas__hand" x1="100" y1="132" x2="111" y2="137" />
        </g>

        {/* Right tower — the 1922 claim */}
        <g>
          <polygon className="bridge-canvas__roof" points="658,96 700,24 742,96" />
          <path className="bridge-canvas__tower" d="M668 96 L660 244 L740 244 L732 96 Z" />
          <circle
            className={`bridge-canvas__clock${isFormed ? ' bridge-canvas__clock--lit' : ''}`}
            cx="700"
            cy="132"
            r="25"
          />
          <line className="bridge-canvas__hand" x1="700" y1="132" x2="700" y2="116" />
          <line className="bridge-canvas__hand" x1="700" y1="132" x2="711" y2="137" />
        </g>

        {/* Idle: the ghost of a bridge, and the void it cannot cross */}
        {!isFormed && !isBroken && (
          <g>
            <path className="bridge-canvas__ghost" d="M190 244 Q400 194 610 244" />
            <circle
              cx="400"
              cy="219"
              r="19"
              fill="none"
              stroke="rgba(224,167,95,0.5)"
              strokeWidth="1.6"
              strokeDasharray="3 4"
            />
          </g>
        )}

        {/* Broken: the path leaves the first shore and fractures */}
        {isBroken && (
          <g>
            <path
              className="bridge-canvas__span bridge-canvas__span--broken"
              d="M190 244 L330 228"
            />
            <path
              d="M330 216 L338 228 L326 234 L336 244"
              fill="none"
              stroke="#8FA3B6"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle
              cx="336"
              cy="230"
              r="13"
              fill="none"
              stroke="#8FA3B6"
              strokeWidth="1.6"
              strokeDasharray="3 3"
            />
          </g>
        )}

        {/* Formed: the bridge locks, and a 1921 keystone holds it together */}
        {isFormed && (
          <g>
            <path className="bridge-canvas__rail" d="M190 232 Q400 180 610 232" />
            <path className="bridge-canvas__span" d="M190 244 Q400 194 610 244" />
            <circle className="bridge-canvas__node" cx="190" cy="244" r="8" />
            <circle className="bridge-canvas__node" cx="610" cy="244" r="8" />
            <rect
              className="bridge-canvas__keystone"
              x="366"
              y="202"
              width="68"
              height="36"
              rx="6"
            />
          </g>
        )}
      </g>

      {/* Labels — drawn outside the mirror so the text is never reversed */}
      <text className="bridge-canvas__year" x={xOldTower} y="298" textAnchor="middle">
        {leftYear}
      </text>
      <text className="bridge-canvas__label" x={xOldTower} y="320" textAnchor="middle">
        {leftLabel}
      </text>
      <text className="bridge-canvas__year" x={xNewTower} y="298" textAnchor="middle">
        {rightYear}
      </text>
      <text className="bridge-canvas__label" x={xNewTower} y="320" textAnchor="middle">
        {rightLabel}
      </text>

      {!isFormed && !isBroken && (
        <text className="bridge-canvas__void" x="400" y="226" textAnchor="middle">
          ?
        </text>
      )}

      {isBroken && (
        <text className="bridge-canvas__void" x={xBreakMark} y="236" textAnchor="middle">
          ✕
        </text>
      )}

      {isFormed && (
        <g>
          <text className="bridge-canvas__label--key" x="400" y="226" textAnchor="middle">
            1921
          </text>
          {keystoneLabel && (
            <text className="bridge-canvas__label" x="400" y="290" textAnchor="middle">
              {keystoneLabel}
            </text>
          )}
        </g>
      )}
    </svg>
  );
};

interface EchoStripProps {
  /** The middle node is the keystone and is highlighted when present. */
  keystone?: { year: string; label: string } | null;
  left: { year: string; label: string };
  right: { year: string; label: string };
}

/**
 * EchoStrip — the chronological echo of the case: what the archive finally
 * says once the missing link is established.
 */
export const EchoStrip: React.FC<EchoStripProps> = ({ keystone, left, right }) => {
  return (
    <div className="echo-strip">
      <div className="echo-strip__node">
        <span className="echo-strip__year">{left.year}</span>
        <span className="echo-strip__label">{left.label}</span>
      </div>
      <span className="echo-strip__arrow" aria-hidden="true">
        ↓
      </span>
      <div className="echo-strip__node" data-tone={keystone ? 'key' : undefined}>
        <span className="echo-strip__year">{keystone ? keystone.year : '—'}</span>
        <span className="echo-strip__label">{keystone ? keystone.label : '—'}</span>
      </div>
      <span className="echo-strip__arrow" aria-hidden="true">
        ↓
      </span>
      <div className="echo-strip__node">
        <span className="echo-strip__year">{right.year}</span>
        <span className="echo-strip__label">{right.label}</span>
      </div>
    </div>
  );
};

export default BridgeCanvas;
