import React, { useRef, useState } from 'react';
import {
  ArchiveDataset,
  ConclusionType,
  ContributionValidationErrors,
  Investigation,
} from '../types/archive';
import { getLocalizedConclusionOptions } from '../data/caseC001';
import { isSourceAccessible, validateContributionDraft } from '../domain/validation';
import { useI18n } from '../i18n/I18nContext';
import { Deck3D } from './threeD/Deck3D';
import { VerdictCard3D } from './VerdictCard3D';
import { SceneShell } from './SceneShell';

interface ConclusionPanelProps {
  dataset: ArchiveDataset;
  investigation: Investigation;
  storageError: string | null;
  onSelectConclusionType: (conclusionType: ConclusionType) => void;
  onChangeJustification: (text: string) => void;
  onToggleReferencedSource: (sourceId: string) => void;
  onInspectSource: (sourceId: string) => void;
  onSubmitContribution: (sanitizedJustification: string) => void;
  onNavigateToMissingBridge: () => void;
}

export const ConclusionPanel: React.FC<ConclusionPanelProps> = ({
  dataset,
  investigation,
  storageError,
  onSelectConclusionType,
  onChangeJustification,
  onToggleReferencedSource,
  onInspectSource,
  onSubmitContribution,
  onNavigateToMissingBridge,
}) => {
  const { locale, t } = useI18n();
  const conclusionOptions = getLocalizedConclusionOptions(locale);

  const [validationErrors, setValidationErrors] = useState<ContributionValidationErrors>({});
  const justificationRef = useRef<HTMLTextAreaElement | null>(null);
  const firstConclusionRadioRef = useRef<HTMLInputElement | null>(null);
  const firstSourceCheckboxRef = useRef<HTMLInputElement | null>(null);

  const getConclusionLabel = (val: ConclusionType): string => {
    return conclusionOptions.find((o) => o.value === val)?.label ?? val;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = validateContributionDraft(
      {
        conclusionType: investigation.draftConclusionType,
        justification: investigation.draftJustification,
        referencedSourceIds: investigation.draftReferencedSourceIds,
      },
      investigation,
      dataset
    );

    if (!result.valid) {
      setValidationErrors(result.errors);
      if (result.errors.conclusionType && firstConclusionRadioRef.current) {
        firstConclusionRadioRef.current.focus();
      } else if (result.errors.justification && justificationRef.current) {
        justificationRef.current.focus();
      } else if (result.errors.referencedSourceIds && firstSourceCheckboxRef.current) {
        firstSourceCheckboxRef.current.focus();
      }
      return;
    }

    setValidationErrors({});
    onSubmitContribution(result.sanitizedJustification);
  };

  const latestRevision =
    investigation.verdictHistory.length > 0 ? investigation.verdictHistory[0] : null;

  return (
    <SceneShell
      chapter={t('scene.chapter.V')}
      title={t('conclusion.title')}
      lede={t('conclusion.subtitle')}
      titleId="conclusion-panel-heading"
      testId="conclusion-panel-section"
    >
      {/* Reversible Verdict Comparison (P11 / F06 / M06 / A07) */}
      {latestRevision && (
        <div
          role="region"
          aria-label="Historique de révision du verdict (Avant / Après)"
          data-testid="reversible-verdict-comparison"
          className="archive-card"
          data-state="selected"
          style={{
            padding: '16px',
            marginBottom: '20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '8px',
              marginBottom: '10px',
            }}
          >
            <strong style={{ color: 'var(--archive-amber-bright)', fontSize: '0.95rem' }}>
              {t('conclusion.revision.title')}
            </strong>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {t('conclusion.revision.inspected', { n: investigation.inspectedSourceIds.length })}
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '12px',
              fontSize: '0.88rem',
            }}
          >
            <div
              style={{
                backgroundColor: 'rgba(7, 12, 20, 0.7)',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid var(--archive-midnight-border)',
              }}
            >
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.76rem' }}>
                {t('conclusion.revision.previous')}
              </span>
              <strong>{getConclusionLabel(latestRevision.previousConclusion)}</strong>
            </div>

            <div
              style={{
                backgroundColor: 'rgba(58, 140, 121, 0.2)',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid var(--archive-teal-bright)',
              }}
            >
              <span
                style={{
                  color: 'var(--archive-teal-bright)',
                  display: 'block',
                  fontSize: '0.76rem',
                }}
              >
                {t('conclusion.revision.new')}
              </span>
              <strong>{getConclusionLabel(latestRevision.newConclusion)}</strong>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleFormSubmit} noValidate>
        {/* Question Exploration Prerequisite Error */}
        {validationErrors.questionRequired && (
          <div
            role="alert"
            data-testid="error-question-required"
            className="archive-card"
            data-state="locked"
            style={{
              padding: '14px 16px',
              marginBottom: '18px',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <span>{t('conclusion.error.question')}</span>
            <button
              type="button"
              onClick={onNavigateToMissingBridge}
              style={{
                backgroundColor: 'var(--archive-amber)',
                color: 'var(--archive-ink)',
                fontWeight: 700,
                border: 'none',
                borderRadius: 'var(--radius-control)',
                padding: '8px 14px',
                cursor: 'pointer',
              }}
            >
              {t('conclusion.goToBridge')}
            </button>
          </div>
        )}

        {/* 1. Verdict Selection */}
        <fieldset
          className="scene__panel"
          style={{
            border: validationErrors.conclusionType
              ? '2px solid var(--archive-crimson)'
              : '1px solid rgba(120, 160, 200, 0.14)',
            marginBottom: '20px',
          }}
        >
          <legend
            style={{
              fontWeight: 700,
              fontSize: '1.1rem',
              padding: '0 8px',
              color: 'var(--text-light)',
            }}
          >
            {t('conclusion.fieldset1')}
          </legend>

          {validationErrors.conclusionType && (
            <p
              id="conclusion-type-error"
              role="alert"
              data-testid="error-conclusion-type"
              style={{
                color: '#FFB4B4',
                fontWeight: 700,
                margin: '0 0 12px 0',
                fontSize: '0.92rem',
              }}
            >
              ⚠ {t('conclusion.error.type')}
            </p>
          )}

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '14px',
            }}
          >
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {t('card3d.hint')}
            </span>
          </div>

          <Deck3D
            cards={conclusionOptions.map((option, idx) => ({
              id: option.value,
              node: (
                <VerdictCard3D
                  key={option.value}
                  option={option}
                  isChecked={investigation.draftConclusionType === option.value}
                  isFirst={idx === 0}
                  hasError={Boolean(validationErrors.conclusionType)}
                  inputRef={idx === 0 ? firstConclusionRadioRef : undefined}
                  describedById={
                    validationErrors.conclusionType ? 'conclusion-type-error' : undefined
                  }
                  onSelect={(value) => {
                    onSelectConclusionType(value);
                    if (validationErrors.conclusionType) {
                      setValidationErrors((prev) => ({ ...prev, conclusionType: undefined }));
                    }
                  }}
                  onClearError={() =>
                    setValidationErrors((prev) => ({ ...prev, conclusionType: undefined }))
                  }
                />
              ),
            }))}
            activeId={investigation.draftConclusionType}
            ariaLabel={t('card3d.deck.verdicts')}
            dataTestId="verdict-cards-deck"
          />
        </fieldset>

        {/* 2. Referenced Sources Selection */}
        <fieldset
          className="scene__panel"
          style={{
            border: validationErrors.referencedSourceIds
              ? '2px solid var(--archive-crimson)'
              : '1px solid rgba(120, 160, 200, 0.14)',
            marginBottom: '20px',
          }}
        >
          <legend
            style={{
              fontWeight: 700,
              fontSize: '1.1rem',
              padding: '0 8px',
              color: 'var(--text-light)',
            }}
          >
            {t('conclusion.fieldset2')}
          </legend>

          {validationErrors.referencedSourceIds && (
            <p
              id="referenced-sources-error"
              role="alert"
              data-testid="error-referenced-sources"
              style={{
                color: '#FFB4B4',
                fontWeight: 700,
                margin: '0 0 12px 0',
                fontSize: '0.92rem',
              }}
            >
              ⚠ {validationErrors.referencedSourceIds}
            </p>
          )}

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '12px',
            }}
          >
            {dataset.sources.map((src, idx) => {
              const unlocked = isSourceAccessible(
                src,
                investigation.selectedQuestionId,
                investigation.exploredQuestionIds
              );
              const inspected = investigation.inspectedSourceIds.includes(src.id);
              const referenced = investigation.draftReferencedSourceIds.includes(src.id);

              const cardState = !unlocked
                ? 'locked'
                : referenced
                  ? 'selected'
                  : inspected
                    ? 'revealed'
                    : 'neutral';

              return (
                <div
                  key={src.id}
                  className="archive-card"
                  data-state={cardState}
                  style={{
                    padding: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '10px',
                  }}
                >
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      cursor: inspected ? 'pointer' : 'not-allowed',
                      opacity: inspected ? 1 : 0.8,
                    }}
                  >
                    <input
                      ref={idx === 0 ? firstSourceCheckboxRef : undefined}
                      type="checkbox"
                      checked={referenced}
                      disabled={!inspected}
                      onChange={() => {
                        onToggleReferencedSource(src.id);
                        if (validationErrors.referencedSourceIds) {
                          setValidationErrors((prev) => ({
                            ...prev,
                            referencedSourceIds: undefined,
                          }));
                        }
                      }}
                      data-testid={`cite-source-checkbox-${src.id}`}
                      style={{ marginTop: '4px', transform: 'scale(1.2)' }}
                    />
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.95rem' }}>
                        {src.title} ({src.date})
                      </strong>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        {!unlocked
                          ? t('conclusion.source.locked')
                          : inspected
                            ? t('conclusion.source.eligible')
                            : t('conclusion.source.notRead')}
                      </span>
                    </div>
                  </label>

                  {!unlocked && (
                    <div className="lock-note">
                      <span className="lock-note__icon" aria-hidden="true">
                        🔒
                      </span>
                      <span>
                        <strong>{t('conclusion.source.lockedTitle')}</strong>{' '}
                        {t('conclusion.source.lockedReason', { path: t('bridge.path.spatial') })}
                      </span>
                    </div>
                  )}

                  {unlocked && !inspected && (
                    <button
                      type="button"
                      onClick={() => onInspectSource(src.id)}
                      data-testid={`quick-inspect-${src.id}`}
                      style={{
                        alignSelf: 'flex-start',
                        backgroundColor: 'var(--archive-midnight)',
                        color: 'var(--text-light)',
                        border: '1px solid var(--archive-amber)',
                        borderRadius: '6px',
                        padding: '4px 10px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      {t('conclusion.source.inspectNow')}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </fieldset>

        {/* 3. Argumented Justification */}
        <div
          className="scene__panel"
          style={{
            border: validationErrors.justification
              ? '2px solid var(--archive-crimson)'
              : '1px solid rgba(120, 160, 200, 0.14)',
            marginBottom: '20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '8px',
            }}
          >
            <label
              htmlFor="contribution-justification-input"
              style={{
                fontWeight: 700,
                fontSize: '1.1rem',
                color: 'var(--text-light)',
              }}
            >
              {t('conclusion.fieldset3')}
            </label>

            <button
              type="button"
              onClick={() => {
                const sampleText = t('conclusion.sampleText');
                onChangeJustification(sampleText);
                if (validationErrors.justification) {
                  setValidationErrors((prev) => ({ ...prev, justification: undefined }));
                }
              }}
              data-testid="insert-sample-justification-btn"
              style={{
                backgroundColor: 'var(--archive-midnight)',
                color: 'var(--archive-amber-bright)',
                border: '1px solid var(--archive-midnight-border)',
                borderRadius: '6px',
                padding: '5px 10px',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {t('conclusion.insertSample')}
            </button>
          </div>

          <p style={{ margin: '0 0 10px 0', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            {t('conclusion.justificationHelp')}
          </p>

          {validationErrors.justification && (
            <p
              id="justification-error-msg"
              role="alert"
              data-testid="error-justification"
              style={{
                color: '#FFB4B4',
                fontWeight: 700,
                margin: '0 0 10px 0',
                fontSize: '0.92rem',
              }}
            >
              ⚠ {t('conclusion.error.justification')}
            </p>
          )}

          <textarea
            ref={justificationRef}
            id="contribution-justification-input"
            data-testid="justification-textarea"
            rows={4}
            value={investigation.draftJustification}
            onChange={(e) => {
              onChangeJustification(e.target.value);
              if (validationErrors.justification && e.target.value.trim().length >= 15) {
                setValidationErrors((prev) => ({ ...prev, justification: undefined }));
              }
            }}
            aria-invalid={Boolean(validationErrors.justification)}
            aria-describedby={
              validationErrors.justification ? 'justification-error-msg' : undefined
            }
            placeholder={t('conclusion.justificationPlaceholder')}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 'var(--radius-control)',
              border: '1px solid var(--archive-midnight-border)',
              backgroundColor: 'rgba(7, 12, 20, 0.7)',
              color: 'var(--text-light)',
              fontSize: '1rem',
              lineHeight: 1.5,
              resize: 'vertical',
            }}
          />
        </div>

        {/* Storage Error Recovery Banner (A22) */}
        {storageError && (
          <div
            role="alert"
            data-testid="conclusion-storage-error"
            className="archive-card"
            data-state="locked"
            style={{
              borderColor: 'var(--archive-crimson)',
              padding: '14px 16px',
              marginBottom: '18px',
            }}
          >
            <strong style={{ display: 'block', marginBottom: '4px' }}>
              {t('conclusion.storageError.title')}
            </strong>
            <span>{storageError}</span>
          </div>
        )}

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {t('conclusion.savingDisclaimer')}
          </span>

          <button
            type="submit"
            data-testid="submit-contribution-btn"
            style={{
              backgroundColor: 'var(--archive-amber)',
              color: 'var(--archive-ink)',
              fontWeight: 700,
              fontSize: '1.05rem',
              padding: '13px 26px',
              borderRadius: 'var(--radius-control)',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(197, 138, 69, 0.3)',
              transition: 'background-color var(--motion-m09), transform var(--motion-m09)',
            }}
          >
            {t('conclusion.submit')}
          </button>
        </div>
      </form>
    </SceneShell>
  );
};
