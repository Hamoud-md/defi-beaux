import React, { useRef, useState } from 'react';
import {
  ArchiveDataset,
  ConclusionType,
  ContributionValidationErrors,
  Investigation,
} from '../types/archive';
import { CONCLUSION_OPTIONS } from '../data/caseC001';
import { isSourceAccessible, validateContributionDraft } from '../domain/validation';

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
  const [validationErrors, setValidationErrors] = useState<ContributionValidationErrors>({});
  const justificationRef = useRef<HTMLTextAreaElement | null>(null);
  const firstConclusionRadioRef = useRef<HTMLInputElement | null>(null);
  const firstSourceCheckboxRef = useRef<HTMLInputElement | null>(null);

  const getConclusionLabel = (val: ConclusionType): string => {
    return CONCLUSION_OPTIONS.find((o) => o.value === val)?.label ?? val;
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
      // M08 / A09: Focus the first invalid control immediately for keyboard recovery
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
    <section
      aria-labelledby="conclusion-panel-heading"
      data-testid="conclusion-panel-section"
      className="animate-entry"
    >
      <div style={{ marginBottom: '20px' }}>
        <h2
          id="conclusion-panel-heading"
          style={{ fontSize: '1.75rem', margin: '0 0 8px 0', color: 'var(--text-light)' }}
        >
          Conclusion argumentée &amp; Dépôt au registre local (S05)
        </h2>
        <p style={{ margin: 0, color: 'var(--text-muted)' }}>
          Sélectionnez votre conclusion, rédigez votre justification sans fausse certitude, et
          reliez les archives effectivement consultées.
        </p>
      </div>

      {/* Reversible Verdict Comparison (P11 / F06 / M06 / A07) */}
      {latestRevision && (
        <div
          role="region"
          aria-label="Historique de révision du verdict (Avant / Après)"
          data-testid="reversible-verdict-comparison"
          style={{
            backgroundColor: 'rgba(197, 138, 69, 0.16)',
            border: '2px solid var(--archive-amber)',
            borderRadius: 'var(--radius-card)',
            padding: '16px',
            marginBottom: '20px',
            transition: 'all var(--motion-m06)',
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
              ↺ Verdict réversible (F06 / M06) — Comparaison Avant / Après
            </strong>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Vos pièces consultées ({investigation.inspectedSourceIds.join(', ')}) sont intégralement
              conservées.
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
                backgroundColor: 'rgba(16, 26, 36, 0.7)',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid var(--archive-midnight-border)',
              }}
            >
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.76rem' }}>
                Position précédente :
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
                Nouvelle position active :
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
            style={{
              backgroundColor: 'var(--archive-crimson-surface)',
              border: '2px solid var(--archive-crimson)',
              borderRadius: 'var(--radius-control)',
              padding: '14px 16px',
              marginBottom: '18px',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <span>{validationErrors.questionRequired}</span>
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
              Aller au Missing Bridge (S03)
            </button>
          </div>
        )}

        {/* 1. Verdict Selection */}
        <fieldset
          style={{
            border: validationErrors.conclusionType
              ? '2px solid var(--archive-crimson)'
              : '1px solid var(--archive-midnight-border)',
            borderRadius: 'var(--radius-card)',
            padding: '18px',
            marginBottom: '20px',
            backgroundColor: 'var(--archive-ink-elevated)',
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
            1. Choisissez votre verdict d’enquête (valeurs autorisées) *
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
              ⚠ {validationErrors.conclusionType}
            </p>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {CONCLUSION_OPTIONS.map((option, idx) => {
              const isChecked = investigation.draftConclusionType === option.value;
              return (
                <label
                  key={option.value}
                  data-testid={`conclusion-option-${option.value}`}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '14px',
                    borderRadius: 'var(--radius-control)',
                    backgroundColor: isChecked
                      ? 'var(--archive-midnight)'
                      : 'rgba(16, 26, 36, 0.7)',
                    border: isChecked
                      ? '2px solid var(--archive-amber-bright)'
                      : '1px solid var(--archive-midnight-border)',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    ref={idx === 0 ? firstConclusionRadioRef : undefined}
                    type="radio"
                    name="conclusionType"
                    value={option.value}
                    checked={isChecked}
                    onChange={() => {
                      onSelectConclusionType(option.value);
                      if (validationErrors.conclusionType) {
                        setValidationErrors((prev) => ({ ...prev, conclusionType: undefined }));
                      }
                    }}
                    aria-describedby={
                      validationErrors.conclusionType ? 'conclusion-type-error' : undefined
                    }
                    style={{ marginTop: '4px', transform: 'scale(1.2)' }}
                  />
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: '1rem',
                        color: 'var(--text-light)',
                        marginBottom: '4px',
                      }}
                    >
                      {option.label}{' '}
                      <code
                        style={{
                          fontSize: '0.78rem',
                          color: 'var(--archive-amber-bright)',
                        }}
                      >
                        [{option.value}]
                      </code>
                    </div>
                    <p style={{ margin: '0 0 6px 0', fontSize: '0.9rem', color: 'var(--text-light)' }}>
                      {option.summary}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      <em>{option.epistemicWarning}</em>
                    </p>
                  </div>
                </label>
              );
            })}
          </div>
        </fieldset>

        {/* 2. Referenced Sources Selection */}
        <fieldset
          style={{
            border: validationErrors.referencedSourceIds
              ? '2px solid var(--archive-crimson)'
              : '1px solid var(--archive-midnight-border)',
            borderRadius: 'var(--radius-card)',
            padding: '18px',
            marginBottom: '20px',
            backgroundColor: 'var(--archive-ink-elevated)',
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
            2. Citez les sources documentaires consultées à l’appui de votre conclusion *
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

              return (
                <div
                  key={src.id}
                  style={{
                    backgroundColor: referenced
                      ? 'var(--archive-teal-surface)'
                      : 'rgba(16, 26, 36, 0.7)',
                    border: referenced
                      ? '2px solid var(--archive-teal-bright)'
                      : '1px solid var(--archive-midnight-border)',
                    borderRadius: 'var(--radius-control)',
                    padding: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '8px',
                  }}
                >
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      cursor: inspected ? 'pointer' : 'not-allowed',
                      opacity: inspected ? 1 : 0.75,
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
                        {src.id} — {src.title} ({src.date})
                      </strong>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        {!unlocked
                          ? 'Verrouillé (nécessite la piste Q001)'
                          : inspected
                            ? '✓ Pièce consultée — éligible à la citation'
                            : '○ Non consultée — lisez la pièce pour la citer'}
                      </span>
                    </div>
                  </label>

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
                      Consulter {src.id} maintenant
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </fieldset>

        {/* 3. Argumented Justification */}
        <div
          style={{
            border: validationErrors.justification
              ? '2px solid var(--archive-crimson)'
              : '1px solid var(--archive-midnight-border)',
            borderRadius: 'var(--radius-card)',
            padding: '18px',
            marginBottom: '20px',
            backgroundColor: 'var(--archive-ink-elevated)',
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
              3. Justification argumentée de votre conclusion *
            </label>

            <button
              type="button"
              onClick={() => {
                const sampleText =
                  "Le registre de 1921 évoque un transfert, ce qui rend plausible l'existence de deux événements distincts sans prouver tous les témoignages.";
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
              Insérer une trame d’exemple nuancée (modifiable)
            </button>
          </div>

          <p style={{ margin: '0 0 10px 0', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Expliquez comment les pièces consultées éclairent l’écart entre 1920 et 1922 et ce qui
            demeure incertain (minimum 15 caractères ; balises HTML neutralisées).
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
              ⚠ {validationErrors.justification}
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
            placeholder="Exemple : Le registre technique de 1921 (S003) documente un transfert de la vieille tour vers la nouvelle tour..."
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 'var(--radius-control)',
              border: '1px solid var(--archive-midnight-border)',
              backgroundColor: 'var(--archive-ink)',
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
            style={{
              backgroundColor: 'var(--archive-crimson-surface)',
              border: '2px solid var(--archive-crimson)',
              borderRadius: 'var(--radius-control)',
              padding: '14px 16px',
              marginBottom: '18px',
            }}
          >
            <strong style={{ display: 'block', marginBottom: '4px' }}>
              ✕ Échec d’écriture dans le stockage local — Aucun faux reçu émis :
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
            Enregistrement vérifié dans le stockage local de démonstration (aucune donnée
            personnelle demandée).
          </span>

          <button
            type="submit"
            data-testid="submit-contribution-btn"
            style={{
              backgroundColor: 'var(--archive-amber)',
              color: 'var(--archive-ink)',
              fontWeight: 700,
              fontSize: '1.05rem',
              padding: '12px 24px',
              borderRadius: 'var(--radius-control)',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color var(--motion-m09)',
            }}
          >
            Vérifier et enregistrer la contribution →
          </button>
        </div>
      </form>
    </section>
  );
};
