import React, { useState } from 'react';
import { Source } from '../types/archive';
import { EvidenceDocument } from './EvidenceDocument';
import { EvidenceDetail } from './EvidenceDetail';

interface ComparisonViewProps {
  sources: Source[];
  inspectedSourceIds: string[];
  onInspectSource: (sourceId: string) => void;
  onProceedToBridge: () => void;
  onBackToDiscovery: () => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  sources,
  inspectedSourceIds,
  onInspectSource,
  onProceedToBridge,
  onBackToDiscovery,
}) => {
  const [activeDetailId, setActiveDetailId] = useState<string | null>(null);

  const s001 = sources.find((s) => s.id === 'S001') ?? null;
  const s002 = sources.find((s) => s.id === 'S002') ?? null;

  const bothInspected =
    inspectedSourceIds.includes('S001') && inspectedSourceIds.includes('S002');

  const handleInspect = (sourceId: string) => {
    onInspectSource(sourceId);
    setActiveDetailId(sourceId);
  };

  const activeSourceForDetail = sources.find((s) => s.id === activeDetailId) ?? null;

  return (
    <section
      aria-labelledby="comparison-title"
      data-testid="comparison-view-section"
      className="animate-entry"
      style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
    >
      {/* Header and Discrepancy Framing */}
      <div>
        <h2
          id="comparison-title"
          style={{ fontSize: '1.75rem', margin: '0 0 8px 0', color: 'var(--text-light)' }}
        >
          Étape S02 — Comparaison des deux documents initiaux
        </h2>
        <p style={{ margin: 0, color: 'var(--text-muted)' }}>
          Examinez les deux pièces archivistiques conservées à la mairie de Memoria. Observez leurs
          dates, leurs cotes et les édifices mentionnés.
        </p>
      </div>

      {/* Discrepancy Callout Banner */}
      <div
        role="region"
        aria-label="Contradiction apparente entre S001 et S002"
        style={{
          backgroundColor: 'rgba(197, 138, 69, 0.14)',
          border: '2px solid var(--archive-amber)',
          borderRadius: 'var(--radius-card)',
          padding: '18px 22px',
        }}
      >
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
          <strong
            style={{
              fontSize: '1.05rem',
              color: 'var(--archive-amber-bright)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>⚖</span> La contradiction apparente à examiner :
          </strong>
          <span
            style={{
              fontSize: '0.82rem',
              padding: '3px 10px',
              borderRadius: '999px',
              backgroundColor: bothInspected
                ? 'var(--archive-teal-surface)'
                : 'var(--archive-midnight)',
              border: bothInspected
                ? '1px solid var(--archive-teal-bright)'
                : '1px solid var(--archive-midnight-border)',
              color: bothInspected ? 'var(--text-light)' : 'var(--text-muted)',
              fontWeight: 600,
            }}
          >
            {bothInspected
              ? '✓ 2/2 sources initiales examinées'
              : `○ ${inspectedSourceIds.filter((id) => id === 'S001' || id === 'S002').length}/2 sources consultées`}
          </span>
        </div>

        <p style={{ margin: 0, fontSize: '0.96rem', color: 'var(--text-light)', lineHeight: 1.5 }}>
          D’un côté, la <strong>Lettre municipale (S001)</strong> évoque une inauguration le{' '}
          <strong>15 juin 1920</strong> sur la <em>vieille tour</em>. De l'autre, le{' '}
          <strong>Journal local (S002)</strong> relate que les citoyens découvrent pour la première
          fois l’horloge le <strong>4 mai 1922</strong> sur la <em>nouvelle tour</em>.
        </p>
      </div>

      {/* Two Claim Comparison Cards side-by-side */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px',
          alignItems: 'stretch',
        }}
      >
        {s001 && (
          <EvidenceDocument
            source={s001}
            isInspected={inspectedSourceIds.includes(s001.id)}
            isFocusedDetail={activeDetailId === s001.id}
            onInspect={handleInspect}
          />
        )}

        {s002 && (
          <EvidenceDocument
            source={s002}
            isInspected={inspectedSourceIds.includes(s002.id)}
            isFocusedDetail={activeDetailId === s002.id}
            onInspect={handleInspect}
          />
        )}
      </div>

      {/* Active Detailed Inspection Drawer / Panel */}
      {activeSourceForDetail && (
        <EvidenceDetail
          source={activeSourceForDetail}
          isInspected={inspectedSourceIds.includes(activeSourceForDetail.id)}
          onClose={() => setActiveDetailId(null)}
        />
      )}

      {/* Navigation buttons */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '14px',
          borderTop: '1px solid var(--archive-midnight-border)',
          paddingTop: '20px',
        }}
      >
        <button
          type="button"
          onClick={onBackToDiscovery}
          style={{
            backgroundColor: 'transparent',
            color: 'var(--text-muted)',
            border: '1px solid var(--archive-midnight-border)',
            borderRadius: 'var(--radius-control)',
            padding: '10px 18px',
            fontSize: '0.92rem',
            cursor: 'pointer',
          }}
        >
          ← Retour à l’accueil du dossier
        </button>

        <button
          type="button"
          onClick={onProceedToBridge}
          data-testid="proceed-to-bridge-btn"
          style={{
            backgroundColor: 'var(--archive-amber)',
            color: 'var(--archive-ink)',
            fontSize: '1rem',
            fontWeight: 700,
            padding: '12px 24px',
            borderRadius: 'var(--radius-control)',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(197, 138, 69, 0.25)',
          }}
        >
          Passer au Missing Bridge (Identifier ce qu'il manque) →
        </button>
      </div>
    </section>
  );
};
