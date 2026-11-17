import React from 'react';
import { TransverseState } from '../types/archive';
import { useI18n } from '../i18n/I18nContext';

interface StatusMessageProps {
  transverseStates: TransverseState[];
  message: string | null;
  errorDetail?: string | null;
  onDismissMessage?: () => void;
  onRetryAction?: () => void;
  retryLabel?: string;
}

const STATE_ICONS: Record<TransverseState, string> = {
  initial: '◈',
  loading: '◌',
  empty: '⚠',
  error: '✕',
  success: '✓',
  revisited: '↺',
  'reduced-motion': '◎',
  'storage-unavailable': '⚠',
};

const STATE_TRANSLATION_KEYS: Record<TransverseState, string> = {
  initial: 'status.initial',
  loading: 'status.loading',
  empty: 'status.empty',
  error: 'status.error',
  success: 'status.success',
  revisited: 'status.revisited',
  'reduced-motion': 'status.reducedMotion',
  'storage-unavailable': 'status.storageUnavailable',
};

export const StatusMessage: React.FC<StatusMessageProps> = ({
  transverseStates,
  message,
  errorDetail,
  onDismissMessage,
  onRetryAction,
  retryLabel,
}) => {
  const { t } = useI18n();

  const effectiveRetryLabel = retryLabel || t('status.retry');

  const hasError =
    Boolean(errorDetail) ||
    transverseStates.includes('error') ||
    transverseStates.includes('empty') ||
    transverseStates.includes('storage-unavailable');

  return (
    <div style={{ marginBottom: '16px' }}>
      {/* Transverse active state badges */}
      <div
        aria-label={t('status.activeStates')}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '6px',
          marginBottom: message || errorDetail ? '10px' : '0',
        }}
      >
        <span
          style={{
            fontSize: '0.7rem',
            color: 'var(--text-muted)',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          {t('status.activeStates')}
        </span>
        {transverseStates.map((st) => {
          const icon = STATE_ICONS[st];
          const label = t(STATE_TRANSLATION_KEYS[st]);
          const isWarn = st === 'error' || st === 'empty' || st === 'storage-unavailable';
          const isOk = st === 'success' || st === 'revisited';
          return (
            <span
              key={st}
              data-testid={`transverse-state-${st}`}
              className="state-chip"
              data-tone={isWarn ? 'locked' : isOk ? 'revealed' : 'neutral'}
              style={{ fontSize: '0.7rem' }}
            >
              <span aria-hidden="true">{icon} </span>
              {label}
            </span>
          );
        })}
      </div>

      {/* Live announcement banner */}
      {(message || errorDetail) && (
        <div
          role={hasError ? 'alert' : 'status'}
          aria-live={hasError ? 'assertive' : 'polite'}
          data-testid={hasError ? 'status-error-banner' : 'status-info-banner'}
          style={{
            backgroundColor: hasError
              ? 'var(--archive-crimson-surface)'
              : 'var(--archive-teal-surface)',
            border: hasError
              ? '2px solid var(--archive-crimson)'
              : '1px solid var(--archive-teal)',
            borderRadius: 'var(--radius-control)',
            padding: '12px 16px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div style={{ flex: '1 1 300px' }}>
            {errorDetail && (
              <p style={{ margin: '0 0 4px 0', fontWeight: 700, color: 'var(--text-light)' }}>
                <span aria-hidden="true">{t('status.errorPrefix')}</span>
                {errorDetail}
              </p>
            )}
            {message && (
              <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '0.95rem' }}>
                {message}
              </p>
            )}
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {onRetryAction && (
              <button
                type="button"
                onClick={onRetryAction}
                style={{
                  backgroundColor: 'var(--archive-amber)',
                  color: 'var(--archive-ink)',
                  fontWeight: 700,
                  border: 'none',
                  borderRadius: 'var(--radius-control)',
                  padding: '6px 14px',
                  cursor: 'pointer',
                  fontSize: '0.88rem',
                }}
              >
                {effectiveRetryLabel}
              </button>
            )}
            {onDismissMessage && (
              <button
                type="button"
                onClick={onDismissMessage}
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--text-light)',
                  border: '1px solid var(--text-muted)',
                  borderRadius: 'var(--radius-control)',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                {t('status.close')}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
