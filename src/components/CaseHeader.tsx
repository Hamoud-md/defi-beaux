import React from 'react';
import { Case, InteractionMode } from '../types/archive';
import { FICTIONAL_WARNING_BADGE } from '../data/caseC001';

interface CaseHeaderProps {
  caseData: Case;
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
  interactionMode: InteractionMode;
  onToggleInteractionMode: (mode: InteractionMode) => void;
  onResetSession: () => void;
}

export const CaseHeader: React.FC<CaseHeaderProps> = ({
  caseData,
  reducedMotion,
  onToggleReducedMotion,
  interactionMode,
  onToggleInteractionMode,
  onResetSession,
}) => {
  return (
    <header
      style={{
        borderBottom: '1px solid var(--archive-midnight-border)',
        padding: '20px 0 18px',
        marginBottom: '20px',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '12px',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
          <span
            data-testid="fictional-warning-banner"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'var(--archive-amber)',
              color: 'var(--archive-ink)',
              fontWeight: 700,
              fontSize: '0.85rem',
              padding: '4px 12px',
              borderRadius: '999px',
              letterSpacing: '0.02em',
            }}
          >
            <span aria-hidden="true">◆</span> {FICTIONAL_WARNING_BADGE}
          </span>

          <span
            style={{
              backgroundColor: 'var(--archive-midnight)',
              border: '1px solid var(--archive-midnight-border)',
              color: 'var(--text-light)',
              fontSize: '0.82rem',
              padding: '4px 10px',
              borderRadius: '999px',
            }}
          >
            Dossier <strong>{caseData.id}</strong> • {caseData.city}
          </span>
        </div>

        <div
          role="toolbar"
          aria-label="Options d’accessibilité et de mode d’enquête"
          style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}
        >
          <button
            type="button"
            onClick={onToggleReducedMotion}
            aria-pressed={reducedMotion}
            style={{
              backgroundColor: reducedMotion ? 'var(--archive-teal)' : 'var(--archive-midnight)',
              color: 'var(--text-light)',
              border: '1px solid var(--archive-midnight-border)',
              borderRadius: 'var(--radius-control)',
              padding: '6px 12px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background-color var(--motion-m09)',
            }}
          >
            {reducedMotion ? '✓ Mouvement réduit : Actif' : 'Mouvement réduit : Désactivé'}
          </button>

          <button
            type="button"
            onClick={() =>
              onToggleInteractionMode(
                interactionMode === 'missing-bridge' ? 'guided-baseline' : 'missing-bridge'
              )
            }
            style={{
              backgroundColor: 'var(--archive-midnight)',
              color: 'var(--text-light)',
              border: '1px solid var(--archive-midnight-border)',
              borderRadius: 'var(--radius-control)',
              padding: '6px 12px',
              fontSize: '0.85rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
            title="Basculer entre la Signature Interaction (The Missing Bridge) et le mode Comparaison guidée classique (Fallback A23)"
          >
            Mode :{' '}
            <strong>
              {interactionMode === 'missing-bridge'
                ? 'Signature (The Missing Bridge)'
                : 'Fallback (Comparaison guidée)'}
            </strong>
          </button>

          <button
            type="button"
            onClick={onResetSession}
            style={{
              backgroundColor: 'transparent',
              color: 'var(--text-muted)',
              border: '1px solid var(--archive-midnight-border)',
              borderRadius: 'var(--radius-control)',
              padding: '6px 12px',
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            Réinitialiser l’enquête
          </button>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: '16px',
        }}
      >
        <div>
          <p
            style={{
              margin: '0 0 4px 0',
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--archive-amber-bright)',
              fontWeight: 600,
            }}
          >
            THE MEMORY CITY • THE ECHO DETECTIVE
          </p>
          <h1
            style={{
              fontSize: 'clamp(1.75rem, 3vw, 2.4rem)',
              margin: '0 0 6px 0',
              color: 'var(--text-light)',
            }}
          >
            {caseData.id} — {caseData.title}
          </h1>
          <p
            style={{
              margin: 0,
              fontStyle: 'italic',
              color: 'var(--text-muted)',
              fontSize: '1.05rem',
            }}
          >
            « {caseData.promise} »
          </p>
        </div>
      </div>
    </header>
  );
};
