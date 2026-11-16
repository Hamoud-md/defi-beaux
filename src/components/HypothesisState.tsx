import React, { useState } from 'react';
import {
  ArchiveDataset,
  EvidenceRelationType,
  Hypothesis,
} from '../types/archive';

interface HypothesisStateProps {
  dataset: ArchiveDataset;
  inspectedSourceIds: string[];
  exploredQuestionIds: string[];
  evaluatedRelationIds: string[];
  onEvaluateRelation: (relationId: string) => void;
  onInspectSource: (sourceId: string) => void;
  onProceedToConclusion: () => void;
}

const RELATION_TYPE_META: Record<
  EvidenceRelationType,
  { badgeLabel: string; description: string; color: string; bg: string }
> = {
  supports: {
    badgeLabel: 'supports (Soutient)',
    description:
      'La pièce apporte un élément matériel ou chronologique compatible avec l’hypothèse, sans nécessairement tout démontrer à elle seule.',
    color: 'var(--archive-teal-bright)',
    bg: 'var(--archive-teal-surface)',
  },
  challenges: {
    badgeLabel: 'challenges (Met en difficulté)',
    description:
      'La pièce contredit directement un présupposé de l’hypothèse (par exemple l’unicité de lieu ou d’événement).',
    color: 'var(--archive-crimson)',
    bg: 'var(--archive-crimson-surface)',
  },
  insufficient: {
    badgeLabel: 'insufficient (Preuve insuffisante)',
    description:
      'La pièce est authentique dans le dossier mais ne contient pas assez d’informations pour prouver une généralisation.',
    color: 'var(--archive-amber-bright)',
    bg: 'var(--archive-amber-surface)',
  },
  unrelated: {
    badgeLabel: 'unrelated (Sans lien probant autonome)',
    description:
      'Prise isolément, la pièce ne permet ni d’appuyer ni de réfuter l’affirmation visée.',
    color: 'var(--text-muted)',
    bg: 'rgba(32, 53, 73, 0.65)',
  },
};

export const HypothesisState: React.FC<HypothesisStateProps> = ({
  dataset,
  inspectedSourceIds,
  exploredQuestionIds,
  evaluatedRelationIds,
  onEvaluateRelation,
  onInspectSource,
  onProceedToConclusion,
}) => {
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
      return { text: 'Hypothèse plausible (non absolue)', bg: '#235E51' };
    }
    if (h.status === 'challenged') {
      return { text: 'Hypothèse contredite par S003', bg: '#7A2E2E' };
    }
    return { text: 'Prudence épistémique maintenue', bg: '#5A4628' };
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
          Raisonnement sur preuves — Portée et limites des indices (F05)
        </h2>
        <p style={{ margin: 0, color: 'var(--text-muted)' }}>
          Examinez comment chaque archive se rapporte aux hypothèses{' '}
          <strong>H001</strong>, <strong>H002</strong> et <strong>H003</strong>. Une preuve peut
          soutenir une piste tout en restant insuffisante pour certifier tous les témoignages.
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
          <strong>Note d’enquête :</strong> Vous n’avez pas encore activé la question pertinente{' '}
          <code>Q001</code> sur le <em>Missing Bridge</em>. Certaines relations impliquant le
          registre <code>S003</code> nécessitent d’ouvrir cette piste.
        </div>
      )}

      {/* Legend of the 4 EvidenceRelation types (F05 requirement) */}
      <div
        aria-label="Lexique des 4 types de relations documentaires"
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
            Qualification des relations preuve / hypothèse (F05) :
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
              Toutes ({dataset.relations.length})
            </button>
            {(['supports', 'challenges', 'insufficient', 'unrelated'] as EvidenceRelationType[]).map(
              (t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFilterType(t)}
                  aria-pressed={filterType === t}
                  data-testid={`filter-relation-${t}`}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: '1px solid var(--archive-midnight-border)',
                    backgroundColor:
                      filterType === t ? 'var(--archive-amber)' : 'var(--archive-midnight)',
                    color: filterType === t ? 'var(--archive-ink)' : 'var(--text-light)',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  {t}
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
            Object.entries(RELATION_TYPE_META) as [
              EvidenceRelationType,
              (typeof RELATION_TYPE_META)[EvidenceRelationType],
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
        État des hypothèses du dossier C001
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
                <strong>Nuance :</strong> {hyp.epistemicNote}
              </div>
            </article>
          );
        })}
      </div>

      {/* Evidence Relations Evaluation List (ER001–ER005) */}
      <h3 style={{ fontSize: '1.35rem', marginBottom: '12px' }}>
        Évaluation détaillée des relations Preuve ↔ Hypothèse
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
        {visibleRelations.map((rel) => {
          const source = dataset.sources.find((s) => s.id === rel.sourceId);
          const hypothesis = dataset.hypotheses.find((h) => h.id === rel.hypothesisId);
          const meta = RELATION_TYPE_META[rel.relationType];
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
                    Source {rel.sourceId} ({source?.title}, {source?.date})
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
                    → {rel.hypothesisId} ({hypothesis?.title})
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
                      Lire {rel.sourceId}
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
                    {isEvaluated ? '✓ Relation validée dans l’analyse' : 'Retenir cette analyse'}
                  </button>
                </div>
              </div>

              <p style={{ margin: 0, fontSize: '0.94rem', color: 'var(--text-light)' }}>
                <strong>Justification analytique :</strong> {rel.rationale}
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
          Formuler la conclusion motivée (Étape S05) →
        </button>
      </div>
    </section>
  );
};
