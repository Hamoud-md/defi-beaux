import React from 'react';
import {
  ArchiveDataset,
  InteractionMode,
  Source,
} from '../types/archive';
import { ClaimPanel } from './ClaimPanel';
import { ResearchQuestion } from './ResearchQuestion';
import { EvidenceDocument } from './EvidenceDocument';

interface MissingBridgeProps {
  dataset: ArchiveDataset;
  inspectedSourceIds: string[];
  selectedQuestionId: string | null;
  exploredQuestionIds: string[];
  interactionMode: InteractionMode;
  onSelectQuestion: (questionId: string) => void;
  onInspectSource: (sourceId: string) => void;
  onProceedToAnalysis: () => void;
}

export const MissingBridge: React.FC<MissingBridgeProps> = ({
  dataset,
  inspectedSourceIds,
  selectedQuestionId,
  exploredQuestionIds,
  interactionMode,
  onSelectQuestion,
  onInspectSource,
  onProceedToAnalysis,
}) => {
  const claim1 = dataset.claims.find((c) => c.id === 'CL001');
  const claim2 = dataset.claims.find((c) => c.id === 'CL002');
  const claim3 = dataset.claims.find((c) => c.id === 'CL003');
  const source3 = dataset.sources.find((s) => s.id === 'S003');

  const activeQuestion = dataset.questions.find((q) => q.id === selectedQuestionId) ?? null;
  const isS003Unlocked =
    selectedQuestionId === 'Q001' || exploredQuestionIds.includes('Q001');

  const getSourcesForClaim = (sourceIds: string[]): Source[] =>
    dataset.sources.filter((s) => sourceIds.includes(s.id));

  const getBridgeStatusText = (): string => {
    if (!activeQuestion) {
      return 'Liaison ouverte : Question non résolue entre 1920 (Vieille tour) et 1922 (Nouvelle tour). Choisissez quelle information manque pour expliquer cet écart.';
    }
    if (activeQuestion.id === 'Q001') {
      return 'Pont documentaire activé (Q001) : Le registre S003 (12/09/1921) documente un transfert de la vieille tour vers la nouvelle tour. Cause → effet : indice S003 révélé.';
    }
    if (activeQuestion.id === 'Q002') {
      return 'Liaison non résolue (Q002) : Le constructeur de l’horloge n’explique pas directement pourquoi deux tours et deux dates différentes apparaissent.';
    }
    return 'Liaison en incertitude (Q003) : Piste intéressante sur la mémoire des habitants, mais données insuffisantes dans le corpus.';
  };

  return (
    <section
      aria-labelledby="missing-bridge-heading"
      data-testid="missing-bridge-section"
      className="animate-entry"
    >
      {/* Permanent comparative summary (Desktop & Mobile requirement Section 5) */}
      <div
        data-testid="permanent-comparative-summary"
        style={{
          backgroundColor: 'var(--archive-ink-elevated)',
          border: '1px solid var(--archive-midnight-border)',
          borderRadius: 'var(--radius-card)',
          padding: '14px 18px',
          marginBottom: '18px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <div>
          <span
            style={{
              fontSize: '0.78rem',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--archive-amber-bright)',
              fontWeight: 700,
              display: 'block',
            }}
          >
            Résumé comparatif permanent • Écart observé
          </span>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.95rem', color: 'var(--text-light)' }}>
            <strong>S001 (15/06/1920)</strong> : Inauguration sur la <em>vieille tour</em>{' '}
            <span aria-hidden="true">⟷</span> <strong>S002 (04/05/1922)</strong> : Première
            découverte sur la <em>nouvelle tour</em>.
          </p>
        </div>

        <div
          style={{
            padding: '6px 12px',
            borderRadius: '999px',
            backgroundColor: isS003Unlocked
              ? 'var(--archive-teal-surface)'
              : 'var(--archive-amber-surface)',
            border: isS003Unlocked
              ? '1px solid var(--archive-teal-bright)'
              : '1px solid var(--archive-amber)',
            fontSize: '0.84rem',
            fontWeight: 700,
          }}
        >
          {isS003Unlocked
            ? '✓ Indice intermédiaire S003 (1921) déverrouillé'
            : '? Indice intermédiaire manquant'}
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <h2
          id="missing-bridge-heading"
          style={{ fontSize: '1.75rem', margin: '0 0 6px 0', color: 'var(--text-light)' }}
        >
          {interactionMode === 'missing-bridge'
            ? 'Signature Interaction — The Missing Bridge (Le Pont Manquant)'
            : 'Mode Fallback — Comparaison Guidée Classique (Baseline A23)'}
        </h2>
        <p style={{ margin: 0, color: 'var(--text-muted)' }}>
          Plutôt que de deviner « 1920 ou 1922 ? », identifiez <strong>quelle question de recherche</strong>{' '}
          permet d’expliquer l’écart entre les deux affirmations.
        </p>
      </div>

      {/* Accessible Causal Status Banner (F03 / M03 / A04) */}
      <div
        role="status"
        aria-live="polite"
        data-testid="missing-bridge-status"
        style={{
          backgroundColor:
            activeQuestion?.id === 'Q001'
              ? 'var(--archive-teal-surface)'
              : 'var(--archive-amber-surface)',
          border:
            activeQuestion?.id === 'Q001'
              ? '2px solid var(--archive-teal-bright)'
              : '2px solid var(--archive-amber)',
          borderRadius: 'var(--radius-control)',
          padding: '14px 16px',
          marginBottom: '20px',
          transition: 'background-color var(--motion-m03), border-color var(--motion-m03)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <strong style={{ fontSize: '1rem', color: 'var(--text-light)' }}>
            {getBridgeStatusText()}
          </strong>
          <span
            style={{
              fontSize: '0.8rem',
              fontFamily: 'var(--font-mono)',
              padding: '2px 8px',
              borderRadius: '6px',
              backgroundColor: 'var(--archive-ink)',
            }}
          >
            Piste active : {selectedQuestionId ?? 'Aucune'}
          </span>
        </div>
      </div>

      {interactionMode === 'missing-bridge' ? (
        /* Desktop 3-column / Mobile stacked Signature Missing Bridge Layout */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '18px',
            alignItems: 'stretch',
            marginBottom: '24px',
          }}
        >
          {/* Left Claim: CL001 (1920) */}
          {claim1 && (
            <ClaimPanel
              claim={claim1}
              linkedSources={getSourcesForClaim(claim1.sourceIds)}
              inspectedSourceIds={inspectedSourceIds}
              onInspectSource={onInspectSource}
            />
          )}

          {/* Center Bridge: Unresolved Question Connector */}
          <div
            data-testid="bridge-connector-column"
            style={{
              backgroundColor: 'var(--archive-ink-elevated)',
              border:
                selectedQuestionId === 'Q001'
                  ? '2px solid var(--archive-teal-bright)'
                  : '2px dashed var(--archive-amber)',
              borderRadius: 'var(--radius-card)',
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '14px',
              transition: 'border-color var(--motion-m03)',
            }}
          >
            <div>
              <div
                style={{
                  textAlign: 'center',
                  padding: '8px 12px',
                  backgroundColor: 'var(--archive-midnight)',
                  borderRadius: '10px',
                  marginBottom: '12px',
                }}
              >
                <span
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color:
                      selectedQuestionId === 'Q001'
                        ? 'var(--archive-teal-bright)'
                        : 'var(--archive-amber-bright)',
                  }}
                >
                  {selectedQuestionId === 'Q001'
                    ? '✓ Liaison établie (1920 → 1921 → 1922)'
                    : '? Question non résolue entre CL001 et CL002'}
                </span>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.88rem', color: 'var(--text-light)' }}>
                  Quelle information manque pour expliquer cet écart ?
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {dataset.questions.map((q) => (
                  <ResearchQuestion
                    key={q.id}
                    question={q}
                    isSelected={selectedQuestionId === q.id}
                    wasExplored={exploredQuestionIds.includes(q.id)}
                    onSelect={onSelectQuestion}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Claim: CL002 (1922) */}
          {claim2 && (
            <ClaimPanel
              claim={claim2}
              linkedSources={getSourcesForClaim(claim2.sourceIds)}
              inspectedSourceIds={inspectedSourceIds}
              onInspectSource={onInspectSource}
            />
          )}
        </div>
      ) : (
        /* Guided Comparison Classical Baseline (Fallback Section 4.2 & A23) */
        <div
          data-testid="guided-baseline-container"
          style={{
            backgroundColor: 'var(--archive-ink-elevated)',
            border: '1px solid var(--archive-midnight-border)',
            borderRadius: 'var(--radius-card)',
            padding: '20px',
            marginBottom: '24px',
          }}
        >
          <p style={{ marginTop: 0, color: 'var(--text-muted)' }}>
            <strong>Mode Comparaison Guidée (Fallback) :</strong> Présentation séquentielle des
            deux affirmations et des trois questions de recherche avec les mêmes exigences de preuve.
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px',
              marginBottom: '18px',
            }}
          >
            {claim1 && (
              <ClaimPanel
                claim={claim1}
                linkedSources={getSourcesForClaim(claim1.sourceIds)}
                inspectedSourceIds={inspectedSourceIds}
                onInspectSource={onInspectSource}
              />
            )}
            {claim2 && (
              <ClaimPanel
                claim={claim2}
                linkedSources={getSourcesForClaim(claim2.sourceIds)}
                inspectedSourceIds={inspectedSourceIds}
                onInspectSource={onInspectSource}
              />
            )}
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>
            Sélectionnez une question de recherche :
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '12px',
            }}
          >
            {dataset.questions.map((q) => (
              <ResearchQuestion
                key={q.id}
                question={q}
                isSelected={selectedQuestionId === q.id}
                wasExplored={exploredQuestionIds.includes(q.id)}
                onSelect={onSelectQuestion}
              />
            ))}
          </div>
        </div>
      )}

      {/* M04 / F04 / A05: Revealed 3rd Clue S003 & Claim CL003 in immediate proximity when Q001 is selected/explored */}
      {isS003Unlocked && source3 && claim3 && (
        <div
          data-testid="revealed-s003-container"
          className="animate-clue-reveal"
          style={{
            backgroundColor: 'rgba(58, 140, 121, 0.14)',
            border: '2px solid var(--archive-teal-bright)',
            borderRadius: 'var(--radius-card)',
            padding: '20px',
            marginTop: '12px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px',
            }}
          >
            <div>
              <span
                style={{
                  backgroundColor: 'var(--archive-teal)',
                  color: 'var(--text-light)',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  padding: '3px 10px',
                  borderRadius: '999px',
                  display: 'inline-block',
                  marginBottom: '6px',
                }}
              >
                ✓ Nouvel indice révélé par la question Q001
              </span>
              <h3 style={{ margin: 0, fontSize: '1.45rem', color: 'var(--text-light)' }}>
                Pièce intermédiaire découverte : {source3.id} — {source3.title} ({source3.date})
              </h3>
            </div>

            <button
              type="button"
              onClick={() => {
                onInspectSource('S003');
                onProceedToAnalysis();
              }}
              data-testid="proceed-to-s04-btn"
              style={{
                backgroundColor: 'var(--archive-amber)',
                color: 'var(--archive-ink)',
                fontWeight: 700,
                padding: '10px 18px',
                borderRadius: 'var(--radius-control)',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.95rem',
              }}
            >
              Analyser la portée de S003 et les hypothèses (Étape S04) →
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '18px',
              alignItems: 'start',
            }}
          >
            <EvidenceDocument
              source={source3}
              isInspected={inspectedSourceIds.includes(source3.id)}
              onInspect={onInspectSource}
            />
            <ClaimPanel
              claim={claim3}
              linkedSources={[source3]}
              inspectedSourceIds={inspectedSourceIds}
              onInspectSource={onInspectSource}
              highlightVariant="bridge-unlocked"
            />
          </div>
        </div>
      )}
    </section>
  );
};
