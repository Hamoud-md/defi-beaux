import React from 'react';
import { Case } from '../types/archive';
import { FICTIONAL_WARNING_BADGE } from '../data/caseC001';

interface DiscoveryViewProps {
  caseData: Case;
  onStartInvestigation: () => void;
  onNavigateToStep?: (step: 'S02') => void;
}

export const DiscoveryView: React.FC<DiscoveryViewProps> = ({
  caseData,
  onStartInvestigation,
}) => {
  return (
    <section
      aria-labelledby="discovery-title"
      data-testid="discovery-view-section"
      className="animate-entry"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}
    >
      {/* Intro hero card */}
      <div
        style={{
          backgroundColor: 'var(--archive-ink-elevated)',
          border: '1px solid var(--archive-midnight-border)',
          borderRadius: 'var(--radius-card)',
          padding: '28px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--archive-amber)',
            color: 'var(--archive-ink)',
            fontWeight: 700,
            fontSize: '0.86rem',
            padding: '5px 14px',
            borderRadius: '999px',
            marginBottom: '16px',
          }}
        >
          <span aria-hidden="true">◆</span>
          {FICTIONAL_WARNING_BADGE}
        </div>

        <h2
          id="discovery-title"
          style={{
            fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
            color: 'var(--text-light)',
            marginBottom: '14px',
          }}
        >
          Dossier {caseData.id} — {caseData.title}
        </h2>

        <p
          style={{
            fontSize: '1.2rem',
            fontFamily: 'var(--font-serif)',
            color: 'var(--archive-amber-bright)',
            marginBottom: '20px',
            fontStyle: 'italic',
          }}
        >
          « {caseData.promise} »
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '18px',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--archive-midnight)',
              padding: '18px',
              borderRadius: 'var(--radius-control)',
              border: '1px solid var(--archive-midnight-border)',
            }}
          >
            <h3
              style={{
                fontSize: '1.15rem',
                color: 'var(--text-light)',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ color: 'var(--archive-amber-bright)' }}>✦</span>
              Le Contexte &amp; Le Problème
            </h3>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.98rem' }}>
              {caseData.description}
            </p>
          </div>

          <div
            style={{
              backgroundColor: 'var(--archive-midnight)',
              padding: '18px',
              borderRadius: 'var(--radius-control)',
              border: '1px solid var(--archive-midnight-border)',
            }}
          >
            <h3
              style={{
                fontSize: '1.15rem',
                color: 'var(--text-light)',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ color: 'var(--archive-teal-bright)' }}>✦</span>
              Votre Objectif d'Enquêteur
            </h3>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.98rem' }}>
              {caseData.objective}
            </p>
          </div>
        </div>

        {/* Methodological notice */}
        <div
          style={{
            backgroundColor: 'rgba(58, 140, 121, 0.12)',
            border: '1px solid var(--archive-teal)',
            borderRadius: 'var(--radius-control)',
            padding: '16px 20px',
            marginBottom: '26px',
          }}
        >
          <strong
            style={{
              display: 'block',
              color: 'var(--archive-teal-bright)',
              fontSize: '1rem',
              marginBottom: '6px',
            }}
          >
            Méthode d'investigation rigoureuse :
          </strong>
          <p style={{ margin: 0, fontSize: '0.94rem', color: 'var(--text-light)' }}>
            Dans <em>The Echo Detective</em>, il ne s'agit pas de choisir aveuglément entre deux
            dates. Vous examinerez deux archives municipales divergentes, identifierez quelle
            information manque grâce au <strong>Missing Bridge</strong>, analyserez les indices
            découverts, et rédigerez une conclusion motivée qui sera enregistrée dans le registre
            local de démonstration.
          </p>
        </div>

        {/* CTA Commencer l'enquête (F01 / OFF-01 / A01) */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            borderTop: '1px solid var(--archive-midnight-border)',
            paddingTop: '20px',
          }}
        >
          <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Ville fictive de Memoria • Simulation pédagogique autonome
          </div>

          <button
            type="button"
            onClick={onStartInvestigation}
            data-testid="start-investigation-cta"
            style={{
              backgroundColor: 'var(--archive-amber)',
              color: 'var(--archive-ink)',
              fontSize: '1.1rem',
              fontWeight: 700,
              padding: '14px 28px',
              borderRadius: 'var(--radius-control)',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 4px 14px rgba(197, 138, 69, 0.35)',
              transition: 'background-color var(--motion-m09)',
            }}
          >
            <span>Commencer l’enquête</span>
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </section>
  );
};
