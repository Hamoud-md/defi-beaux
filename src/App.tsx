import React, { useEffect, useReducer, useState } from 'react';
import {
  ArchiveDataset,
  ConclusionType,
  Contribution,
  InteractionMode,
  TransverseState,
  ViewStepId,
} from './types/archive';
import {
  BROKEN_REFERENCE_DATASET,
  CASE_C001_DATASET,
  EMPTY_ARCHIVE_DATASET,
  getLocalizedDataset,
} from './data/caseC001';
import { useI18n } from './i18n/I18nContext';
import { calculateFactualProgress, validateDataset } from './domain/validation';
import {
  clearInvestigationSession,
  isSimulateStorageUnavailable,
  loadInvestigationSession,
  loadSavedContributions,
  saveAndVerifyContribution,
  saveInvestigationSession,
  setSimulateStorageUnavailable,
} from './services/storage';
import {
  createInitialInvestigation,
  investigationReducer,
} from './state/investigationReducer';

import { CaseHeader } from './components/CaseHeader';
import { ProgressIndicator } from './components/ProgressIndicator';
import { StatusMessage } from './components/StatusMessage';
import { DiscoveryView } from './components/DiscoveryView';
import { ComparisonView } from './components/ComparisonView';
import { MissingBridge } from './components/MissingBridge';
import { HypothesisState } from './components/HypothesisState';
import { ConclusionPanel } from './components/ConclusionPanel';
import { ContributionReceipt } from './components/ContributionReceipt';

