import React, { useEffect, useRef, useState } from 'react';
import { ConclusionOption } from '../types/archive';
import { useI18n } from '../i18n/I18nContext';
import { FlipCard3D } from './threeD/FlipCard3D';
import { FlipCardButton } from './threeD/FlipCardButton';

interface VerdictCard3DProps {
  option: ConclusionOption;
  isChecked: boolean;
  isFirst: boolean;
  hasError: boolean;
  onSelect: (value: ConclusionOption['value']) => void;
  onClearError: () => void;
  /** Ref forwarded to the radio input so the panel can move focus to it. */
  inputRef?: React.RefObject<HTMLInputElement | null>;
  /** Id of the error message describing the radio group. */
  describedById?: string;
}

/**
 * VerdictCard3D — the three admissible investigation verdicts, each one a
 * volumetric card.
 *
 * Front face: the radio control, the verdict label and its summary.
 * Back face : the epistemic warning attached to the verdict.
 *
 * Choosing a verdict physically turns its card over and brings it to the
 * front of the 3D deck.
 */
export const VerdictCard3D: React.FC<VerdictCard3DProps> = ({
  option,
  isChecked,
  isFirst,
  hasError,
  onSelect,
  onClearError,
  inputRef,
  describedById,
}) => {
  const [flipped, setFlipped] = useState(false);
  const internalRadioRef = useRef<HTMLInputElement | null>(null);
  const wasChecked = useRef(isChecked);
  const { t } = useI18n();

  // The card only turns over when the verdict actually changes, so a restored
  // session always opens on the readable front face (radio visible).
  useEffect(() => {
    if (isChecked !== wasChecked.current) {
      setFlipped(isChecked);
      wasChecked.current = isChecked;
    }
  }, [isChecked]);

  const toggleFlip = (): void => setFlipped((prev) => !prev);

  const faceChrome: React.CSSProperties = {
    backgroundColor: isChecked ? 'var(--archive-midnight)' : 'rgba(16, 26, 36, 0.82)',
    border: isChecked
      ? '2px solid var(--archive-amber-bright)'
      : hasError
        ? '1px solid var(--archive-crimson)'
        : '1px solid var(--archive-midnight-border)',
    borderRadius: 'var(--radius-card)',
    padding: '16px',
    boxShadow: isChecked
      ? '0 16px 34px rgba(0, 0, 0, 0.45)'
      : '0 10px 26px rgba(0, 0, 0, 0.28)',
    transition: 'background-color var(--motion-m03), border-color var(--motion-m03)',
  };

  const front = (
    <div style={faceChrome}>
      <label
        data-testid={`conclusion-option-${option.value}`}
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          paddingInlineEnd: '36px',
          cursor: 'pointer',
          height: '100%',
        }}
      >
        <input
          ref={inputRef ?? (isFirst ? internalRadioRef : undefined)}
          type="radio"
          name="conclusionType"
          value={option.value}
          checked={isChecked}
          onChange={() => {
            onSelect(option.value);
            if (hasError) onClearError();
          }}
          aria-describedby={describedById}
          style={{ marginTop: '4px', transform: 'scale(1.2)' }}
        />
        <div>
          <div
            style={{
              fontWeight: 700,
              fontSize: '1rem',
              color: 'var(--text-light)',
              marginBottom: '6px',
            }}
          >
            {option.label}
          </div>
          <p style={{ margin: '0 0 6px 0', fontSize: '0.9rem', color: 'var(--text-light)' }}>
            {option.summary}
          </p>
        </div>
      </label>

      <FlipCardButton isFlipped={flipped} onToggle={toggleFlip} />
    </div>
  );

  const back = (
    <div style={faceChrome}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '10px',
          paddingInlineEnd: '36px',
        }}
      >
        <span
          style={{
            fontSize: '0.78rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--archive-amber-bright)',
          }}
        >
          {isChecked ? t('card3d.verdict.selected') : t('card3d.verdict.pending')}
        </span>
      </div>

      <p
        style={{
          margin: '0 0 10px 0',
          fontSize: '1rem',
          fontWeight: 700,
          color: 'var(--text-light)',
        }}
      >
        {option.label}
      </p>

      <div
        style={{
          padding: '12px 14px',
          borderRadius: '10px',
          backgroundColor: 'rgba(197, 138, 69, 0.14)',
          borderInlineStart: '4px solid var(--archive-amber)',
          borderInlineEnd: '4px solid var(--archive-amber)',
          fontSize: '0.9rem',
          flex: '1 1 auto',
        }}
      >
        <p style={{ margin: 0, fontStyle: 'italic', color: 'var(--text-light)' }}>
          {option.epistemicWarning}
        </p>
      </div>

      <FlipCardButton isFlipped={flipped} onToggle={toggleFlip} />
    </div>
  );

  return (
    <FlipCard3D
      isFlipped={flipped}
      front={front}
      back={back}
      style={{
        backgroundColor: 'transparent',
        borderRadius: 'var(--radius-card)',
        height: '100%',
      }}
    />
  );
};
