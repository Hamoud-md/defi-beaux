import React from 'react';
import { Source } from '../types/archive';

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
  if (!source) {
    return null;
  }

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
            Fiche d’inspection • {source.id}
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
            Fermer la fiche
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
            Ce que le document mentionne explicitement :
          </strong>
          <p style={{ margin: '6px 0 0 0' }}>{source.content}</p>
          <p style={{ margin: '6px 0 0 0', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
            Lieu cité : <strong>{source.buildingMentioned}</strong> ({source.date})
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
            Portée et limites documentaires :
          </strong>
          <p style={{ margin: '6px 0 0 0' }}>
            {source.id === 'S001' &&
              "Atteste une inauguration en 1920 sur la vieille tour, mais ne dit rien de ce qu'est devenue l'horloge après 1920."}
            {source.id === 'S002' &&
              "Atteste une découverte publique en 1922 sur la nouvelle tour, mais ne prouve pas que l'horloge n'avait jamais existé ailleurs auparavant."}
            {source.id === 'S003' &&
              "Relie matériellement l'ancienne tour et la nouvelle tour par un transfert en 1921, mais ne prouve pas ce que chaque témoin savait individuellement."}
          </p>
          <p style={{ margin: '6px 0 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            État : {isInspected ? 'Consulté par l’enquêteur' : 'En attente de lecture'} • Archive
            fictive
          </p>
        </div>
      </div>
    </section>
  );
};
