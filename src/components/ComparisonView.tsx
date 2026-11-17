import React, { useState } from 'react';
import { Source } from '../types/archive';
import { EvidenceDocument } from './EvidenceDocument';
import { EvidenceDetail } from './EvidenceDetail';
import { Deck3D } from './threeD/Deck3D';
import { SceneShell } from './SceneShell';
import { useI18n } from '../i18n/I18nContext';

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
  const { t } = useI18n();
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
    <SceneShell
      chapter={t('scene.chapter.II')}
      title={t('comparison.title')}
      lede={t('comparison.subtitle')}
      titleId="comparison-title"
      testId="comparison-view-section"
    >
      {/* Discrepancy Callout Banner */}
      <div
        role="region"
        aria-label={t('comparison.discrepancy.title')}
        className="archive-card"
        data-state="neutral"
        style={{
          borderColor: 'rgba(224, 167, 95, 0.45)',
          padding: '18px 22px',
          marginBottom: '20px',
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
            <span aria-hidden="true">⚖</span> {t('comparison.discrepancy.title')}
          </strong>
          <span
            className="state-chip"
            data-tone={bothInspected ? 'revealed' : 'neutral'}
          >
            <span aria-hidden="true">{bothInspected ? '✓' : '○'}</span>
            {bothInspected
              ? t('comparison.bothExamined')
              : t('comparison.examined', {
                  n: inspectedSourceIds.filter((id) => id === 'S001' || id === 'S002').length,
                })}
          </span>
        </div>

        <p style={{ margin: 0, fontSize: '0.96rem', color: 'var(--text-light)', lineHeight: 1.55 }}>
          {t('comparison.discrepancy.text')}
        </p>
      </div>

      {/* Two Claim Comparison Cards side-by-side — rendered as a 3D deck of
          archival documents so the reader physically compares two depths */}
      <div
        className="scene__panel"
        style={{
          padding: '16px 12px 20px',
          marginBottom: '20px',
        }}
      >
        <Deck3D
          cards={[
            ...(s001
              ? [
                  {
                    id: s001.id,
                    node: (
                      <EvidenceDocument
                        source={s001}
                        isInspected={inspectedSourceIds.includes(s001.id)}
                        isFocusedDetail={activeDetailId === s001.id}
                        onInspect={handleInspect}
                      />
                    ),
                  },
                ]
              : []),
            ...(s002
              ? [
                  {
                    id: s002.id,
                    node: (
                      <EvidenceDocument
                        source={s002}
                        isInspected={inspectedSourceIds.includes(s002.id)}
                        isFocusedDetail={activeDetailId === s002.id}
                        onInspect={handleInspect}
                      />
                    ),
                  },
                ]
              : []),
          ]}
          activeId={activeDetailId}
          ariaLabel={t('card3d.deck.sources')}
          dataTestId="evidence-documents-deck"
        />
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
          {t('comparison.back')}
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
            boxShadow: '0 6px 18px rgba(197, 138, 69, 0.28)',
          }}
        >
          {t('comparison.proceed')}
        </button>
      </div>
    </SceneShell>
  );
};
