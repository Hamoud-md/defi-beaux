import React from 'react';
import { Source } from '../types/archive';
import { useI18n } from '../i18n/I18nContext';

interface EvidenceDetailProps {
  source: Source | null;
  isInspected: boolean;
  onClose?: () => void;
}

export const EvidenceDetail: React.FC<EvidenceDetailProps> = ({
  source,
  isInspected,
  onClose,
}) => {
  const { t } = useI18n();

  if (!source) {
    return null;
  }

  const scopeKey = `evidenceDetail.scope.${source.id}`;
  const translatedScope = t(scopeKey);

  return (
    <section
      aria-label={`Détail analytique de la pièce ${source.id}`}
      data-testid={`evidence-detail-${source.id}`}
      className="animate-entry"
      style={{
        backgroundColor: 'var(--archive-midnight)',
        border: '2px solid var(--archive-amber)',
        borderRadius: 'var(--radius-card)',
        padding: '18px 20px',
        marginTop: '16px',
        marginBottom: '20px',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            style={{
              backgroundColor: 'var(--archive-amber)',
              color: 'var(--archive-ink)',
              fontWeight: 700,
              fontSize: '0.82rem',
              padding: '3px 10px',
              borderRadius: '999px',
            }}
          >
            {t('evidenceDetail.badge')} • {source.id}
          </span>
          <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-light)' }}>
            {source.title} — {source.date}
          </h3>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            style={{
              backgroundColor: 'transparent',
              color: 'var(--text-light)',
              border: '1px solid var(--archive-midnight-border)',
              borderRadius: 'var(--radius-control)',
              padding: '4px 12px',
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            {t('evidenceDetail.close')}
          </button>
        )}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '12px',
          fontSize: '0.92rem',
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(16, 26, 36, 0.65)',
            padding: '12px',
            borderRadius: '10px',
            border: '1px solid var(--archive-midnight-border)',
          }}
        >
          <strong style={{ color: 'var(--archive-amber-bright)', display: 'block' }}>
            {t('evidenceDetail.mentions')}
          </strong>
          <p style={{ margin: '6px 0 0 0' }}>{source.content}</p>
          <p style={{ margin: '6px 0 0 0', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
            {t('evidenceDetail.citedPlace')} <strong>{source.buildingMentioned}</strong> ({source.date})
          </p>
        </div>

        <div
          style={{
            backgroundColor: 'rgba(16, 26, 36, 0.65)',
            padding: '12px',
            borderRadius: '10px',
            border: '1px solid var(--archive-midnight-border)',
          }}
        >
          <strong style={{ color: 'var(--archive-teal-bright)', display: 'block' }}>
            {t('evidenceDetail.scope')}
          </strong>
          <p style={{ margin: '6px 0 0 0' }}>{translatedScope}</p>
          <p style={{ margin: '6px 0 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            {t('status.initial').split(':')[0]} :{' '}
            {isInspected ? t('evidenceDetail.stateInspected') : t('evidenceDetail.statePending')} • {t('badge.fictional')}
          </p>
        </div>
      </div>
    </section>
  );
};
