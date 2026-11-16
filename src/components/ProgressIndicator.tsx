import React from 'react';
import { FactualProgressSummary } from '../domain/validation';
import { ViewStepId } from '../types/archive';

interface ProgressIndicatorProps {
  currentStep: ViewStepId;
  onSelectStep: (step: ViewStepId) => void;
  progress: FactualProgressSummary;
  hasVerifiedReceipt: boolean;
}

const VIEW_STEPS: { id: ViewStepId; code: string; label: string }[] = [
  { id: 'S01', code: 'S01', label: 'Accueil / Dossier' },
  { id: 'S02', code: 'S02', label: 'Comparaison (S001/S002)' },
  { id: 'S03', code: 'S03', label: 'Missing Bridge (Q001–Q003)' },
  { id: 'S04', code: 'S04', label: 'Nouvel indice & Analyse' },
  { id: 'S05', code: 'S05', label: 'Conclusion motivée' },
  { id: 'S06', code: 'S06', label: 'Reçu local' },
];

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  onSelectStep,
  progress,
  hasVerifiedReceipt,
}) => {
  return (
    <section
      aria-label="Progression factuelle de l’enquête et étapes du dossier"
      style={{
        backgroundColor: 'var(--archive-ink-elevated)',
        border: '1px solid var(--archive-midnight-border)',
        borderRadius: 'var(--radius-card)',
        padding: '16px',
        marginBottom: '20px',
      }}
    >
      {/* Factual progress header (OFF-04 / F10 / A11) */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            style={{
              fontWeight: 700,
              fontSize: '0.95rem',
              color: 'var(--text-light)',
            }}
          >
            Progression factuelle de l’enquête :
          </span>
          <span
            data-testid="factual-progress-badge"
            style={{
              backgroundColor:
                progress.completedCount === progress.totalCount
                  ? 'var(--archive-teal)'
                  : 'var(--archive-midnight)',
              color: 'var(--text-light)',
              fontWeight: 700,
              fontSize: '0.85rem',
              padding: '2px 10px',
              borderRadius: '999px',
            }}
          >
            {progress.completedCount} / {progress.totalCount} jalons vérifiés ({progress.percentage}
            %)
          </span>
        </div>

        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Basée uniquement sur vos actes d’analyse réels (aucun clic décoratif)
        </span>
      </div>

      {/* Progress bar */}
      <div
        role="progressbar"
        aria-label="Jalons d’enquête accomplis"
        aria-valuenow={progress.percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        style={{
          width: '100%',
          height: '8px',
          backgroundColor: 'var(--archive-ink)',
          borderRadius: '999px',
          overflow: 'hidden',
          marginBottom: '14px',
          border: '1px solid var(--archive-midnight-border)',
        }}
      >
        <div
          style={{
            width: `${progress.percentage}%`,
            height: '100%',
            backgroundColor:
              progress.percentage === 100 ? 'var(--archive-teal-bright)' : 'var(--archive-amber)',
            transition: 'width var(--motion-m03)',
          }}
        />
      </div>

      {/* Milestone pills */}
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: '0 0 16px 0',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(195px, 1fr))',
          gap: '8px',
        }}
      >
        {progress.steps.map((milestone) => (
          <li
            key={milestone.id}
            style={{
              fontSize: '0.82rem',
              padding: '6px 10px',
              borderRadius: '8px',
              backgroundColor: milestone.completed
                ? 'var(--archive-teal-surface)'
                : 'rgba(16, 26, 36, 0.55)',
              border: milestone.completed
                ? '1px solid var(--archive-teal)'
                : '1px solid var(--archive-midnight-border)',
              color: milestone.completed ? 'var(--text-light)' : 'var(--text-muted)',
            }}
          >
            <div style={{ fontWeight: 700 }}>
              <span aria-hidden="true">{milestone.completed ? '✓ ' : '○ '}</span>
              {milestone.label}
            </div>
            <div style={{ fontSize: '0.76rem', opacity: 0.9, marginTop: '2px' }}>
              {milestone.detail}
            </div>
          </li>
        ))}
      </ul>

      {/* Step navigation S01–S06 */}
      <nav aria-label="Navigation des vues de l’enquête (S01 à S06)">
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          {VIEW_STEPS.map((step) => {
            const isCurrent = currentStep === step.id;
            const isReceiptLocked = step.id === 'S06' && !hasVerifiedReceipt;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => onSelectStep(step.id)}
                aria-current={isCurrent ? 'step' : undefined}
                data-testid={`nav-step-${step.id}`}
                style={{
                  flex: '1 1 auto',
                  minWidth: '135px',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-control)',
                  border: isCurrent
                    ? '2px solid var(--archive-amber-bright)'
                    : '1px solid var(--archive-midnight-border)',
                  backgroundColor: isCurrent
                    ? 'var(--archive-midnight)'
                    : 'rgba(16, 26, 36, 0.75)',
                  color: isCurrent ? 'var(--text-light)' : 'var(--text-muted)',
                  fontWeight: isCurrent ? 700 : 500,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background-color var(--motion-m09)',
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: isCurrent ? 'var(--archive-amber-bright)' : 'var(--text-muted)',
                    marginRight: '6px',
                  }}
                >
                  [{step.code}]
                </span>
                {step.label}
                {isReceiptLocked && (
                  <span style={{ fontSize: '0.73rem', display: 'block', opacity: 0.75 }}>
                    (Après sauvegarde vérifiée)
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </section>
  );
};
