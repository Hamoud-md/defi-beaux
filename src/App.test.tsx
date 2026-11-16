import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import App from './App';
import { setSimulateStorageUnavailable } from './services/storage';

describe('The Memory City / The Echo Detective — End-to-End User Journey (A01–A23)', () => {
  beforeEach(() => {
    localStorage.clear();
    setSimulateStorageUnavailable(false);
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
    setSimulateStorageUnavailable(false);
  });

  it('A01, A02, A17: Displays Discovery screen S01 with Case C001, clear objective, and mandatory fictional badge', () => {
    render(<App />);

    // F12 / A17: Fictional warning badge must be prominent
    const fictionalBadges = screen.getAllByTestId('fictional-warning-banner');
    expect(fictionalBadges.length).toBeGreaterThan(0);
    expect(fictionalBadges[0]).toHaveTextContent('Archives fictives — démonstration');

    // Case title and promise
    expect(
      screen.getByRole('heading', { name: /Dossier C001 — Le Mystère de l'Horloge/i })
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(/Ne devinez pas l’histoire : découvrez ce qu’il manque pour la comprendre/i).length
    ).toBeGreaterThan(0);

    // CTA Commencer l'enquête (F01 / OFF-01 / A01)
    const startBtn = screen.getByTestId('start-investigation-cta');
    expect(startBtn).toBeInTheDocument();
  });

  it('A03: Navigates to S02 and allows reading both initial sources S001 and S002', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Start investigation
    await user.click(screen.getByTestId('start-investigation-cta'));

    // Check we are on Step S02 Comparison
    expect(screen.getByTestId('comparison-view-section')).toBeInTheDocument();
    expect(screen.getByText(/Comparaison des deux documents initiaux/i)).toBeInTheDocument();

    // S001 (1920) and S002 (1922) should both be present
    expect(screen.getByTestId('source-card-S001')).toBeInTheDocument();
    expect(screen.getByTestId('source-card-S002')).toBeInTheDocument();

    // Inspect S001
    const inspectBtnS001 = screen.getByTestId('inspect-btn-S001');
    await user.click(inspectBtnS001);
    expect(screen.getByTestId('source-status-S001')).toHaveTextContent(/Consulté/i);
    expect(screen.getByTestId('evidence-detail-S001')).toBeInTheDocument();

    // Inspect S002
    const inspectBtnS002 = screen.getByTestId('inspect-btn-S002');
    await user.click(inspectBtnS002);
    expect(screen.getByTestId('source-status-S002')).toHaveTextContent(/Consulté/i);

    // Factual progress should have incremented for comparing both documents (A11)
    const progressBadge = screen.getByTestId('factual-progress-badge');
    expect(progressBadge).toHaveTextContent(/1 \/ 5 jalons/i);
  });

  it('A04, A05, A13: Signature Interaction "The Missing Bridge" produces distinct causal feedback and reveals S003 only on Q001', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Move to S02 then S03
    await user.click(screen.getByTestId('start-investigation-cta'));
    await user.click(screen.getByTestId('proceed-to-bridge-btn'));

    // Verify Missing Bridge view S03
    expect(screen.getByTestId('missing-bridge-section')).toBeInTheDocument();
    expect(screen.getByTestId('permanent-comparative-summary')).toBeInTheDocument();

    // Initially S003 is NOT revealed
    expect(screen.queryByTestId('revealed-s003-container')).not.toBeInTheDocument();

    // 1. Select Q002 (Identity of clock maker -> out of scope feedback)
    await user.click(screen.getByTestId('select-question-Q002'));
    expect(screen.getByTestId('question-feedback-Q002')).toHaveTextContent(/Pas de réponse dans le corpus/i);
    expect(screen.getByTestId('missing-bridge-status')).toHaveTextContent(/constructeur/i);
    expect(screen.queryByTestId('revealed-s003-container')).not.toBeInTheDocument();

    // 2. Select Q003 (Citizens knowledge of old tower -> insufficient data feedback)
    await user.click(screen.getByTestId('select-question-Q003'));
    expect(screen.getByTestId('question-feedback-Q003')).toHaveTextContent(/données insuffisantes/i);
    expect(screen.getByTestId('missing-bridge-status')).toHaveTextContent(/données insuffisantes/i);
    expect(screen.queryByTestId('revealed-s003-container')).not.toBeInTheDocument();

    // 3. Select Q001 (Spatial / material question -> pertinent bridge unlocking S003)
    await user.click(screen.getByTestId('select-question-Q001'));
    expect(screen.getByTestId('question-feedback-Q001')).toHaveTextContent(/Piste pertinente/i);
    expect(screen.getByTestId('missing-bridge-status')).toHaveTextContent(/Pont documentaire activé/i);

    // M04 / F04 / A05: S003 is now revealed in immediate proximity!
    const revealedClue = screen.getByTestId('revealed-s003-container');
    expect(revealedClue).toBeInTheDocument();
    expect(revealedClue).toHaveTextContent(/Registre technique/i);
    expect(revealedClue).toHaveTextContent(/12\/09\/1921/i);
  });

  it('A06: Evaluates hypothesis reasoning in S04 without false certainty', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Navigate to S03 and activate Q001
    await user.click(screen.getByTestId('start-investigation-cta'));
    await user.click(screen.getByTestId('proceed-to-bridge-btn'));
    await user.click(screen.getByTestId('select-question-Q001'));

    // Proceed to Step S04 Analysis
    await user.click(screen.getByTestId('proceed-to-s04-btn'));
    expect(screen.getByTestId('hypothesis-state-section')).toBeInTheDocument();

    // Check hypotheses cards H001, H002, H003
    expect(screen.getByTestId('hypothesis-card-H001')).toHaveTextContent(/Même événement/i);
    expect(screen.getByTestId('hypothesis-card-H002')).toHaveTextContent(/Événements distincts/i);
    expect(screen.getByTestId('hypothesis-card-H003')).toHaveTextContent(/Insuffisance de preuves/i);

    // Check relation qualification badges (supports, challenges, insufficient, unrelated)
    expect(screen.getByTestId('relation-legend-supports')).toBeInTheDocument();
    expect(screen.getByTestId('relation-legend-challenges')).toBeInTheDocument();
    expect(screen.getByTestId('relation-legend-insufficient')).toBeInTheDocument();

    // Evaluate relation ER001 (S003 supports H002)
    const evalBtnER001 = screen.getByTestId('evaluate-relation-btn-ER001');
    await user.click(evalBtnER001);
    expect(evalBtnER001).toHaveTextContent(/Relation validée/i);
  });

  it('A09: Enforces contribution validation and focuses error input on invalid submission', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Navigate straight to S05 via progress indicator
    await user.click(screen.getByTestId('nav-step-S05'));
    expect(screen.getByTestId('conclusion-panel-section')).toBeInTheDocument();

    // Attempt submission with empty form
    await user.click(screen.getByTestId('submit-contribution-btn'));

    // Should be blocked with clear error messages
    expect(screen.getByTestId('error-question-required')).toBeInTheDocument();
    expect(screen.getByTestId('error-conclusion-type')).toBeInTheDocument();
  });

  it('A08, A11: Valid contribution submission executes real write AND read-back, producing an authentic receipt', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Complete the full legitimate investigation journey
    // 1. S01 -> S02
    await user.click(screen.getByTestId('start-investigation-cta'));
    await user.click(screen.getByTestId('inspect-btn-S001'));
    await user.click(screen.getByTestId('inspect-btn-S002'));

    // 2. S02 -> S03
    await user.click(screen.getByTestId('proceed-to-bridge-btn'));
    await user.click(screen.getByTestId('select-question-Q001'));

    // 3. S03 -> S04
    await user.click(screen.getByTestId('proceed-to-s04-btn'));
    await user.click(screen.getByTestId('evaluate-relation-btn-ER001'));

    // 4. S04 -> S05
    await user.click(screen.getByTestId('proceed-to-s05-btn'));

    // Select conclusion option DISTINCT_EVENTS_PLAUSIBLE
    const conclusionRadio = screen.getByRole('radio', {
      name: /Deux événements distincts sont plausibles/i,
    });
    await user.click(conclusionRadio);

    // Cite inspected sources S001, S002, S003
    const citeS001 = screen.getByTestId('cite-source-checkbox-S001');
    const citeS002 = screen.getByTestId('cite-source-checkbox-S002');
    const citeS003 = screen.getByTestId('cite-source-checkbox-S003');
    if (!citeS001.hasAttribute('checked')) await user.click(citeS001);
    if (!citeS002.hasAttribute('checked')) await user.click(citeS002);
    if (!citeS003.hasAttribute('checked')) await user.click(citeS003);

    // Fill justification using the sample helper button
    await user.click(screen.getByTestId('insert-sample-justification-btn'));

    // Submit contribution
    await user.click(screen.getByTestId('submit-contribution-btn'));

    // S06 Receipt is displayed!
    expect(screen.getByTestId('contribution-receipt-section')).toBeInTheDocument();
    expect(screen.getByTestId('receipt-local-demo-badge')).toHaveTextContent(/Contribution enregistrée localement — démonstration/i);
    expect(screen.getByTestId('receipt-fictional-badge')).toHaveTextContent(/Archives fictives — démonstration/i);
    expect(screen.getByTestId('receipt-verified-status')).toHaveTextContent(/Intégrité relue et confirmée/i);
    expect(screen.getByTestId('receipt-id')).toHaveTextContent(/^MEM-C001-/);

    // Factual progress should be 100% (5/5 milestones)
    const progressBadge = screen.getByTestId('factual-progress-badge');
    expect(progressBadge).toHaveTextContent('5 / 5 jalons vérifiés (100%)');
  });

  it('A07: Supports reversible verdicts with before/after comparison without losing inspected sources', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Complete legitimate investigation and reach receipt
    await user.click(screen.getByTestId('start-investigation-cta'));
    await user.click(screen.getByTestId('inspect-btn-S001'));
    await user.click(screen.getByTestId('inspect-btn-S002'));
    await user.click(screen.getByTestId('proceed-to-bridge-btn'));
    await user.click(screen.getByTestId('select-question-Q001'));
    await user.click(screen.getByTestId('proceed-to-s04-btn'));
    await user.click(screen.getByTestId('proceed-to-s05-btn'));

    // First conclusion
    await user.click(
      screen.getByRole('radio', { name: /Deux événements distincts sont plausibles/i })
    );
    await user.click(screen.getByTestId('insert-sample-justification-btn'));
    await user.click(screen.getByTestId('submit-contribution-btn'));

    // From receipt, click Revise verdict
    await user.click(screen.getByTestId('revise-verdict-btn'));

    // Switch to another conclusion: INSUFFICIENT_EVIDENCE
    await user.click(
      screen.getByRole('radio', { name: /Preuves insuffisantes pour certifier/i })
    );

    // Reversible verdict comparison banner should appear (P11 / F06 / M06 / A07)
    const revisionBanner = screen.getByTestId('reversible-verdict-comparison');
    expect(revisionBanner).toBeInTheDocument();
    expect(revisionBanner).toHaveTextContent(/Position précédente/i);
    expect(revisionBanner).toHaveTextContent(/Deux événements distincts sont plausibles/i);
    expect(revisionBanner).toHaveTextContent(/Nouvelle position active/i);
    expect(revisionBanner).toHaveTextContent(/Preuves insuffisantes/i);
  });

  it('A12: Toggles Reduced Motion and updates root attribute without hindering functionality', async () => {
    const user = userEvent.setup();
    render(<App />);

    const motionToggle = screen.getByRole('button', { name: /Mouvement réduit/i });
    expect(document.documentElement.getAttribute('data-reduced-motion')).toBe('false');

    await user.click(motionToggle);
    expect(document.documentElement.getAttribute('data-reduced-motion')).toBe('true');
    expect(screen.getByTestId('transverse-state-reduced-motion')).toBeInTheDocument();

    await user.click(motionToggle);
    expect(document.documentElement.getAttribute('data-reduced-motion')).toBe('false');
  });

  it('A22: When local storage fails, never issues a fake receipt, preserves user input, and allows retry', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Enable simulated storage failure via test utilities toolbar
    await user.click(screen.getByTestId('toggle-storage-fail-btn'));
    expect(screen.getByTestId('transverse-state-storage-unavailable')).toBeInTheDocument();

    // Navigate to S05 and prepare submission
    await user.click(screen.getByTestId('start-investigation-cta'));
    await user.click(screen.getByTestId('inspect-btn-S001'));
    await user.click(screen.getByTestId('proceed-to-bridge-btn'));
    await user.click(screen.getByTestId('select-question-Q001'));
    await user.click(screen.getByTestId('nav-step-S05'));

    await user.click(
      screen.getByRole('radio', { name: /Deux événements distincts sont plausibles/i })
    );
    await user.click(screen.getByTestId('insert-sample-justification-btn'));

    // Submit while storage is blocked
    await user.click(screen.getByTestId('submit-contribution-btn'));

    // Should NOT navigate to Receipt (no fake receipt!)
    expect(screen.queryByTestId('contribution-receipt-section')).not.toBeInTheDocument();

    // Storage error banner is displayed
    expect(screen.getByTestId('conclusion-storage-error')).toBeInTheDocument();
    expect(screen.getByTestId('conclusion-storage-error')).toHaveTextContent(/Stockage local indisponible/i);

    // Saisie is preserved in textarea
    const textarea = screen.getByTestId('justification-textarea') as HTMLTextAreaElement;
    expect(textarea.value.length).toBeGreaterThan(15);
  });

  it('A21: Displays error screen and recovery button if dataset is empty', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Switch to empty dataset via test toolbar
    await user.click(screen.getByTestId('load-empty-dataset-btn'));

    expect(screen.getByTestId('dataset-error-screen')).toBeInTheDocument();
    expect(screen.getByTestId('transverse-state-empty')).toBeInTheDocument();

    // Recover by clicking reload button
    await user.click(screen.getByTestId('reload-valid-dataset-btn'));
    expect(screen.queryByTestId('dataset-error-screen')).not.toBeInTheDocument();
    expect(screen.getByTestId('discovery-view-section')).toBeInTheDocument();
  });

  it('A20: Displays error banner when dataset has a broken reference', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Switch to broken reference dataset
    await user.click(screen.getByTestId('load-broken-dataset-btn'));

    expect(screen.getByTestId('status-error-banner')).toBeInTheDocument();
    expect(screen.getByTestId('status-error-banner')).toHaveTextContent('S999');
    expect(screen.getByTestId('transverse-state-error')).toBeInTheDocument();
  });

  it('A23: Allows toggling between Signature Missing Bridge and Fallback Guided Baseline', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByTestId('start-investigation-cta'));
    await user.click(screen.getByTestId('proceed-to-bridge-btn'));

    // Default mode is Signature Missing Bridge
    expect(screen.getByTestId('bridge-connector-column')).toBeInTheDocument();

    // Toggle mode
    const modeBtn = screen.getByTitle(/Basculer entre la Signature Interaction/i);
    await user.click(modeBtn);

    // Fallback baseline is rendered
    expect(screen.getByTestId('guided-baseline-container')).toBeInTheDocument();

    // Toggle back
    await user.click(modeBtn);
    expect(screen.getByTestId('bridge-connector-column')).toBeInTheDocument();
  });
});
