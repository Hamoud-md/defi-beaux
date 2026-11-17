import React from 'react';
import { useI18n } from '../../i18n/I18nContext';

interface FlipCardButtonProps {
  isFlipped: boolean;
  onToggle: () => void;
}

/**
 * Circular pictogram that turns the surrounding card over on its Y axis.
 * It is a real <button> so it stays reachable with the keyboard.
 */
export const FlipCardButton: React.FC<FlipCardButtonProps> = ({ isFlipped, onToggle }) => {
  const { t } = useI18n();

  return (
    <button
      type="button"
      className="card-flip-btn"
      onClick={(event) => {
        event.stopPropagation();
        onToggle();
      }}
      aria-pressed={isFlipped}
      aria-label={isFlipped ? t('card3d.flip.restore') : t('card3d.flip.reveal')}
      title={isFlipped ? t('card3d.flip.restore') : t('card3d.flip.reveal')}
    >
      <span aria-hidden="true">{isFlipped ? '↩' : '↻'}</span>
    </button>
  );
};
