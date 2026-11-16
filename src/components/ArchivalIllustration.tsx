import React from 'react';
import { useI18n } from '../i18n/I18nContext';

interface ArchivalIllustrationProps {
  type: 'old-tower' | 'new-tower' | 'transfer-register';
  altText: string;
}

export const ArchivalIllustration: React.FC<ArchivalIllustrationProps> = ({ type, altText }) => {
  const { t } = useI18n();

  return (
    <figure
      style={{
        margin: '0 0 12px 0',
        padding: '10px',
        backgroundColor: '#DFD2BC',
        border: '1px solid #BEA989',
        borderRadius: '10px',
      }}
    >
      {type === 'old-tower' && (
        <svg
          role="img"
          aria-label={altText}
          viewBox="0 0 320 96"
          width="100%"
          height="84"
          style={{ display: 'block' }}
        >
          <title>{altText}</title>
          <rect x="2" y="2" width="316" height="92" rx="6" fill="#E8DCC8" stroke="#8C7756" strokeDasharray="4 2" />
          {/* Stamp / Seal of Old Tower */}
          <circle cx="54" cy="48" r="32" fill="none" stroke="#172432" strokeWidth="2" />
          <circle cx="54" cy="48" r="27" fill="none" stroke="#172432" strokeWidth="1" strokeDasharray="2 2" />
          {/* Old Stone Tower silhouette */}
          <path d="M42 68 L46 32 L62 32 L66 68 Z" fill="none" stroke="#172432" strokeWidth="2" />
          <polygon points="40,32 54,18 68,32" fill="#172432" />
          <circle cx="54" cy="44" r="6" fill="#E8DCC8" stroke="#172432" strokeWidth="1.8" />
          <line x1="54" y1="44" x2="54" y2="40" stroke="#172432" strokeWidth="1.5" />
          <line x1="54" y1="44" x2="57" y2="44" stroke="#172432" strokeWidth="1.5" />
          {/* Archival lines */}
          <text x="102" y="32" fill="#172432" fontSize="11" fontWeight="700" fontFamily="serif">
            {t('illus.oldTower.stamp')}
          </text>
          <text x="102" y="51" fill="#33475B" fontSize="12" fontWeight="600" fontFamily="sans-serif">
            {t('illus.oldTower.date')}
          </text>
          <text x="102" y="70" fill="#5A4628" fontSize="10" fontFamily="monospace">
            {t('illus.oldTower.code')}
          </text>
        </svg>
      )}

      {type === 'new-tower' && (
        <svg
          role="img"
          aria-label={altText}
          viewBox="0 0 320 96"
          width="100%"
          height="84"
          style={{ display: 'block' }}
        >
          <title>{altText}</title>
          <rect x="2" y="2" width="316" height="92" rx="6" fill="#E8DCC8" stroke="#8C7756" />
          {/* Newspaper masthead rule */}
          <line x1="16" y1="22" x2="304" y2="22" stroke="#172432" strokeWidth="2" />
          <line x1="16" y1="26" x2="304" y2="26" stroke="#172432" strokeWidth="0.8" />
          {/* New Modern Tower silhouette */}
          <rect x="34" y="32" width="28" height="48" fill="none" stroke="#172432" strokeWidth="2" />
          <rect x="39" y="26" width="18" height="6" fill="#172432" />
          <circle cx="48" cy="48" r="7" fill="#E8DCC8" stroke="#172432" strokeWidth="2" />
          <line x1="48" y1="48" x2="48" y2="43" stroke="#172432" strokeWidth="1.5" />
          <line x1="48" y1="48" x2="52" y2="50" stroke="#172432" strokeWidth="1.5" />
          <text x="84" y="18" fill="#172432" fontSize="11" fontWeight="700" fontFamily="serif">
            {t('illus.newTower.masthead')}
          </text>
          <text x="84" y="48" fill="#172432" fontSize="12" fontWeight="700" fontFamily="sans-serif">
            {t('illus.newTower.date')}
          </text>
          <text x="84" y="68" fill="#5A4628" fontSize="10" fontFamily="monospace">
            {t('illus.newTower.code')}
          </text>
        </svg>
      )}

      {type === 'transfer-register' && (
        <svg
          role="img"
          aria-label={altText}
          viewBox="0 0 320 96"
          width="100%"
          height="84"
          style={{ display: 'block' }}
        >
          <title>{altText}</title>
          <rect x="2" y="2" width="316" height="92" rx="6" fill="#E8DCC8" stroke="#3A8C79" strokeWidth="2" />
          {/* Old Tower -> Arrow -> New Tower */}
          <path d="M24 68 L27 38 L39 38 L42 68 Z" fill="none" stroke="#172432" strokeWidth="1.8" />
          <polygon points="22,38 33,26 44,38" fill="#172432" />
          {/* Transfer Arrow */}
          <line x1="50" y1="50" x2="82" y2="50" stroke="#3A8C79" strokeWidth="2.5" strokeDasharray="3 2" />
          <polygon points="82,45 90,50 82,55" fill="#3A8C79" />
          {/* Clock gear in middle */}
          <circle cx="66" cy="36" r="7" fill="#E8DCC8" stroke="#C58A45" strokeWidth="2" />
          {/* New Tower */}
          <rect x="96" y="32" width="22" height="36" fill="none" stroke="#172432" strokeWidth="1.8" />
          <circle cx="107" cy="45" r="5" fill="none" stroke="#172432" strokeWidth="1.5" />
          <text x="132" y="32" fill="#172432" fontSize="11" fontWeight="700" fontFamily="serif">
            {t('illus.transfer.stamp')}
          </text>
          <text x="132" y="51" fill="#1E5245" fontSize="12" fontWeight="700" fontFamily="sans-serif">
            {t('illus.transfer.date')}
          </text>
          <text x="132" y="70" fill="#5A4628" fontSize="10" fontFamily="monospace">
            {t('illus.transfer.code')}
          </text>
        </svg>
      )}
      <figcaption
        style={{
          fontSize: '0.78rem',
          color: '#33475B',
          marginTop: '4px',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '4px',
        }}
      >
        <span>{t('evidence.ficSimile')}</span>
        <span style={{ fontWeight: 600 }}>{t('evidence.illustrationA11y')}</span>
      </figcaption>
    </figure>
  );
};
