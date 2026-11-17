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

  const viewSteps: { id: ViewStepId; label: string }[] = [
    { id: 'S01', label: t('progress.step.S01') },
    { id: 'S02', label: t('progress.step.S02') },
    { id: 'S03', label: t('progress.step.S03') },
    { id: 'S04', label: t('progress.step.S04') },
    { id: 'S05', label: t('progress.step.S05') },
    { id: 'S06', label: t('progress.step.S06') },
  ];

  const currentIndex = Math.max(
    viewSteps.findIndex((step) => step.id === currentStep),
    0
  );

  return (
    <section
      aria-label={t('progress.section')}
      className="scene__panel"
      style={{
        padding: '16px 18px',
        marginBottom: '24px',
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
            className="state-chip"
            data-tone={progress.completedCount === progress.totalCount ? 'revealed' : 'selected'}
          >
            <span aria-hidden="true">
              {progress.completedCount === progress.totalCount ? '✓' : '◈'}
            </span>
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
          backgroundColor: 'rgba(7, 12, 20, 0.75)',
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
              padding: '8px 10px',
              borderRadius: '8px',
              backgroundColor: milestone.completed
                ? 'var(--archive-teal-surface)'
                : 'rgba(7, 12, 20, 0.55)',
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

      {/* Step navigation — the chapters of the investigation, the active one
          lifted out of the page */}
      <nav aria-label={t('progress.nav.label')}>
        <div className="scene-3d">
          <div className="progress-path-3d">
            {viewSteps.map((step, index) => {
              const isCurrent = currentStep === step.id;
              const isReceiptLocked = step.id === 'S06' && !hasVerifiedReceipt;
              const offset = index - currentIndex;
              const distance = Math.abs(offset);

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => onSelectStep(step.id)}
                  aria-current={isCurrent ? 'step' : undefined}
                  data-testid={`nav-step-${step.id}`}
                  className={`progress-step-3d${isCurrent ? ' is-current' : ''}`}
                  style={{
                    '--step-scale': `${isCurrent ? 1.03 : 1 - distance * 0.008}`,
                    '--step-opacity': `${isCurrent ? 1 : Math.max(0.62, 1 - distance * 0.1)}`,
                    padding: '9px 12px',
                    borderRadius: 'var(--radius-control)',
                    border: isCurrent
                      ? '2px solid var(--archive-amber-bright)'
                      : '1px solid var(--archive-midnight-border)',
                    backgroundColor: isCurrent
                      ? 'var(--archive-midnight)'
                      : 'rgba(7, 12, 20, 0.75)',
                    color: isCurrent ? 'var(--text-light)' : 'var(--text-muted)',
                    fontWeight: isCurrent ? 700 : 500,
                    fontSize: '0.86rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                  } as React.CSSProperties}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: isCurrent ? 'var(--archive-amber-bright)' : 'var(--text-muted)',
                      marginRight: '6px',
                    }}
                  >
                    {String(index + 1).padStart(2, '0')}
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
        </div>
      </nav>
    </section>
  );
};
