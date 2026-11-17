import React from 'react';

interface FlipCard3DProps {
  /** When true the card shows its back face (180° rotation). */
  isFlipped: boolean;
  /** Content of the front face. */
  front: React.ReactNode;
  /** Content of the back face. */
  back: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  dataTestId?: string;
  /** Adds the soft light sheen overlay on both faces. */
  sheen?: boolean;
}

/**
 * FlipCard3D — a volumetric card that turns over on the Y axis to reveal its
 * reverse side.
 *
 * Both faces stay in the accessibility tree (no `aria-hidden`, no unmounting)
 * so keyboard and screen-reader users always reach the whole content, while
 * the visual flip gives the "carte à retourner" feel of the interaction.
 */
export const FlipCard3D: React.FC<FlipCard3DProps> = ({
  isFlipped,
  front,
  back,
  className,
  style,
  dataTestId,
  sheen = true,
}) => {
  return (
    <div
      className={`card-3d${isFlipped ? ' is-flipped' : ''}${className ? ` ${className}` : ''}`}
      style={style}
      data-testid={dataTestId}
    >
      <div className="card-3d__inner">
        <div className="card-3d__face card-3d__face--front">
          {front}
          {sheen && <span className="card-3d__sheen" aria-hidden="true" />}
        </div>
        <div className="card-3d__face card-3d__face--back">
          {back}
          {sheen && <span className="card-3d__sheen" aria-hidden="true" />}
        </div>
      </div>
    </div>
  );
};
