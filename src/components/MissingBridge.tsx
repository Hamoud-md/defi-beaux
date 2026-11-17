import React from 'react';
import {
  ArchiveDataset,
  InteractionMode,
  Source,
} from '../types/archive';
import { ClaimPanel } from './ClaimPanel';
import { ResearchQuestion } from './ResearchQuestion';
import { EvidenceDocument } from './EvidenceDocument';
import { Deck3D } from './threeD/Deck3D';
import { SceneShell } from './SceneShell';
import { BridgeCanvas, BridgeState, EchoStrip } from './BridgeCanvas';
import { useI18n } from '../i18n/I18nContext';

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
  const { t, isRtl } = useI18n();
  const claim1 = dataset.claims.find((c) => c.id === 'CL001');
  const claim2 = dataset.claims.find((c) => c.id === 'CL002');
  const claim3 = dataset.claims.find((c) => c.id === 'CL003');
  const source3 = dataset.sources.find((s) => s.id === 'S003');

  const activeQuestion = dataset.questions.find((q) => q.id === selectedQuestionId) ?? null;
  const isS003Unlocked =
    selectedQuestionId === 'Q001' || exploredQuestionIds.includes('Q001');

  /**
   * The bridge state is the visible consequence of the chosen path:
   * a pertinent path completes the span, a path without evidence snaps it
   * half-way, and an untouched case keeps the void open.
   */
  const bridgeState: BridgeState = isS003Unlocked
    ? 'formed'
    : selectedQuestionId
      ? 'broken'
      : 'idle';

  const getSourcesForClaim = (sourceIds: string[]): Source[] =>
    dataset.sources.filter((s) => sourceIds.includes(s.id));

  const getBridgeStatusText = (): string => {
    if (!activeQuestion) {
      return t('bridge.status.none');
    }
    if (activeQuestion.id === 'Q001') {
      return t('bridge.status.Q001');
    }
    if (activeQuestion.id === 'Q002') {
      return t('bridge.status.Q002');
    }
    return t('bridge.status.Q003');
  };

  const bridgeCanvasLabel =
    bridgeState === 'formed'
      ? t('bridge.canvas.state.formed')
      : bridgeState === 'broken'
        ? t('bridge.canvas.state.broken')
        : t('bridge.canvas.state.idle');

  const claimState = bridgeState === 'formed' ? 'selected' : 'neutral';

  return (
    <SceneShell
      chapter={t('scene.chapter.III')}
      title={
        interactionMode === 'missing-bridge'
          ? t('bridge.heading.signature')
          : t('bridge.heading.fallback')
      }
      lede={t('bridge.instruction')}
      titleId="missing-bridge-heading"
      testId="missing-bridge-section"
    >
      {/* Permanent comparative summary (Desktop & Mobile requirement Section 5) */}
      <div
        data-testid="permanent-comparative-summary"
        className="archive-card"
        data-state={isS003Unlocked ? 'revealed' : 'neutral'}
        style={{
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
              fontSize: '0.74rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--archive-amber-bright)',
              fontWeight: 700,
              display: 'block',
            }}
          >
            {t('bridge.summaryLabel')}
          </span>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.95rem', color: 'var(--text-light)' }}>
            {t('bridge.summaryText')}
          </p>
        </div>

        <span
          className="state-chip"
          data-tone={isS003Unlocked ? 'revealed' : 'neutral'}
          style={{ fontSize: '0.8rem' }}
        >
          <span aria-hidden="true">{isS003Unlocked ? '✦' : '○'}</span>
          {isS003Unlocked ? t('bridge.clueUnlocked') : t('bridge.clueMissing')}
        </span>
      </div>

      {/* Accessible Causal Status Banner (F03 / M03 / A04) */}
      <div
        role="status"
        aria-live="polite"
        data-testid="missing-bridge-status"
        className="archive-card"
        data-state={activeQuestion?.id === 'Q001' ? 'revealed' : 'neutral'}
        style={{
          padding: '14px 16px',
          marginBottom: '20px',
          transition: 'border-color var(--motion-m03), box-shadow var(--motion-m03)',
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
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
              padding: '3px 10px',
              borderRadius: '999px',
              border: '1px solid var(--archive-midnight-border)',
            }}
          >
            {t('bridge.activeTrack')} {activeQuestion ? activeQuestion.shortLabel.replace(/\s*\([^)]*\)\s*$/u, '') : t('bridge.none')}
          </span>
        </div>
      </div>

      {interactionMode === 'missing-bridge' ? (
        /* Desktop 3-column / Mobile stacked Signature Missing Bridge Layout */
        <div className="bridge-grid">
          {/* Left Claim: 1920 — the old tower */}
          {claim1 && (
            <ClaimPanel
              claim={claim1}
              badgeLabel={t('claim.labelA')}
              state={claimState}
              linkedSources={getSourcesForClaim(claim1.sourceIds)}
              inspectedSourceIds={inspectedSourceIds}
              onInspectSource={onInspectSource}
            />
          )}

          {/* Center: the bridge itself */}
          <div data-testid="bridge-connector-column" className="bridge-stage">
            <BridgeCanvas
              state={bridgeState}
              leftLabel={claim1?.locationLabel ?? t('bridge.canvas.oldTower')}
              rightLabel={claim2?.locationLabel ?? t('bridge.canvas.newTower')}
              leftYear={claim1?.yearLabel ?? '1920'}
              rightYear={claim2?.yearLabel ?? '1922'}
              keystoneLabel={bridgeState === 'formed' ? source3?.title : null}
              stateLabel={bridgeCanvasLabel}
              isRtl={isRtl}
            />

            <div className="bridge-legend">
              <span className="bridge-legend__item">
                <span className="bridge-legend__dot bridge-legend__dot--idle" aria-hidden="true" />
                {t('bridge.canvas.legend.idle')}
              </span>
              <span className="bridge-legend__item">
                <span className="bridge-legend__dot bridge-legend__dot--formed" aria-hidden="true" />
                {t('bridge.canvas.legend.formed')}
              </span>
              <span className="bridge-legend__item">
                <span className="bridge-legend__dot bridge-legend__dot--broken" aria-hidden="true" />
                {t('bridge.canvas.legend.broken')}
              </span>
            </div>

            <p
              style={{
                margin: '0 0 10px',
                textAlign: 'center',
                fontSize: '0.92rem',
                color: 'var(--text-light)',
                fontWeight: 600,
              }}
            >
              {bridgeCanvasLabel}
            </p>

            <EchoStrip
              keystone={
                bridgeState === 'formed'
                  ? { year: '1921', label: source3?.title ?? t('bridge.canvas.keystone') }
                  : null
              }
              left={{ year: '1920', label: claim1?.locationLabel ?? '' }}
              right={{ year: '1922', label: claim2?.locationLabel ?? '' }}
            />
          </div>

          {/* Right Claim: 1922 — the new tower */}
          {claim2 && (
            <ClaimPanel
              claim={claim2}
              badgeLabel={t('claim.labelB')}
              state={claimState}
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
          className="scene__panel"
          style={{ marginBottom: '24px' }}
        >
          <p style={{ marginTop: 0, color: 'var(--text-muted)' }}>
            <strong>{t('bridge.fallbackTitle')}</strong> {t('bridge.fallbackDesc')}
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
                badgeLabel={t('claim.labelA')}
                linkedSources={getSourcesForClaim(claim1.sourceIds)}
                inspectedSourceIds={inspectedSourceIds}
                onInspectSource={onInspectSource}
              />
            )}
            {claim2 && (
              <ClaimPanel
                claim={claim2}
                badgeLabel={t('claim.labelB')}
                linkedSources={getSourcesForClaim(claim2.sourceIds)}
                inspectedSourceIds={inspectedSourceIds}
                onInspectSource={onInspectSource}
              />
            )}
          </div>
        </div>
      )}

      {/* ── Research trails: the paths the investigator may throw across ──── */}
      <div
        className="scene__panel"
        style={{
          marginTop: '4px',
          marginBottom: '24px',
          padding: '18px 14px 22px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            gap: '8px',
            marginBottom: '14px',
          }}
        >
          <strong
            style={{
              fontSize: '1.1rem',
              color: 'var(--text-light)',
              fontFamily: 'var(--font-serif)',
            }}
          >
            {t('bridge.selectQuestion')}
          </strong>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {t('card3d.hint')}
          </span>
        </div>

        <Deck3D
          cards={dataset.questions.map((q) => ({
            id: q.id,
            node: (
              <ResearchQuestion
                key={q.id}
                question={q}
                isSelected={selectedQuestionId === q.id}
                wasExplored={exploredQuestionIds.includes(q.id)}
                onSelect={onSelectQuestion}
              />
            ),
          }))}
          activeId={selectedQuestionId}
          ariaLabel={t('card3d.deck.questions')}
          dataTestId="research-questions-deck"
        />
      </div>

      {/* M04 / F04 / A05: Revealed 3rd Clue S003 & Claim CL003 in immediate proximity when Q001 is selected/explored */}
      {isS003Unlocked && source3 && claim3 && (
        <div
          data-testid="revealed-s003-container"
          className="archive-card animate-clue-reveal"
          data-state="revealed"
          style={{
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
                  fontSize: '0.78rem',
                  padding: '3px 10px',
                  borderRadius: '999px',
                  display: 'inline-block',
                  marginBottom: '6px',
                }}
              >
                {t('bridge.revealBadge')}
              </span>
              <h3 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-light)' }}>
                {t('bridge.revealTitle', { id: source3.id, title: source3.title, date: source3.date })}
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
                padding: '11px 20px',
                borderRadius: 'var(--radius-control)',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.95rem',
              }}
            >
              {t('bridge.proceedS04')}
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
              badgeLabel={t('claim.labelC')}
              linkedSources={[source3]}
              inspectedSourceIds={inspectedSourceIds}
              onInspectSource={onInspectSource}
              highlightVariant="bridge-unlocked"
            />
          </div>
        </div>
      )}
    </SceneShell>
  );
};
