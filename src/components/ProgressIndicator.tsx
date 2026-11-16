import React from 'react';
import { FactualProgressSummary } from '../domain/validation';
import { ViewStepId } from '../types/archive';
import { useI18n } from '../i18n/I18nContext';

interface ProgressIndicatorProps {
  currentStep: ViewStepId;
  onSelectStep: (step: ViewStepId) => void;
  progress: FactualProgressSummary;
  hasVerifiedReceipt: boolean;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  onSelectStep,
  progress,
  hasVerifiedReceipt,
}) => {
  const { t } = useI18n();

  const viewSteps: { id: ViewStepId; code: string; label: string }[] = [
    { id: 'S01', code: 'S01', label: t('progress.step.S01') },
    { id: 'S02', code: 'S02', label: t('progress.step.S02') },
    { id: 'S03', code: 'S03', label: t('progress.step.S03') },
    { id: 'S04', code: 'S04', label: t('progress.step.S04') },
    { id: 'S05', code: 'S05', label: t('progress.step.S05') },
    { id: 'S06', code: 'S06', label: t('progress.step.S06') },
  ];

  return (
    <section
      aria-label={t('progress.section')}
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
            {t('progress.label')}
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
            {t('progress.badge', {
              completed: progress.completedCount,
              total: progress.totalCount,
              pct: progress.percentage,
            })}
          </span>
        </div>

        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          {t('progress.disclaimer')}
        </span>
      </div>

      {/* Progress bar */}
      <div
        role="progressbar"
        aria-label={t('progress.bar.label')}
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
      <nav aria-label={t('progress.nav.label')}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          {viewSteps.map((step) => {
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
                    {t('progress.afterSave')}
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
