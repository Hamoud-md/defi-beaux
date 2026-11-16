import React from 'react';
import { Case, InteractionMode } from '../types/archive';
import { useI18n, LOCALE_CONFIGS, Locale } from '../i18n/I18nContext';

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
  const { locale, setLocale, t } = useI18n();

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
            <span aria-hidden="true">◆</span> {t('badge.fictional')}
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
            {t('header.casePrefix')} <strong>{caseData.id}</strong> • {caseData.city}
          </span>
        </div>

        <div
          role="toolbar"
          aria-label={t('header.a11y.toolbar')}
          style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}
        >
          {/* Language Selector: Français, English, العربية */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: 'var(--archive-midnight)',
              border: '1px solid var(--archive-amber-bright)',
              borderRadius: 'var(--radius-control)',
              padding: '2px 4px',
              gap: '4px',
            }}
            aria-label={t('header.lang')}
          >
            <span style={{ fontSize: '0.8rem', paddingLeft: '6px', paddingRight: '6px', color: 'var(--archive-amber-bright)', fontWeight: 700 }}>
              🌐
            </span>
            {(['fr', 'en', 'ar'] as Locale[]).map((loc) => {
              const active = locale === loc;
              return (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setLocale(loc)}
                  aria-pressed={active}
                  data-testid={`lang-btn-${loc}`}
                  style={{
                    backgroundColor: active ? 'var(--archive-amber)' : 'transparent',
                    color: active ? 'var(--archive-ink)' : 'var(--text-light)',
                    fontWeight: active ? 700 : 500,
                    border: 'none',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {LOCALE_CONFIGS[loc].nativeLabel}
                </button>
              );
            })}
          </div>

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
            {reducedMotion ? t('header.reducedMotion.active') : t('header.reducedMotion.off')}
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
            title={t('header.mode.tooltip')}
          >
            {t('header.mode.label')}{' '}
            <strong>
              {interactionMode === 'missing-bridge'
                ? t('header.mode.signature')
                : t('header.mode.fallback')}
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
            {t('header.reset')}
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
            {t('app.supertitle')}
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
