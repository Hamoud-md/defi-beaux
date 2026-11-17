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
        padding: '26px 0 22px',
        marginBottom: '24px',
        borderBottom: '1px solid rgba(224, 167, 95, 0.22)',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '18px',
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
              fontSize: '0.82rem',
              padding: '4px 12px',
              borderRadius: '999px',
              letterSpacing: '0.02em',
            }}
          >
            <span aria-hidden="true">◆</span> {t('badge.fictional')}
          </span>

          <span
            style={{
              backgroundColor: 'rgba(7, 12, 20, 0.6)',
              border: '1px solid var(--archive-midnight-border)',
              color: 'var(--text-muted)',
              fontSize: '0.8rem',
              padding: '4px 10px',
              borderRadius: '999px',
            }}
          >
            {t('header.casePrefix')} <strong style={{ color: 'var(--text-light)' }}>{caseData.id}</strong>{' '}
            • {caseData.city}
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
              backgroundColor: 'rgba(7, 12, 20, 0.6)',
              border: '1px solid var(--archive-amber-bright)',
              borderRadius: 'var(--radius-control)',
              padding: '2px 4px',
              gap: '4px',
            }}
            aria-label={t('header.lang')}
          >
            <span
              style={{
                fontSize: '0.8rem',
                paddingLeft: '6px',
                paddingRight: '6px',
                color: 'var(--archive-amber-bright)',
                fontWeight: 700,
              }}
              aria-hidden="true"
            >
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
              backgroundColor: reducedMotion
                ? 'var(--archive-teal-surface)'
                : 'rgba(7, 12, 20, 0.6)',
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
              backgroundColor: 'rgba(7, 12, 20, 0.6)',
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

      <div>
        <p
          style={{
            margin: '0 0 6px 0',
            fontSize: '0.74rem',
            textTransform: 'uppercase',
            letterSpacing: '0.22em',
            color: 'var(--archive-amber-bright)',
            fontWeight: 700,
          }}
        >
          {t('app.supertitle')}
        </p>
        <h1
          style={{
            fontSize: 'clamp(1.85rem, 3.4vw, 2.6rem)',
            margin: '0 0 8px 0',
            color: 'var(--text-light)',
            textShadow: '0 4px 32px rgba(0, 0, 0, 0.7)',
          }}
        >
          {caseData.id} — {caseData.title}
        </h1>
        <p
          style={{
            margin: 0,
            fontStyle: 'italic',
            color: 'var(--text-muted)',
            fontSize: '1.08rem',
            fontFamily: 'var(--font-serif)',
          }}
        >
          « {caseData.promise} »
        </p>
      </div>
    </header>
  );
};
