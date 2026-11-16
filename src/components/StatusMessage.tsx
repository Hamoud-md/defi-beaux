import React from 'react';
import { TransverseState } from '../types/archive';

interface StatusMessageProps {
  transverseStates: TransverseState[];
  message: string | null;
  errorDetail?: string | null;
  onDismissMessage?: () => void;
  onRetryAction?: () => void;
  retryLabel?: string;
}

const STATE_LABELS: Record<TransverseState, { label: string; icon: string }> = {
  initial: { label: 'État : Initial', icon: '◈' },
  loading: { label: 'État : Chargement', icon: '◌' },
  empty: { label: 'État : Dossier indisponible (Empty)', icon: '⚠' },
  error: { label: 'État : Erreur détectée', icon: '✕' },
  success: { label: 'État : Sauvegarde vérifiée', icon: '✓' },
  revisited: { label: 'Session restaurée (Revisited)', icon: '↺' },
  'reduced-motion': { label: 'Mouvement réduit (Reduced Motion)', icon: '◎' },
  'storage-unavailable': { label: 'Stockage local indisponible', icon: '⚠' },
};

export const StatusMessage: React.FC<StatusMessageProps> = ({
  transverseStates,
  message,
  errorDetail,
  onDismissMessage,
  onRetryAction,
  retryLabel = 'Rétablir l’état nominal',
}) => {
  const hasError =
     Boolean(errorDetail) ||
    transverseStates.includes('error') ||
    transverseStates.includes('empty') ||
    transverseStates.includes('storage-unavailable');

  return (
    <div style={{ marginBottom: '16px' }}>
      {/* Transverse active state badges */}
      <div
        aria-label="États transverses actifs du système"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '8px',
          marginBottom: message || errorDetail ? '10px' : '0',
        }}
      >
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          États actifs :
        </span>
        {transverseStates.map((st) => {
          const meta = STATE_LABELS[st];
          const isWarn = st === 'error' || st === 'empty' || st === 'storage-unavailable';
          const isOk = st === 'success' || st === 'revisited';
          return (
            <span
              key={st}
              data-testid={`transverse-state-${st}`}
              style={{
                fontSize: '0.78rem',
                fontWeight: 600,
                padding: '2px 10px',
                borderRadius: '999px',
                backgroundColor: isWarn
                  ? 'var(--archive-crimson-surface)'
                  : isOk
                    ? 'var(--archive-teal-surface)'
                    : 'var(--archive-midnight)',
                border: isWarn
                  ? '1px solid var(--archive-crimson)'
                  : isOk
                    ? '1px solid var(--archive-teal)'
                    : '1px solid var(--archive-midnight-border)',
                color: 'var(--text-light)',
              }}
            >
              <span aria-hidden="true">{meta.icon} </span>
              {meta.label}
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
                <span aria-hidden="true">⚠ Erreur : </span>
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
                {retryLabel}
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
                Fermer le message
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
