import React from 'react';
import { Source } from '../types/archive';
import { ArchivalIllustration } from './ArchivalIllustration';
import { useI18n } from '../i18n/I18nContext';

interface EvidenceDocumentProps {
  source: Source;
  isInspected: boolean;
  isFocusedDetail?: boolean;
  onInspect: (sourceId: string) => void;
}

export const EvidenceDocument: React.FC<EvidenceDocumentProps> = ({
  source,
  isInspected,
  isFocusedDetail = false,
  onInspect,
}) => {
  const { t } = useI18n();

  const cardState = isFocusedDetail ? 'selected' : isInspected ? 'revealed' : 'neutral';

  return (
    <article
      aria-labelledby={`source-title-${source.id}`}
      data-testid={`source-card-${source.id}`}
      data-state={cardState}
      className="paper-surface archive-card"
      style={{
        backgroundColor: 'var(--archive-paper)',
        color: 'var(--text-ink)',
        borderRadius: 'var(--radius-card)',
        border: isFocusedDetail
          ? '3px solid var(--archive-amber)'
          : isInspected
            ? '2px solid var(--archive-teal)'
            : '2px solid var(--archive-paper-border)',
        padding: '20px',
        boxShadow: '0 10px 28px rgba(0, 0, 0, 0.4)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'transform var(--motion-m02), border-color var(--motion-m02)',
      }}
    >
      <div>
        {/* Document metadata header */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '12px',
            borderBottom: '1px solid var(--archive-paper-border)',
            paddingBottom: '10px',
          }}
        >
          <span
            style={{
              backgroundColor: 'var(--text-ink)',
              color: 'var(--archive-paper)',
              fontWeight: 700,
              fontSize: '0.78rem',
              padding: '3px 9px',
              borderRadius: '6px',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            {source.sourceType}
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <time
              dateTime={source.isoDate}
              style={{
                fontWeight: 700,
                fontSize: '0.92rem',
                backgroundColor: '#DFD2BC',
                padding: '2px 10px',
                borderRadius: '6px',
                border: '1px solid #C4B293',
              }}
            >
              {source.date}
            </time>
            <span
              data-testid={`source-status-${source.id}`}
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                padding: '3px 10px',
                borderRadius: '999px',
                backgroundColor: isInspected ? '#235E51' : '#5A4628',
                color: '#F7F4ED',
              }}
            >
              {isInspected ? t('evidence.inspected') : t('evidence.notInspected')}
            </span>
          </div>
        </div>

        {/* Title & archival reference */}
        <div style={{ marginBottom: '12px' }}>
          <h3
            id={`source-title-${source.id}`}
            style={{
              fontSize: '1.4rem',
              margin: '0 0 4px 0',
              color: 'var(--text-ink)',
            }}
          >
            {source.title} ({source.date})
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: '0.8rem',
              color: 'var(--text-ink-secondary)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {t('evidence.cote')} {source.archiveCode} • {t('evidence.building')}{' '}
            <strong>{source.buildingMentioned}</strong> • {t('evidence.fictiveArchive')}
          </p>
        </div>

        {/* Accessible fictional illustration */}
        <ArchivalIllustration type={source.illustrationType} altText={source.illustrationAlt} />

        {/* Verbatim quote box */}
        <blockquote
          style={{
            margin: '0 0 12px 0',
            padding: '14px 16px',
            backgroundColor: '#F4EDE1',
            borderLeft: '4px solid var(--text-ink)',
            borderRight: '4px solid var(--text-ink)',
            borderRadius: '8px',
            fontFamily: 'var(--font-serif)',
            fontSize: '1.22rem',
            fontWeight: 600,
            color: 'var(--text-ink)',
          }}
        >
          {source.content}
        </blockquote>

        {/* Context & epistemic note */}
        <p
          style={{
            margin: '0 0 12px 0',
            fontSize: '0.92rem',
            color: 'var(--text-ink-secondary)',
          }}
        >
          <strong>{t('evidence.contextLabel')}</strong> {source.contextNote}
        </p>

        {isInspected && (
          <div
            style={{
              padding: '8px 12px',
              backgroundColor: '#DFD2BC',
              borderRadius: '8px',
              fontSize: '0.84rem',
              color: 'var(--text-ink)',
              marginBottom: '12px',
              borderLeft: '3px solid #235E51',
              borderRight: '3px solid #235E51',
            }}
          >
            <strong>{t('evidence.epistemic')}</strong> {t('evidence.epistemicDetail')}
          </div>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '10px',
          marginTop: '8px',
        }}
      >
        <button
          type="button"
          onClick={() => onInspect(source.id)}
          data-testid={`inspect-btn-${source.id}`}
          style={{
            width: '100%',
            padding: '10px 16px',
            borderRadius: 'var(--radius-control)',
            border: isInspected ? '2px solid #235E51' : '2px solid var(--text-ink)',
            backgroundColor: isInspected ? '#235E51' : 'var(--text-ink)',
            color: '#F7F4ED',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'background-color var(--motion-m09)',
          }}
        >
          {isInspected
            ? t('evidence.inspectedBtn')
            : t('evidence.inspectBtn', { date: source.date })}
        </button>
      </div>
    </article>
  );
};
