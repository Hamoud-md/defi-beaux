import React, { useState } from 'react';
import {
  ArchiveDataset,
  EvidenceRelationType,
  Hypothesis,
} from '../types/archive';
import { useI18n } from '../i18n/I18nContext';

interface HypothesisStateProps {
  dataset: ArchiveDataset;
  inspectedSourceIds: string[];
  exploredQuestionIds: string[];
  evaluatedRelationIds: string[];
  onEvaluateRelation: (relationId: string) => void;
  onInspectSource: (sourceId: string) => void;
  onProceedToConclusion: () => void;
}

export const HypothesisState: React.FC<HypothesisStateProps> = ({
  dataset,
  inspectedSourceIds,
  exploredQuestionIds,
  evaluatedRelationIds,
  onEvaluateRelation,
  onInspectSource,
  onProceedToConclusion,
}) => {
  const { t } = useI18n();
  const [filterType, setFilterType] = useState<EvidenceRelationType | 'ALL'>('ALL');
  const isS003Unlocked = exploredQuestionIds.includes('Q001');

  const visibleRelations = dataset.relations.filter((rel) => {
    if (filterType !== 'ALL' && rel.relationType !== filterType) {
      return false;
    }
    return true;
  });

  const getHypothesisBadge = (h: Hypothesis) => {
    if (h.status === 'plausible') {
      return { text: t('hypothesis.badge.plausible'), bg: '#235E51' };
    }
    if (h.status === 'challenged') {
      return { text: t('hypothesis.badge.challenged'), bg: '#7A2E2E' };
    }
    return { text: t('hypothesis.badge.open'), bg: '#5A4628' };
  };

  const relationTypeMeta: Record<
    EvidenceRelationType,
    { badgeLabel: string; description: string; color: string; bg: string }
  > = {
    supports: {
      badgeLabel: t('hypothesis.rel.supports'),
      description: t('hypothesis.rel.supports.desc'),
      color: 'var(--archive-teal-bright)',
      bg: 'var(--archive-teal-surface)',
    },
    challenges: {
      badgeLabel: t('hypothesis.rel.challenges'),
      description: t('hypothesis.rel.challenges.desc'),
      color: 'var(--archive-crimson)',
      bg: 'var(--archive-crimson-surface)',
    },
    insufficient: {
      badgeLabel: t('hypothesis.rel.insufficient'),
      description: t('hypothesis.rel.insufficient.desc'),
      color: 'var(--archive-amber-bright)',
      bg: 'var(--archive-amber-surface)',
    },
    unrelated: {
      badgeLabel: t('hypothesis.rel.unrelated'),
      description: t('hypothesis.rel.unrelated.desc'),
      color: 'var(--text-muted)',
      bg: 'rgba(32, 53, 73, 0.65)',
    },
  };

  return (
    <section
      aria-labelledby="hypothesis-reasoning-heading"
      data-testid="hypothesis-state-section"
      className="animate-entry"
    >
      <div style={{ marginBottom: '20px' }}>
        <h2
          id="hypothesis-reasoning-heading"
          style={{ fontSize: '1.75rem', margin: '0 0 8px 0', color: 'var(--text-light)' }}
        >
          {t('hypothesis.title')}
        </h2>
        <p style={{ margin: 0, color: 'var(--text-muted)' }}>
          {t('hypothesis.subtitle')}
        </p>
      </div>

      {!isS003Unlocked && (
        <div
          role="alert"
          style={{
            backgroundColor: 'var(--archive-amber-surface)',
            border: '2px solid var(--archive-amber)',
            borderRadius: 'var(--radius-control)',
            padding: '14px 16px',
            marginBottom: '20px',
          }}
        >
          <strong>{t('hypothesis.needQ001')}</strong> {t('hypothesis.needQ001.text')}
        </div>
      )}

      {/* Legend of the 4 EvidenceRelation types (F05 requirement) */}
      <div
        aria-label={t('hypothesis.legendTitle')}
        style={{
          backgroundColor: 'var(--archive-ink-elevated)',
          border: '1px solid var(--archive-midnight-border)',
          borderRadius: 'var(--radius-card)',
          padding: '16px',
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
            marginBottom: '12px',
          }}
        >
          <strong style={{ fontSize: '0.95rem' }}>
            {t('hypothesis.legendTitle')}
          </strong>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            <button
              type="button"
              onClick={() => setFilterType('ALL')}
              aria-pressed={filterType === 'ALL'}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                border: '1px solid var(--archive-midnight-border)',
                backgroundColor:
                  filterType === 'ALL' ? 'var(--archive-amber)' : 'var(--archive-midnight)',
                color: filterType === 'ALL' ? 'var(--archive-ink)' : 'var(--text-light)',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
            >
              {t('hypothesis.filterAll', { n: dataset.relations.length })}
            </button>
            {(['supports', 'challenges', 'insufficient', 'unrelated'] as EvidenceRelationType[]).map(
              (tKey) => (
                <button
                  key={tKey}
                  type="button"
                  onClick={() => setFilterType(tKey)}
                  aria-pressed={filterType === tKey}
                  data-testid={`filter-relation-${tKey}`}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: '1px solid var(--archive-midnight-border)',
                    backgroundColor:
                      filterType === tKey ? 'var(--archive-amber)' : 'var(--archive-midnight)',
                    color: filterType === tKey ? 'var(--archive-ink)' : 'var(--text-light)',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  {tKey}
                </button>
              )
            )}
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '10px',
          }}
        >
          {(
            Object.entries(relationTypeMeta) as [
              EvidenceRelationType,
              (typeof relationTypeMeta)[EvidenceRelationType],
            ][]
          ).map(([key, meta]) => (
            <div
              key={key}
              data-testid={`relation-legend-${key}`}
              style={{
                backgroundColor: meta.bg,
                border: `1px solid ${meta.color}`,
                borderRadius: '8px',
                padding: '10px',
                fontSize: '0.82rem',
              }}
            >
              <strong style={{ color: meta.color, display: 'block', marginBottom: '4px' }}>
                {meta.badgeLabel}
              </strong>
              <span style={{ color: 'var(--text-light)' }}>{meta.description}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Hypotheses Overview Cards (H001, H002, H003) */}
      <h3 style={{ fontSize: '1.35rem', marginBottom: '12px' }}>
        {t('hypothesis.stateTitle')}
      </h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        {dataset.hypotheses.map((hyp) => {
          const badge = getHypothesisBadge(hyp);
          return (
            <article
              key={hyp.id}
              data-testid={`hypothesis-card-${hyp.id}`}
              style={{
                backgroundColor: 'var(--archive-midnight)',
                border: '1px solid var(--archive-midnight-border)',
                borderRadius: 'var(--radius-card)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '10px',
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
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      color: 'var(--archive-amber-bright)',
                    }}
                  >
                    {hyp.code}
                  </span>
                  <span
                    style={{
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '999px',
                      backgroundColor: badge.bg,
                      color: '#F7F4ED',
                    }}
                  >
                    {badge.text}
                  </span>
                </div>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '1.15rem' }}>{hyp.title}</h4>
                <p style={{ margin: '0 0 10px 0', fontSize: '0.92rem', color: 'var(--text-light)' }}>
                  {hyp.text}
                </p>
              </div>
              <div
                style={{
                  backgroundColor: 'rgba(16, 26, 36, 0.65)',
                  padding: '10px',
                  borderRadius: '8px',
                  fontSize: '0.84rem',
                  color: 'var(--text-muted)',
                }}
              >
                <strong>{t('hypothesis.nuance')}</strong> {hyp.epistemicNote}
              </div>
            </article>
          );
        })}
      </div>

      {/* Evidence Relations Evaluation List (ER001–ER005) */}
      <h3 style={{ fontSize: '1.35rem', marginBottom: '12px' }}>
        {t('hypothesis.relEvalTitle')}
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
        {visibleRelations.map((rel) => {
          const source = dataset.sources.find((s) => s.id === rel.sourceId);
          const hypothesis = dataset.hypotheses.find((h) => h.id === rel.hypothesisId);
          const meta = relationTypeMeta[rel.relationType];
          const isEvaluated = evaluatedRelationIds.includes(rel.id);
          const isSourceRead = inspectedSourceIds.includes(rel.sourceId);

          return (
            <div
              key={rel.id}
              data-testid={`evidence-relation-${rel.id}`}
              style={{
                backgroundColor: 'var(--archive-ink-elevated)',
                border: isEvaluated
                  ? `2px solid ${meta.color}`
                  : '1px solid var(--archive-midnight-border)',
                borderRadius: 'var(--radius-card)',
                padding: '16px',
                transition: 'border-color var(--motion-m05)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '8px',
                }}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: 'var(--text-muted)',
                    }}
                  >
                    [{rel.id}]
                  </span>
                  <strong>
                    {source?.title} ({source?.date})
                  </strong>
                  <span
                    style={{
                      backgroundColor: meta.bg,
                      border: `1px solid ${meta.color}`,
                      color: 'var(--text-light)',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      padding: '2px 10px',
                      borderRadius: '999px',
                    }}
                  >
                    {rel.relationLabel}
                  </span>
                  <strong>
                    → {hypothesis?.title}
                  </strong>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {!isSourceRead && (
                    <button
                      type="button"
                      onClick={() => onInspectSource(rel.sourceId)}
                      style={{
                        backgroundColor: 'var(--archive-midnight)',
                        color: 'var(--text-light)',
                        border: '1px solid var(--archive-midnight-border)',
                        borderRadius: '6px',
                        padding: '5px 10px',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                      }}
                    >
                      {t('hypothesis.readSource', { id: rel.sourceId })}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      if (!isSourceRead) {
                        onInspectSource(rel.sourceId);
                      }
                      onEvaluateRelation(rel.id);
                    }}
                    aria-pressed={isEvaluated}
                    data-testid={`evaluate-relation-btn-${rel.id}`}
                    style={{
                      backgroundColor: isEvaluated
                        ? 'var(--archive-teal)'
                        : 'var(--archive-amber)',
                      color: isEvaluated ? 'var(--text-light)' : 'var(--archive-ink)',
                      border: 'none',
                      borderRadius: 'var(--radius-control)',
                      padding: '6px 14px',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                    }}
                  >
                    {isEvaluated ? t('hypothesis.evalBtn.done') : t('hypothesis.evalBtn.pending')}
                  </button>
                </div>
              </div>

              <p style={{ margin: 0, fontSize: '0.94rem', color: 'var(--text-light)' }}>
                <strong>{t('hypothesis.rationale')}</strong> {rel.rationale}
              </p>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={onProceedToConclusion}
          data-testid="proceed-to-s05-btn"
          style={{
            backgroundColor: 'var(--archive-amber)',
            color: 'var(--archive-ink)',
            fontWeight: 700,
            fontSize: '1rem',
            padding: '12px 22px',
            borderRadius: 'var(--radius-control)',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {t('hypothesis.proceedS05')}
        </button>
      </div>
    </section>
  );
};
