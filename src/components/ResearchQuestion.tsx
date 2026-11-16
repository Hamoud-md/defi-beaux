import React from 'react';
import { ResearchQuestion as ResearchQuestionType } from '../types/archive';

interface ResearchQuestionProps {
  question: ResearchQuestionType;
  isSelected: boolean;
  wasExplored: boolean;
  onSelect: (questionId: string) => void;
}

export const ResearchQuestion: React.FC<ResearchQuestionProps> = ({
  question,
  isSelected,
  wasExplored,
  onSelect,
}) => {
  const isPertinent = question.trackStatus === 'pertinent_bridge';

  return (
    <div
      data-testid={`question-item-${question.id}`}
      style={{
        backgroundColor: isSelected
          ? isPertinent
            ? 'rgba(58, 140, 121, 0.22)'
            : 'rgba(197, 138, 69, 0.22)'
          : 'rgba(16, 26, 36, 0.78)',
        border: isSelected
          ? isPertinent
            ? '2px solid var(--archive-teal-bright)'
            : '2px solid var(--archive-amber-bright)'
          : '1px solid var(--archive-midnight-border)',
        borderRadius: 'var(--radius-control)',
        padding: '14px',
        transition: 'background-color var(--motion-m03), border-color var(--motion-m03)',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '6px',
        }}
      >
        <span
          style={{
            fontSize: '0.78rem',
            fontWeight: 700,
            color: 'var(--archive-amber-bright)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          {question.shortLabel}
        </span>

        {wasExplored && (
          <span
            data-testid={`question-track-badge-${question.id}`}
            style={{
              fontSize: '0.76rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '999px',
              backgroundColor: isPertinent ? '#235E51' : '#5A4628',
              color: '#F7F4ED',
            }}
          >
            {isPertinent ? '✓ Piste fructueuse (S003)' : '○ Piste sans preuve directe'}
          </span>
        )}
      </div>

      <p
        style={{
          margin: '0 0 10px 0',
          fontSize: '1.05rem',
          fontWeight: 700,
          color: 'var(--text-light)',
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
          padding: '10px 14px',
          borderRadius: 'var(--radius-control)',
          border: isSelected
            ? '2px solid var(--text-light)'
            : '1px solid var(--archive-amber)',
          backgroundColor: isSelected ? 'var(--archive-amber)' : 'var(--archive-midnight)',
          color: isSelected ? 'var(--archive-ink)' : 'var(--text-light)',
          fontWeight: 700,
          fontSize: '0.92rem',
          cursor: 'pointer',
          textAlign: 'center',
          transition: 'background-color var(--motion-m09)',
        }}
      >
        {isSelected
          ? `✓ Question active : ${question.id}`
          : `Interroger cette piste (${question.id})`}
      </button>

      {isSelected && (
        <div
          role="region"
          aria-label={`Résultat de la piste ${question.id}`}
          data-testid={`question-feedback-${question.id}`}
          className="animate-entry"
          style={{
            marginTop: '12px',
            padding: '12px',
            borderRadius: '8px',
            backgroundColor: 'rgba(16, 26, 36, 0.9)',
            borderLeft: isPertinent
              ? '4px solid var(--archive-teal-bright)'
              : '4px solid var(--archive-amber)',
            fontSize: '0.9rem',
          }}
        >
          <p
            style={{
              margin: '0 0 6px 0',
              fontWeight: 700,
              color: isPertinent ? 'var(--archive-teal-bright)' : 'var(--archive-amber-bright)',
            }}
          >
            Statut de la piste : {question.trackStatusLabel}
          </p>
          <p style={{ margin: '0 0 6px 0', color: 'var(--text-light)' }}>{question.feedback}</p>
          <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-muted)' }}>
            <strong>Portée épistémique :</strong> {question.epistemicLimit}
          </p>
        </div>
      )}
    </div>
  );
};
