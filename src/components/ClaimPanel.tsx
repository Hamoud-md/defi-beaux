import React from 'react';
import { Claim, Source } from '../types/archive';
import { useI18n } from '../i18n/I18nContext';

interface ClaimPanelProps {
  claim: Claim;
  linkedSources: Source[];
  inspectedSourceIds: string[];
  onInspectSource: (sourceId: string) => void;
  highlightVariant?: 'default' | 'bridge-unlocked';
}

export const ClaimPanel: React.FC<ClaimPanelProps> = ({
  claim,
  linkedSources,
  inspectedSourceIds,
  onInspectSource,
  highlightVariant = 'default',
}) => {
  const { t } = useI18n();
  const allLinkedInspected = linkedSources.every((s) => inspectedSourceIds.includes(s.id));

  return (
    <article
      aria-labelledby={`claim-heading-${claim.id}`}
      data-testid={`claim-panel-${claim.id}`}
      style={{
        backgroundColor:
          highlightVariant === 'bridge-unlocked'
            ? 'rgba(58, 140, 121, 0.16)'
            : 'var(--archive-midnight)',
        border:
          highlightVariant === 'bridge-unlocked'
            ? '2px solid var(--archive-teal-bright)'
            : '1px solid var(--archive-midnight-border)',
        borderRadius: 'var(--radius-card)',
        padding: '18px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '12px',
      }}
    >
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '8px',
          }}
        >
          <span
            style={{
              backgroundColor: 'var(--archive-ink)',
              color: 'var(--archive-amber-bright)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '6px',
              border: '1px solid var(--archive-midnight-border)',
            }}
          >
            {claim.id}
          </span>

          <span
            style={{
              fontSize: '0.82rem',
              fontWeight: 600,
              color: allLinkedInspected ? 'var(--archive-teal-bright)' : 'var(--text-muted)',
            }}
          >
            {allLinkedInspected ? t('claim.sourcesInspected') : t('claim.sourcePending')}
          </span>
        </div>

        <h3
          id={`claim-heading-${claim.id}`}
          style={{
            fontSize: '1.25rem',
            margin: '0 0 6px 0',
            color: 'var(--text-light)',
          }}
        >
          {claim.title}
        </h3>

        <p
          style={{
            margin: '0 0 12px 0',
            fontSize: '1.02rem',
            fontWeight: 600,
            color: 'var(--text-light)',
          }}
        >
          {claim.statement}
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            backgroundColor: 'rgba(16, 26, 36, 0.6)',
            padding: '10px',
            borderRadius: '10px',
            fontSize: '0.85rem',
          }}
        >
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.76rem' }}>
              {t('claim.dateMentioned')}
            </span>
            <strong>{claim.yearLabel}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.76rem' }}>
              {t('claim.buildingMentioned')}
            </span>
            <strong>{claim.locationLabel}</strong>
          </div>
        </div>
      </div>

      {/* Linked sources actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {linkedSources.map((src) => {
          const inspected = inspectedSourceIds.includes(src.id);
          return (
            <div
              key={src.id}
              style={{
                backgroundColor: 'var(--archive-paper)',
                color: 'var(--text-ink)',
                padding: '10px 12px',
                borderRadius: '10px',
                fontSize: '0.88rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                <span>
                  {src.id} — {src.title}
                </span>
                <span>{src.date}</span>
              </div>
              <p style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '1.05rem' }}>
                {src.content}
              </p>
              <button
                type="button"
                onClick={() => onInspectSource(src.id)}
                data-testid={`claim-inspect-${src.id}`}
                style={{
                  alignSelf: 'flex-start',
                  backgroundColor: inspected ? '#235E51' : 'var(--text-ink)',
                  color: '#F7F4ED',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '5px 10px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {inspected
                  ? t('claim.inspectBtn.done', { id: src.id })
                  : t('claim.inspectBtn.pending', { id: src.id })}
              </button>
            </div>
          );
        })}
      </div>
    </article>
  );
};
