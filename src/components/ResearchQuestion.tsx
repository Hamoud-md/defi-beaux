import React, { useEffect, useRef, useState } from 'react';
import { ResearchQuestion as ResearchQuestionType } from '../types/archive';
import { useI18n } from '../i18n/I18nContext';
import { stripRefCode, stripIdParentheticals } from '../utils/labels';
import { FlipCard3D } from './threeD/FlipCard3D';
import { FlipCardButton } from './threeD/FlipCardButton';

interface ResearchQuestionProps {
  question: ResearchQuestionType;
  isSelected: boolean;
  wasExplored: boolean;
  onSelect: (questionId: string) => void;
}

/**
 * ResearchQuestion — a volumetric research-trail card.
 *
 * Front face: the question itself and the "interrogate this trail" action.
 * Back face : the causal feedback returned by the archive (track status,
 *             rationale and epistemic limits).
 *
 * The card carries a clear state (neutral / selected / revealed / weak lead)
 * announced by a labelled chip, so the investigator never has to guess from
 * colour alone. Selecting a trail automatically turns the card over, so the
 * investigator literally "flips" the evidence to discover what it answers.
 */
export const ResearchQuestion: React.FC<ResearchQuestionProps> = ({
  question,
  isSelected,
  wasExplored,
  onSelect,
}) => {
  const { t } = useI18n();
  const isPertinent = question.trackStatus === 'pertinent_bridge';
  const [flipped, setFlipped] = useState(false);
  const wasSelected = useRef(isSelected);

  // The card only turns over when the choice actually changes, so a restored
  // session always opens on the readable front face.
  useEffect(() => {
    if (isSelected !== wasSelected.current) {
      setFlipped(isSelected);
      wasSelected.current = isSelected;
    }
  }, [isSelected]);

  const accent = isPertinent ? 'var(--archive-teal-bright)' : 'var(--archive-amber-bright)';

  const cardState: 'neutral' | 'selected' | 'revealed' | 'weak' = isSelected
    ? 'selected'
    : wasExplored && isPertinent
      ? 'revealed'
      : wasExplored
        ? 'weak'
        : 'neutral';

  const stateChip = (() => {
    switch (cardState) {
      case 'selected':
        return { tone: 'selected' as const, icon: '◈', label: t('card.state.selected') };
      case 'revealed':
        return { tone: 'revealed' as const, icon: '✦', label: t('card.state.revealed') };
      case 'weak':
        return { tone: 'weak' as const, icon: '◇', label: t('card.state.weak') };
      default:
        return { tone: 'neutral' as const, icon: '○', label: t('card.state.neutral') };
    }
  })();

  const toggleFlip = (): void => setFlipped((prev) => !prev);

  const front = (
    <>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '12px',
          paddingInlineEnd: '42px',
        }}
      >
        <span
          style={{
            fontSize: '0.78rem',
            fontWeight: 700,
            color: 'var(--archive-amber-bright)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          {stripRefCode(question.shortLabel)}
        </span>

        <span style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {isSelected && (
            <span
              data-testid={`question-selected-badge-${question.id}`}
              style={{
                fontSize: '0.74rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '999px',
                backgroundColor: 'var(--archive-amber)',
                color: 'var(--archive-ink)',
              }}
            >
              {t('card3d.selectedBadge')}
            </span>
          )}

          {wasExplored && (
            <span
              data-testid={`question-track-badge-${question.id}`}
              style={{
                fontSize: '0.76rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '999px',
                backgroundColor: isPertinent ? '#235E51' : '#4A3A20',
                color: '#F7F4ED',
              }}
            >
              {isPertinent ? t('question.trackBadge.pertinent') : t('question.trackBadge.other')}
            </span>
          )}
        </span>
      </div>

      <p
        style={{
          margin: '0 0 16px 0',
          fontSize: '1.12rem',
          fontWeight: 700,
          color: 'var(--text-light)',
          fontFamily: 'var(--font-serif)',
          flex: '1 1 auto',
        }}
      >
        « {question.text} »
      </p>

      <button
        type="button"
        onClick={() => onSelect(question.id)}
        aria-pressed={isSelected}
        data-testid={`select-question-${question.id}`}
        style={{
          width: '100%',
          padding: '11px 14px',
          borderRadius: 'var(--radius-control)',
          border: isSelected ? '2px solid var(--archive-amber-bright)' : '1px solid var(--archive-amber)',
          backgroundColor: isSelected ? 'var(--archive-amber)' : 'var(--archive-midnight)',
          color: isSelected ? 'var(--archive-ink)' : 'var(--text-light)',
          fontWeight: 700,
          fontSize: '0.92rem',
          cursor: 'pointer',
          textAlign: 'center',
          transition: 'background-color var(--motion-m09), border-color var(--motion-m09)',
        }}
      >
        {isSelected ? t('question.activePlain') : t('question.selectPlain')}
      </button>

      <FlipCardButton isFlipped={flipped} onToggle={toggleFlip} />
    </>
  );

  const back = (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          marginBottom: '10px',
          paddingInlineEnd: '42px',
        }}
      >
        <span
          style={{
            fontSize: '0.78rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: accent,
          }}
        >
          {stripRefCode(question.shortLabel)}
        </span>
        <span className="state-chip" data-tone={stateChip.tone}>
          <span aria-hidden="true">{stateChip.icon}</span>
          {stateChip.label}
        </span>
      </div>

      <div
        role="region"
        aria-label={t('question.resultLabelPlain')}
        data-testid={`question-feedback-${question.id}`}
        className="animate-entry"
        style={{
          padding: '12px',
          borderRadius: '10px',
          backgroundColor: 'rgba(7, 12, 20, 0.92)',
          borderInlineStart: `4px solid ${accent}`,
          borderInlineEnd: `4px solid ${accent}`,
          fontSize: '0.9rem',
          flex: '1 1 auto',
        }}
      >
        <p style={{ margin: '0 0 6px 0', fontWeight: 700, color: accent }}>
          {t('question.trackStatus')} {stripRefCode(question.trackStatusLabel)}
        </p>
        <p style={{ margin: '0 0 6px 0', color: 'var(--text-light)' }}>
          {stripIdParentheticals(question.feedback)}
        </p>
        <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-muted)' }}>
          <strong>{t('question.epistemicScope')}</strong> {stripIdParentheticals(question.epistemicLimit)}
        </p>
      </div>

      <FlipCardButton isFlipped={flipped} onToggle={toggleFlip} />
    </>
  );

  return (
    <FlipCard3D
      isFlipped={flipped}
      front={front}
      back={back}
      style={{
        backgroundColor: 'rgba(9, 15, 23, 0.9)',
        border:
          cardState === 'selected'
            ? '2px solid var(--archive-amber-bright)'
            : cardState === 'revealed'
              ? '2px solid var(--archive-teal-bright)'
              : cardState === 'weak'
                ? '1px solid rgba(224, 167, 95, 0.45)'
                : '1px solid var(--archive-midnight-border)',
        borderRadius: 'var(--radius-card)',
        padding: '16px',
        height: '100%',
        boxShadow:
          cardState === 'neutral'
            ? '0 10px 26px rgba(0, 0, 0, 0.32)'
            : '0 18px 40px rgba(0, 0, 0, 0.5)',
        transition: 'border-color var(--motion-m03), box-shadow var(--motion-m03)',
      }}
    />
  );
};
