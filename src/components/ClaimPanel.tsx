import React from 'react';
import { Claim, Source } from '../types/archive';
import { useI18n } from '../i18n/I18nContext';
import { stripRefCode } from '../utils/labels';

interface ClaimPanelProps {
  claim: Claim;
  linkedSources: Source[];
  inspectedSourceIds: string[];
  onInspectSource: (sourceId: string) => void;
  highlightVariant?: 'default' | 'bridge-unlocked';
  /** Human badge shown instead of the internal claim id (e.g. "Affirmation A"). */
  badgeLabel?: string;
  /** Visual state of the card — also rendered as a labelled chip. */
  state?: 'neutral' | 'selected' | 'locked' | 'revealed' | 'weak';
}

export const ClaimPanel: React.FC<ClaimPanelProps> = ({
  claim,
  linkedSources,
  inspectedSourceIds,
  onInspectSource,
  highlightVariant = 'default',
  badgeLabel,
  state,
}) => {
  const { t } = useI18n();
  const allLinkedInspected = linkedSources.every((s) => inspectedSourceIds.includes(s.id));
  const resolvedState: ClaimPanelProps['state'] =
    state ?? (highlightVariant === 'bridge-unlocked' ? 'revealed' : 'neutral');

  const stateChip = (() => {
    switch (resolvedState) {
      case 'selected':
        return { tone: 'selected' as const, icon: '◈', label: t('card.state.selected') };
      case 'locked':
        return { tone: 'locked' as const, icon: '🔒', label: t('card.state.locked') };
      case 'revealed':
        return { tone: 'revealed' as const, icon: '✦', label: t('card.state.revealed') };
      case 'weak':
        return { tone: 'weak' as const, icon: '◇', label: t('card.state.weak') };
      default:
        return { tone: 'neutral' as const, icon: '○', label: t('card.state.neutral') };
    }
  })();

  return (
    <article
      aria-labelledby={`claim-heading-${claim.id}`}
      data-testid={`claim-panel-${claim.id}`}
      data-state={resolvedState}
      className="archive-card"
      style={{
        padding: '18px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '14px',
      }}
    >
      <div>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '10px',
          }}
        >
          <span
            style={{
              backgroundColor: 'rgba(224, 167, 95, 0.14)',
              color: 'var(--archive-amber-bright)',
              fontSize: '0.74rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '3px 10px',
              borderRadius: '999px',
              border: '1px solid rgba(224, 167, 95, 0.4)',
            }}
          >
            {badgeLabel ?? t('claim.genericLabel')}
          </span>

          <span className="state-chip" data-tone={stateChip.tone}>
            <span aria-hidden="true">{stateChip.icon}</span>
            {stateChip.label}
          </span>
        </div>

        <h3
          id={`claim-heading-${claim.id}`}
          style={{
            fontSize: '1.28rem',
            margin: '0 0 8px 0',
            color: 'var(--text-light)',
          }}
        >
          {claim.title}
        </h3>

        <p
          style={{
            margin: '0 0 14px 0',
            fontSize: '1.04rem',
            fontWeight: 600,
            color: 'var(--text-light)',
            fontFamily: 'var(--font-serif)',
          }}
        >
          {stripRefCode(claim.statement)}
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
            backgroundColor: 'rgba(7, 12, 20, 0.62)',
            padding: '12px',
            borderRadius: '10px',
            fontSize: '0.85rem',
          }}
        >
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.74rem' }}>
              {t('claim.dateMentioned')}
            </span>
            <strong>{claim.yearLabel}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.74rem' }}>
              {t('claim.buildingMentioned')}
            </span>
            <strong>{claim.locationLabel}</strong>
          </div>
        </div>

        <p
          style={{
            margin: '10px 0 0 0',
            fontSize: '0.82rem',
            fontWeight: 600,
            color: allLinkedInspected ? 'var(--archive-teal-bright)' : 'var(--text-muted)',
          }}
        >
          {allLinkedInspected ? t('claim.sourcesInspected') : t('claim.sourcePending')}
        </p>
      </div>

      {/* Linked sources — readable titles, internal ids stay out of sight */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {linkedSources.map((src) => {
          const inspected = inspectedSourceIds.includes(src.id);
          return (
            <div
              key={src.id}
              style={{
                backgroundColor: 'var(--archive-paper)',
                color: 'var(--text-ink)',
                padding: '12px',
                borderRadius: '10px',
                fontSize: '0.88rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.35)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  gap: '6px',
                  fontWeight: 700,
                }}
              >
                <span>{src.title}</span>
                <span style={{ fontWeight: 600, opacity: 0.8 }}>{src.date}</span>
              </div>
              <p style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '1.02rem' }}>
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
                {inspected ? t('claim.inspectBtn.done') : t('claim.inspectBtn.pending')}
              </button>
            </div>
          );
        })}
      </div>
    </article>
  );
};
