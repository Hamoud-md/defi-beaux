import React from 'react';
import { ArchiveDataset, Contribution } from '../types/archive';
import { getLocalizedConclusionOptions } from '../data/caseC001';
import { useI18n } from '../i18n/I18nContext';
import { SceneShell } from './SceneShell';

interface ContributionReceiptProps {
  contribution: Contribution | null;
  allContributions: Contribution[];
  dataset: ArchiveDataset;
  onReviseVerdict: () => void;
  onRestartInvestigation: () => void;
}

export const ContributionReceipt: React.FC<ContributionReceiptProps> = ({
  contribution,
  allContributions,
  dataset,
  onReviseVerdict,
  onRestartInvestigation,
}) => {
  const { locale, config, t } = useI18n();
  const conclusionOptions = getLocalizedConclusionOptions(locale);

  if (!contribution) {
    return (
      <SceneShell
        chapter={t('scene.chapter.VI')}
        title={t('receipt.noReceipt.title')}
        lede={t('receipt.noReceipt.text')}
        titleId="no-receipt-heading"
        testId="no-receipt-empty-state"
      >
        <div className="scene__panel">
          <button
            type="button"
            onClick={onReviseVerdict}
            style={{
              backgroundColor: 'var(--archive-amber)',
              color: 'var(--archive-ink)',
              fontWeight: 700,
              padding: '10px 18px',
              borderRadius: 'var(--radius-control)',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {t('receipt.noReceipt.cta')}
          </button>
        </div>
      </SceneShell>
    );
  }

  const conclusionMeta = conclusionOptions.find((c) => c.value === contribution.conclusionType);

  return (
    <SceneShell
      chapter={t('scene.chapter.VI')}
      title={t('receipt.title')}
      lede={t('receipt.subtitle', { status: t('receipt.status.local') })}
      titleId="receipt-heading"
      testId="contribution-receipt-section"
    >
      <div
        className="scene__panel scene__panel--paper"
        style={{
          color: 'var(--text-ink)',
          border: '2px solid var(--archive-teal)',
          padding: '24px',
          boxShadow: '0 20px 48px rgba(0, 0, 0, 0.45)',
          marginBottom: '24px',
        }}
      >
        {/* Top Badges: Local Demo Receipt + Fictional Archive Warning */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '10px',
            borderBottom: '2px solid var(--archive-paper-border)',
            paddingBottom: '14px',
            marginBottom: '18px',
          }}
        >
          <span
            data-testid="receipt-local-demo-badge"
            style={{
              backgroundColor: '#235E51',
              color: '#F7F4ED',
              fontWeight: 700,
              fontSize: '0.88rem',
              padding: '5px 14px',
              borderRadius: '999px',
            }}
          >
            ✓ {t('badge.localReceipt')}
          </span>

          <span
            data-testid="receipt-fictional-badge"
            style={{
              backgroundColor: 'var(--text-ink)',
              color: 'var(--archive-paper)',
              fontWeight: 700,
              fontSize: '0.84rem',
              padding: '4px 12px',
              borderRadius: '999px',
            }}
          >
            ◆ {t('badge.fictional')}
          </span>
        </div>

        {/* Metadata Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '12px',
            backgroundColor: '#DFD2BC',
            padding: '14px',
            borderRadius: '10px',
            marginBottom: '18px',
            fontSize: '0.9rem',
          }}
        >
          <div>
            <span style={{ display: 'block', fontSize: '0.76rem', color: '#33475B' }}>
              {t('receipt.refLabel')}
            </span>
            <strong
              data-testid="receipt-id"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.98rem' }}
            >
              {contribution.id}
            </strong>
          </div>

          <div>
            <span style={{ display: 'block', fontSize: '0.76rem', color: '#33475B' }}>
              {t('receipt.caseLabel')}
            </span>
            <strong>{contribution.caseId}</strong>
          </div>

          <div>
            <span style={{ display: 'block', fontSize: '0.76rem', color: '#33475B' }}>
              {t('receipt.dateLabel')}
            </span>
            <strong>{new Date(contribution.savedAt).toLocaleString(config.dateLocale)}</strong>
          </div>

          <div>
            <span style={{ display: 'block', fontSize: '0.76rem', color: '#33475B' }}>
              {t('receipt.verifyLabel')}
            </span>
            <strong data-testid="receipt-verified-status" style={{ color: '#1B4D3E' }}>
              {contribution.verifiedReadBack ? t('receipt.verified') : t('receipt.notVerified')}
            </strong>
          </div>
        </div>

        {/* Verdict & Justification */}
        <div style={{ marginBottom: '18px' }}>
          <h3 style={{ fontSize: '1.2rem', margin: '0 0 6px 0', color: 'var(--text-ink)' }}>
            {t('receipt.verdictLabel')}
          </h3>
          <div
            data-testid="receipt-conclusion-type"
            style={{
              padding: '12px 14px',
              backgroundColor: '#F4EDE1',
              borderLeft: '4px solid #235E51',
              borderRight: '4px solid #235E51',
              borderRadius: '8px',
              fontWeight: 700,
              marginBottom: '12px',
            }}
          >
            {conclusionMeta?.label ?? contribution.conclusionType}
          </div>

          <h3 style={{ fontSize: '1.2rem', margin: '0 0 6px 0', color: 'var(--text-ink)' }}>
            {t('receipt.justificationLabel')}
          </h3>
          <blockquote
            data-testid="receipt-justification"
            style={{
              margin: 0,
              padding: '14px 16px',
              backgroundColor: '#F4EDE1',
              borderLeft: '4px solid var(--text-ink)',
              borderRight: '4px solid var(--text-ink)',
              borderRadius: '8px',
              fontSize: '1.05rem',
            }}
          >
            {contribution.justification}
          </blockquote>
        </div>

        {/* Referenced Sources */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.2rem', margin: '0 0 8px 0', color: 'var(--text-ink)' }}>
            {t('receipt.sourcesLabel', { n: contribution.referencedSourceIds.length })}
          </h3>
          <ul
            data-testid="receipt-referenced-sources"
            style={{
              margin: 0,
              paddingLeft: '20px',
              paddingRight: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            {contribution.referencedSourceIds.map((srcId) => {
              const src = dataset.sources.find((s) => s.id === srcId);
              return (
                <li key={srcId} style={{ fontWeight: 600 }}>
                  <strong>{src?.title ?? srcId}</strong> ({src?.date ?? ''}) :{' '}
                  <span style={{ fontWeight: 400 }}>{src?.content}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Actions */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            borderTop: '1px solid var(--archive-paper-border)',
            paddingTop: '16px',
          }}
        >
          <button
            type="button"
            onClick={onReviseVerdict}
            data-testid="revise-verdict-btn"
            style={{
              backgroundColor: 'var(--text-ink)',
              color: 'var(--archive-paper)',
              fontWeight: 700,
              padding: '10px 18px',
              borderRadius: 'var(--radius-control)',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {t('receipt.revise')}
          </button>

          <button
            type="button"
            onClick={onRestartInvestigation}
            data-testid="restart-investigation-btn"
            style={{
              backgroundColor: 'transparent',
              color: 'var(--text-ink)',
              fontWeight: 700,
              padding: '10px 18px',
              borderRadius: 'var(--radius-control)',
              border: '2px solid var(--text-ink)',
              cursor: 'pointer',
            }}
          >
            {t('receipt.restart')}
          </button>
        </div>
      </div>

      {/* Local Contribution Registry History */}
      {allContributions.length > 0 && (
        <div className="scene__panel">
          <h3 style={{ fontSize: '1.2rem', margin: '0 0 10px 0' }}>
            {t('receipt.historyTitle', { n: allContributions.length })}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {allContributions.map((item) => {
              const meta = conclusionOptions.find((c) => c.value === item.conclusionType);
              return (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: 'rgba(7, 12, 20, 0.7)',
                    border: '1px solid var(--archive-midnight-border)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    fontSize: '0.88rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    gap: '8px',
                  }}
                >
                  <div>
                    <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--archive-amber-bright)' }}>
                      {item.id}
                    </strong>{' '}
                    • <span>{meta?.label ?? item.conclusionType}</span> •{' '}
                    <span style={{ color: 'var(--text-muted)' }}>
                      {t('receipt.sources')}{' '}
                      {item.referencedSourceIds
                        .map((id) => dataset.sources.find((s) => s.id === id)?.title ?? id)
                        .join(', ')}
                    </span>
                  </div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    {new Date(item.savedAt).toLocaleString(config.dateLocale)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </SceneShell>
  );
};
