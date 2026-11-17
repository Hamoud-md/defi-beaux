import React from 'react';
import { useTilt3D } from './motion';

export interface Deck3DCard {
  id: string;
  node: React.ReactNode;
}

interface Deck3DProps {
  /** Ordered deck content. The first card is the leftmost one in LTR. */
  cards: Deck3DCard[];
  /** Id of the card currently brought to the front of the deck. */
  activeId?: string | null;
  /** Enable the pointer-driven parallax tilt of the whole stage. */
  tilt?: boolean;
  className?: string;
  style?: React.CSSProperties;
  ariaLabel?: string;
  dataTestId?: string;
}

/**
 * Deck3D — a layered deck of cards rendered inside a CSS perspective scene.
 *
 * The card matching `activeId` is pulled forward (a small translateZ plus a
 * glow) while its neighbours recede and dim, so the deck reads as a stack of
 * physical archival cards without ever letting one card cover another's
 * interactive area: the cards stay coplanar, which keeps every button
 * reachable by pointer and keyboard.
 */
export const Deck3D: React.FC<Deck3DProps> = ({
  cards,
  activeId = null,
  tilt = true,
  className,
  style,
  ariaLabel,
  dataTestId,
}) => {
  const deckRef = useTilt3D<HTMLDivElement>(tilt, { maxY: 3, maxX: 2.5 });

  const activeIndex = activeId ? cards.findIndex((card) => card.id === activeId) : -1;
  const pivot = activeIndex >= 0 ? activeIndex : Math.max(cards.length - 1, 0) / 2;

  return (
    <div
      className={`scene-3d${className ? ` ${className}` : ''}`}
      aria-label={ariaLabel}
      data-testid={dataTestId}
    >
      <div className="deck-3d" ref={deckRef} style={style}>
        {cards.map((card, index) => {
          const offset = index - pivot;
          const distance = Math.abs(offset);
          const isActive = activeIndex >= 0 && index === activeIndex;

          const deckScale = isActive ? 1.02 : 1 - distance * 0.012;
          const deckDim = isActive ? 0 : Math.min(0.34, distance * 0.14);

          return (
            <div
              key={card.id}
              className={`deck-3d__slot${isActive ? ' is-active' : ''}`}
              style={
                {
                  '--deck-scale': `${deckScale}`,
                  '--deck-dim': `${deckDim}`,
                  zIndex: 100 - distance,
                } as React.CSSProperties
              }
            >
              {card.node}
            </div>
          );
        })}
      </div>
    </div>
  );
};
