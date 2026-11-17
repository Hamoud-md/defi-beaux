import React from 'react';
import { Case } from '../types/archive';
import { useI18n } from '../i18n/I18nContext';
import { useTilt3D } from './threeD/motion';
import { SceneShell } from './SceneShell';

interface DiscoveryViewProps {
  caseData: Case;
  onStartInvestigation: () => void;
  onNavigateToStep?: (step: 'S02') => void;
}

export const DiscoveryView: React.FC<DiscoveryViewProps> = ({
  caseData,
  onStartInvestigation,
}) => {
  const { t, isRtl } = useI18n();
  const heroRef = useTilt3D<HTMLDivElement>(true, { maxY: 5, maxX: 4 });

  return (
    <SceneShell
      chapter={t('scene.chapter.I')}
      title={`${t('header.casePrefix')} ${caseData.id} — ${caseData.title}`}
      lede={caseData.promise}
      titleId="discovery-title"
      testId="discovery-view-section"
    >
      {/* Intro hero card — volumetric tilt reacting to the pointer */}
      <div
        ref={heroRef}
        className="tilt-surface scene__panel"
        style={{
          borderRadius: 'var(--radius-scene)',
          padding: 'clamp(20px, 3vw, 34px)',
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
            fontSize: '0.82rem',
            padding: '5px 14px',
            borderRadius: '999px',
            marginBottom: '16px',
          }}
        >
          <span aria-hidden="true">◆</span>
          {t('badge.fictional')}
        </div>

        <p
          style={{
            fontSize: 'clamp(1.15rem, 2.2vw, 1.45rem)',
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
            className="archive-card"
            data-state="neutral"
            style={{ padding: '18px' }}
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
              <span style={{ color: 'var(--archive-amber-bright)' }} aria-hidden="true">
                ✦
              </span>
              {t('discovery.context')}
            </h3>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.98rem' }}>
              {caseData.description}
            </p>
          </div>

          <div
            className="archive-card"
            data-state="neutral"
            style={{ padding: '18px' }}
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
              <span style={{ color: 'var(--archive-teal-bright)' }} aria-hidden="true">
                ✦
              </span>
              {t('discovery.objective')}
            </h3>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.98rem' }}>
              {caseData.objective}
            </p>
          </div>
        </div>

        {/* Methodological notice */}
        <div
          style={{
            backgroundColor: 'rgba(58, 140, 121, 0.14)',
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
            {t('discovery.method.title')}
          </strong>
          <p style={{ margin: 0, fontSize: '0.94rem', color: 'var(--text-light)' }}>
            {t('discovery.method.text')}
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
            {t('discovery.fiction')}
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
              boxShadow: '0 6px 22px rgba(197, 138, 69, 0.35)',
              transition: 'background-color var(--motion-m09), transform var(--motion-m09)',
            }}
          >
            <span>{t('discovery.cta')}</span>
            <span aria-hidden="true">{isRtl ? '←' : '→'}</span>
          </button>
        </div>
      </div>
    </SceneShell>
  );
};
