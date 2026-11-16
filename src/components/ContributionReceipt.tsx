import React from 'react';
import { ArchiveDataset, Contribution } from '../types/archive';
import { getLocalizedConclusionOptions } from '../data/caseC001';
import { useI18n } from '../i18n/I18nContext';

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
      <section
        aria-labelledby="no-receipt-heading"
        data-testid="no-receipt-empty-state"
        style={{
          backgroundColor: 'var(--archive-ink-elevated)',
          border: '1px solid var(--archive-midnight-border)',
          borderRadius: 'var(--radius-card)',
          padding: '24px',
        }}
      >
        <h2 id="no-receipt-heading" style={{ fontSize: '1.5rem', marginBottom: '8px' }}>
          {t('receipt.noReceipt.title')}
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
          {t('receipt.noReceipt.text')}
        </p>
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
      </section>
    );
  }

  const conclusionMeta = conclusionOptions.find((c) => c.value === contribution.conclusionType);

  return (
    <section
      aria-labelledby="receipt-heading"
      data-testid="contribution-receipt-section"
      className="animate-entry"
    >
      <div
        className="paper-surface"
        style={{
          backgroundColor: 'var(--archive-paper)',
          color: 'var(--text-ink)',
          borderRadius: 'var(--radius-card)',
          border: '3px solid var(--archive-teal)',
          padding: '24px',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.35)',
          marginBottom: '24px',
          transition: 'all var(--motion-m07)',
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

        <h2
          id="receipt-heading"
          style={{
            fontSize: '1.85rem',
            margin: '0 0 6px 0',
            color: 'var(--text-ink)',
          }}
        >
          {t('receipt.title')}
        </h2>
        <p style={{ margin: '0 0 18px 0', color: 'var(--text-ink-secondary)', fontSize: '0.95rem' }}>
          {t('receipt.subtitle', { status: contribution.status })}
        </p>

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
            <strong>
              {contribution.caseId} ({t('bridge.activeTrack')} {contribution.selectedQuestionId ?? 'N/A'})
            </strong>
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
            {conclusionMeta?.label ?? contribution.conclusionType}{' '}
            <code style={{ fontSize: '0.82rem', fontWeight: 600 }}>
              [{contribution.conclusionType}]
            </code>
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
              gap: '6px',
            }}
          >
            {contribution.referencedSourceIds.map((srcId) => {
              const src = dataset.sources.find((s) => s.id === srcId);
              return (
                <li key={srcId} style={{ fontWeight: 600 }}>
                  <strong>{srcId}</strong> — {src?.title ?? 'Source'} ({src?.date ?? ''}) :{' '}
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
        <div
          style={{
            backgroundColor: 'var(--archive-ink-elevated)',
            border: '1px solid var(--archive-midnight-border)',
            borderRadius: 'var(--radius-card)',
            padding: '18px',
          }}
        >
          <h3 style={{ fontSize: '1.2rem', margin: '0 0 10px 0' }}>
            {t('receipt.historyTitle', { n: allContributions.length })}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {allContributions.map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: 'rgba(16, 26, 36, 0.7)',
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
                  • <span>{item.conclusionType}</span> •{' '}
                  <span style={{ color: 'var(--text-muted)' }}>
                    {t('receipt.sources')} [{item.referencedSourceIds.join(', ')}]
                  </span>
                </div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  {new Date(item.savedAt).toLocaleString(config.dateLocale)} ({item.status})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