export const App: React.FC = () => {
  const { locale, t } = useI18n();

  // Dataset state (supports switching for automated QA tests A20 / A21 and localization)
  const [currentDataset, setCurrentDataset] = useState<ArchiveDataset>(() => getLocalizedDataset(locale));
  const [datasetError, setDatasetError] = useState<string | null>(null);

  // Update dataset when locale changes (if not running a custom test dataset)
  useEffect(() => {
    setCurrentDataset((prev) => {
      if (prev === EMPTY_ARCHIVE_DATASET || prev === BROKEN_REFERENCE_DATASET) {
        return prev;
      }
      return getLocalizedDataset(locale);
    });
  }, [locale]);

  // Reduced motion preference (OS + user toggle)
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  // Storage failure simulation toggle for test A22
  const [storageSimulatedDown, setStorageSimulatedDown] = useState<boolean>(false);
  const [storageErrorBanner, setStorageErrorBanner] = useState<string | null>(null);

  // Investigation session state
  const [investigation, dispatch] = useReducer(
    investigationReducer,
    createInitialInvestigation('C001')
  );

  // Saved contributions list from LocalStorage
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [activeReceipt, setActiveReceipt] = useState<Contribution | null>(null);

  // Status message & banner
  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  // 1. Initial Session & Contributions Restoration (F08 / A16)
  useEffect(() => {
    const { restored, corruptedError } = loadInvestigationSession('C001');
    if (restored) {
      dispatch({ type: 'RESTORE_INVESTIGATION', investigation: restored });
      setStatusNotification('Session précédente restaurée depuis votre appareil.');
    } else if (corruptedError) {
      setStatusNotification(corruptedError);
    }

    const loaded = loadSavedContributions();
    if (loaded.ok && loaded.contributions.length > 0) {
      setContributions(loaded.contributions);
      // If the latest saved contribution belongs to this case, keep it accessible for receipt
      const latestCaseContrib = loaded.contributions.find((c) => c.caseId === 'C001');
      if (latestCaseContrib) {
        setActiveReceipt(latestCaseContrib);
      }
    }
  }, []);

  // 2. Validate Dataset Integrity whenever dataset changes (Section 12.3, A20, A21)
  useEffect(() => {
    const validation = validateDataset(currentDataset);
    if (!validation.valid) {
      setDatasetError(validation.errors.join(' | '));
    } else {
      setDatasetError(null);
    }
  }, [currentDataset]);

  // 3. Auto-save session to LocalStorage on investigation change (F08)
  useEffect(() => {
    if (currentDataset.caseData) {
      saveInvestigationSession(investigation);
    }
  }, [investigation, currentDataset]);

  // 4. Update data-reduced-motion attribute on root
  useEffect(() => {
    document.documentElement.setAttribute('data-reduced-motion', reducedMotion ? 'true' : 'false');
  }, [reducedMotion]);

  // Derive transverse states
  const transverseStates: TransverseState[] = [];
  if (datasetError) {
    if (datasetError.includes('vide')) {
      transverseStates.push('empty');
    } else {
      transverseStates.push('error');
    }
  } else {
    transverseStates.push('initial');
  }

  if (activeReceipt) {
    transverseStates.push('success');
  }

  if (investigation.restoredFromStorage) {
    transverseStates.push('revisited');
  }

  if (reducedMotion) {
    transverseStates.push('reduced-motion');
  }

  if (storageSimulatedDown || isSimulateStorageUnavailable()) {
    transverseStates.push('storage-unavailable');
  }

  // Factual Progress (F10 / OFF-04 / A11)
  const factualProgress = calculateFactualProgress(investigation, Boolean(activeReceipt));

  // Handlers
  const handleInspectSource = (sourceId: string) => {
    dispatch({ type: 'INSPECT_SOURCE', sourceId });
  };

  const handleSelectQuestion = (questionId: string) => {
    const q = currentDataset.questions.find((item) => item.id === questionId);
    const unlocks = q?.relevantSourceIds ?? [];
    dispatch({ type: 'SELECT_QUESTION', questionId, unlocksSourceIds: unlocks });
  };

  const handleEvaluateRelation = (relationId: string) => {
    dispatch({ type: 'EVALUATE_RELATION', relationId });
  };

  const handleStepNavigation = (step: ViewStepId) => {
    dispatch({ type: 'NAVIGATE_STEP', step });
  };

  const handleToggleReducedMotion = () => {
    setReducedMotion((prev) => !prev);
  };

  const handleToggleInteractionMode = (mode: InteractionMode) => {
    dispatch({ type: 'SET_INTERACTION_MODE', mode });
  };

  const handleResetSession = () => {
    clearInvestigationSession();
    dispatch({ type: 'RESET_INVESTIGATION', caseId: 'C001' });
    setActiveReceipt(null);
    setStatusNotification('Enquête réinitialisée avec succès.');
  };

  const handleToggleStorageSimulation = () => {
    const next = !storageSimulatedDown;
    setStorageSimulatedDown(next);
    setSimulateStorageUnavailable(next);
    if (next) {
      setStorageErrorBanner('Mode simulation d’échec de stockage actif (Test A22).');
    } else {
      setStorageErrorBanner(null);
    }
  };

  // Submit and verify contribution (F07 / M07 / A08 / A22)
  const handleSubmitContribution = (sanitizedJustification: string) => {
    if (!investigation.draftConclusionType) {
      return;
    }

    setStorageErrorBanner(null);

    const saveResult = saveAndVerifyContribution({
      caseId: 'C001',
      conclusionType: investigation.draftConclusionType,
      justification: sanitizedJustification,
      referencedSourceIds: investigation.draftReferencedSourceIds,
      selectedQuestionId: investigation.selectedQuestionId,
    });

    if (!saveResult.ok || !saveResult.data) {
      // Storage failed (A22): preserve input, show error, never issue fake receipt
      setStorageErrorBanner(
        saveResult.error ?? 'Erreur d’enregistrement dans le stockage local.'
      );
      return;
    }

    // Success verified by read-back: update state and navigate to receipt
    setActiveReceipt(saveResult.data);
    setContributions((prev) => [saveResult.data!, ...prev]);
    dispatch({ type: 'MARK_CONTRIBUTED' });
    setStatusNotification('Contribution enregistrée et vérifiée avec succès dans le registre local.');
  };

  return (
    <div className="app-container" data-testid="app-root">
        {/* Skip link for keyboard users (A10) */}
        <a href="#main-content" className="skip-link">
          {t('skip.link')}
        </a>

      {/* Case Header & Global Controls */}
      {currentDataset.caseData && (
        <CaseHeader
          caseData={currentDataset.caseData}
          reducedMotion={reducedMotion}
          onToggleReducedMotion={handleToggleReducedMotion}
          interactionMode={investigation.interactionMode}
          onToggleInteractionMode={handleToggleInteractionMode}
          onResetSession={handleResetSession}
        />
      )}

      {/* Transverse Status & Feedback */}
      <StatusMessage
        transverseStates={transverseStates}
        message={statusNotification}
        errorDetail={datasetError || storageErrorBanner}
        onDismissMessage={() => {
          setStatusNotification(null);
          setStorageErrorBanner(null);
        }}
        onRetryAction={
          datasetError
            ? () => {
                setCurrentDataset(CASE_C001_DATASET);
                setDatasetError(null);
              }
            : undefined
        }
        retryLabel="Rétablir le dossier C001 nominal"
      />

      {/* Main Investigation Journey */}
      <main id="main-content" tabIndex={-1}>
        {datasetError ? (
          <div
            role="alert"
            data-testid="dataset-error-screen"
            style={{
              backgroundColor: 'var(--archive-crimson-surface)',
              border: '2px solid var(--archive-crimson)',
              borderRadius: 'var(--radius-card)',
              padding: '28px',
              textAlign: 'center',
            }}
          >
            <h2 style={{ fontSize: '1.6rem', color: '#FFB4B4', marginBottom: '12px' }}>
              Dossier archivistique indisponible ou corrompu
            </h2>
            <p style={{ maxWidth: '650px', margin: '0 auto 20px auto', color: 'var(--text-light)' }}>
              {datasetError}
            </p>
            <button
              type="button"
              onClick={() => {
                setCurrentDataset(CASE_C001_DATASET);
                setDatasetError(null);
              }}
              data-testid="reload-valid-dataset-btn"
              style={{
                backgroundColor: 'var(--archive-amber)',
                color: 'var(--archive-ink)',
                fontWeight: 700,
                fontSize: '1rem',
                padding: '12px 24px',
                borderRadius: 'var(--radius-control)',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Recharger le dossier C001 complet
            </button>
          </div>
        ) : (
          <>
            {/* Factual Progress Bar & Step Navigation */}
            <ProgressIndicator
              currentStep={investigation.currentStep}
              onSelectStep={handleStepNavigation}
              progress={factualProgress}
              hasVerifiedReceipt={Boolean(activeReceipt)}
            />

            {/* Step S01: Discovery / Dossier Overview */}
            {investigation.currentStep === 'S01' && currentDataset.caseData && (
              <DiscoveryView
                caseData={currentDataset.caseData}
                onStartInvestigation={() => dispatch({ type: 'START_INVESTIGATION' })}
              />
            )}

            {/* Step S02: Comparison of Initial Sources S001 and S002 */}
            {investigation.currentStep === 'S02' && (
              <ComparisonView
                sources={currentDataset.sources}
                inspectedSourceIds={investigation.inspectedSourceIds}
                onInspectSource={handleInspectSource}
                onProceedToBridge={() => dispatch({ type: 'NAVIGATE_STEP', step: 'S03' })}
                onBackToDiscovery={() => dispatch({ type: 'NAVIGATE_STEP', step: 'S01' })}
              />
            )}

            {/* Step S03: Signature Interaction - The Missing Bridge */}
            {investigation.currentStep === 'S03' && (
              <MissingBridge
                dataset={currentDataset}
                inspectedSourceIds={investigation.inspectedSourceIds}
                selectedQuestionId={investigation.selectedQuestionId}
                exploredQuestionIds={investigation.exploredQuestionIds}
                interactionMode={investigation.interactionMode}
                onSelectQuestion={handleSelectQuestion}
                onInspectSource={handleInspectSource}
                onProceedToAnalysis={() => dispatch({ type: 'NAVIGATE_STEP', step: 'S04' })}
              />
            )}

            {/* Step S04: Clue Inspection & Hypothesis Reasoning (H001, H002, H003) */}
            {investigation.currentStep === 'S04' && (
              <HypothesisState
                dataset={currentDataset}
                inspectedSourceIds={investigation.inspectedSourceIds}
                exploredQuestionIds={investigation.exploredQuestionIds}
                evaluatedRelationIds={investigation.evaluatedRelationIds}
                onEvaluateRelation={handleEvaluateRelation}
                onInspectSource={handleInspectSource}
                onProceedToConclusion={() => dispatch({ type: 'NAVIGATE_STEP', step: 'S05' })}
              />
            )}

            {/* Step S05: Formulate Argumented Conclusion */}
            {investigation.currentStep === 'S05' && (
              <ConclusionPanel
                dataset={currentDataset}
                investigation={investigation}
                storageError={storageErrorBanner}
                onSelectConclusionType={(conclusionType: ConclusionType) =>
                  dispatch({ type: 'SET_CONCLUSION_TYPE', conclusionType })
                }
                onChangeJustification={(justification: string) =>
                  dispatch({ type: 'SET_JUSTIFICATION', justification })
                }
                onToggleReferencedSource={(sourceId: string) =>
                  dispatch({ type: 'TOGGLE_REFERENCED_SOURCE', sourceId })
                }
                onInspectSource={handleInspectSource}
                onSubmitContribution={handleSubmitContribution}
                onNavigateToMissingBridge={() => dispatch({ type: 'NAVIGATE_STEP', step: 'S03' })}
              />
            )}

            {/* Step S06: Verified Contribution Receipt */}
            {investigation.currentStep === 'S06' && (
              <ContributionReceipt
                contribution={activeReceipt}
                allContributions={contributions}
                dataset={currentDataset}
                onReviseVerdict={() => dispatch({ type: 'REVISE_VERDICT' })}
                onRestartInvestigation={handleResetSession}
              />
            )}
          </>
        )}
      </main>

      {/* Footer & Test / QA Panel */}
      <footer
        style={{
          marginTop: '60px',
          borderTop: '1px solid var(--archive-midnight-border)',
          paddingTop: '24px',
          fontSize: '0.86rem',
          color: 'var(--text-muted)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div>
            <strong>{t('app.footer.title')}</strong> — {t('app.footer.challenge')}
            <br />
            {t('app.footer.disclaimer')}
          </div>

          {/* Test Utilities Toolbar (A20, A21, A22 verification tools) */}
          <div
            role="toolbar"
            aria-label="Outils de test et validation QA"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>Outils de test :</span>
            <button
              type="button"
              onClick={handleToggleStorageSimulation}
              aria-pressed={storageSimulatedDown}
              data-testid="toggle-storage-fail-btn"
              style={{
                backgroundColor: storageSimulatedDown
                  ? 'var(--archive-crimson)'
                  : 'var(--archive-midnight)',
                color: 'var(--text-light)',
                border: '1px solid var(--archive-midnight-border)',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '0.78rem',
                cursor: 'pointer',
              }}
            >
              {storageSimulatedDown ? '✕ Simuler panne stockage : ON' : 'Simuler panne stockage (A22)'}
            </button>

            <button
              type="button"
              onClick={() => setCurrentDataset(EMPTY_ARCHIVE_DATASET)}
              data-testid="load-empty-dataset-btn"
              style={{
                backgroundColor: 'var(--archive-midnight)',
                color: 'var(--text-light)',
                border: '1px solid var(--archive-midnight-border)',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '0.78rem',
                cursor: 'pointer',
              }}
            >
              Tester Dataset vide (A21)
            </button>

            <button
              type="button"
              onClick={() => setCurrentDataset(BROKEN_REFERENCE_DATASET)}
              data-testid="load-broken-dataset-btn"
              style={{
                backgroundColor: 'var(--archive-midnight)',
                color: 'var(--text-light)',
                border: '1px solid var(--archive-midnight-border)',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '0.78rem',
                cursor: 'pointer',
              }}
            >
              Tester Réf. rompue (A20)
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
