import { describe, expect, it } from 'vitest';
import {
  BROKEN_REFERENCE_DATASET,
  CASE_C001_DATASET,
  EMPTY_ARCHIVE_DATASET,
} from '../data/caseC001';
import {
  calculateFactualProgress,
  isSourceAccessible,
  resolveQuestionSelection,
  sanitizeJustificationText,
  validateContributionDraft,
  validateDataset,
} from './validation';
import { createInitialInvestigation } from '../state/investigationReducer';

describe('Domain Validation & Integrity (Section 12.3, F01, F12, A20, A21)', () => {
  it('validates the complete nominal Case C001 dataset as valid', () => {
    const result = validateDataset(CASE_C001_DATASET);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('rejects an empty archive dataset with EMPTY_DATASET error (A21)', () => {
    const result = validateDataset(EMPTY_ARCHIVE_DATASET);
    expect(result.valid).toBe(false);
    expect(result.errorType).toBe('EMPTY_DATASET');
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0]).toContain('vide ou incomplet');
  });

  it('rejects a dataset with a broken source reference (A20)', () => {
    const result = validateDataset(BROKEN_REFERENCE_DATASET);
    expect(result.valid).toBe(false);
    expect(result.errorType).toBe('BROKEN_REFERENCE');
    expect(result.errors.some((e) => e.includes('S999'))).toBe(true);
  });

  it('detects missing fictional=true flag according to requirement F12', () => {
    const nonFictionalDataset = {
      ...CASE_C001_DATASET,
      caseData: {
        ...CASE_C001_DATASET.caseData!,
        fictional: false,
      },
    };
    const result = validateDataset(nonFictionalDataset);
    expect(result.valid).toBe(false);
    expect(result.errorType).toBe('MISSING_FICTIONAL_FLAG');
    expect(result.errors.some((e) => e.includes('fictional=true'))).toBe(true);
  });

  it('detects duplicate IDs within entity collections', () => {
    const duplicateDataset = {
      ...CASE_C001_DATASET,
      sources: [
        ...CASE_C001_DATASET.sources,
        {
          ...CASE_C001_DATASET.sources[0],
          id: 'S001', // duplicate
        },
      ],
    };
    const result = validateDataset(duplicateDataset);
    expect(result.valid).toBe(false);
    expect(result.errorType).toBe('DUPLICATE_ID');
  });
});

describe('Missing Bridge Causal Question Resolution (F03, F04, A04, A05)', () => {
  it('resolves Q001 to reveal S003 (pertinent bridge)', () => {
    const outcome = resolveQuestionSelection('Q001', CASE_C001_DATASET);
    expect(outcome).not.toBeNull();
    expect(outcome?.revealsNewEvidence).toBe(true);
    expect(outcome?.unlockedSources).toHaveLength(1);
    expect(outcome?.unlockedSources[0].id).toBe('S003');
    expect(outcome?.question.trackStatus).toBe('pertinent_bridge');
  });

  it('resolves Q002 with no new evidence and explicit out-of-scope feedback', () => {
    const outcome = resolveQuestionSelection('Q002', CASE_C001_DATASET);
    expect(outcome).not.toBeNull();
    expect(outcome?.revealsNewEvidence).toBe(false);
    expect(outcome?.unlockedSources).toHaveLength(0);
    expect(outcome?.question.trackStatus).toBe('unanswered_in_corpus');
    expect(outcome?.question.feedback).toContain('constructeur');
  });

  it('resolves Q003 with insufficient data feedback', () => {
    const outcome = resolveQuestionSelection('Q003', CASE_C001_DATASET);
    expect(outcome).not.toBeNull();
    expect(outcome?.revealsNewEvidence).toBe(false);
    expect(outcome?.unlockedSources).toHaveLength(0);
    expect(outcome?.question.trackStatus).toBe('insufficient_data');
    expect(outcome?.question.feedback).toContain('données insuffisantes');
  });

  it('correctly determines source accessibility before and after question activation', () => {
    const s001 = CASE_C001_DATASET.sources.find((s) => s.id === 'S001')!;
    const s003 = CASE_C001_DATASET.sources.find((s) => s.id === 'S003')!;

    // S001 is immediately accessible without question
    expect(isSourceAccessible(s001, null, [])).toBe(true);

    // S003 is locked initially
    expect(isSourceAccessible(s003, null, [])).toBe(false);
    expect(isSourceAccessible(s003, 'Q002', ['Q002'])).toBe(false);

    // S003 becomes accessible when Q001 is selected or explored
    expect(isSourceAccessible(s003, 'Q001', [])).toBe(true);
    expect(isSourceAccessible(s003, null, ['Q001'])).toBe(true);
  });
});

describe('Contribution Form Validation & Sanitization (F07, F09, A09, Security)', () => {
  it('neutralizes HTML tags in justifications to prevent script execution (Section 10)', () => {
    const raw = '<script>alert("hack")</script> <b>Le registre de 1921 atteste un transfert.</b>';
    const sanitized = sanitizeJustificationText(raw);
    expect(sanitized).not.toContain('<');
    expect(sanitized).not.toContain('>');
    expect(sanitized).toContain('Le registre de 1921 atteste un transfert.');
  });

  it('rejects a contribution when no question has been explored', () => {
    const investigation = createInitialInvestigation('C001');
    const result = validateContributionDraft(
      {
        conclusionType: 'DISTINCT_EVENTS_PLAUSIBLE',
        justification: 'Le registre de 1921 évoque un transfert entre deux tours distinctes.',
        referencedSourceIds: ['S001'],
      },
      investigation,
      CASE_C001_DATASET
    );
    expect(result.valid).toBe(false);
    expect(result.errors.questionRequired).toBeDefined();
  });

  it('rejects an empty or too short justification (< 15 chars) (A09)', () => {
    const investigation = {
      inspectedSourceIds: ['S001', 'S002', 'S003'],
      exploredQuestionIds: ['Q001'],
    };
    const result = validateContributionDraft(
      {
        conclusionType: 'DISTINCT_EVENTS_PLAUSIBLE',
        justification: 'Court',
        referencedSourceIds: ['S001'],
      },
      investigation,
      CASE_C001_DATASET
    );
    expect(result.valid).toBe(false);
    expect(result.errors.justification).toBeDefined();
  });

  it('rejects citing a source that was never inspected by the investigator', () => {
    const investigation = {
      inspectedSourceIds: ['S001'], // S002 never inspected
      exploredQuestionIds: ['Q001'],
    };
    const result = validateContributionDraft(
      {
        conclusionType: 'DISTINCT_EVENTS_PLAUSIBLE',
        justification: 'Le registre de 1921 évoque un transfert entre deux tours distinctes.',
        referencedSourceIds: ['S001', 'S002'], // S002 cited illegitimately
      },
      investigation,
      CASE_C001_DATASET
    );
    expect(result.valid).toBe(false);
    expect(result.errors.referencedSourceIds).toContain('non consultée (S002)');
  });

  it('approves a fully valid contribution draft', () => {
    const investigation = {
      inspectedSourceIds: ['S001', 'S002', 'S003'],
      exploredQuestionIds: ['Q001'],
    };
    const result = validateContributionDraft(
      {
        conclusionType: 'DISTINCT_EVENTS_PLAUSIBLE',
        justification:
          'Le registre de 1921 évoque un transfert, ce qui rend plausible deux événements distincts sans prouver tous les témoignages.',
        referencedSourceIds: ['S001', 'S002', 'S003'],
      },
      investigation,
      CASE_C001_DATASET
    );
    expect(result.valid).toBe(true);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });
});

describe('Factual Progress Calculation (F10, OFF-04, A11)', () => {
  it('starts at 0% when no investigative actions have been completed', () => {
    const inv = createInitialInvestigation('C001');
    const progress = calculateFactualProgress(inv, false);
    expect(progress.completedCount).toBe(0);
    expect(progress.percentage).toBe(0);
  });

  it('advances only based on genuine investigative milestones, never decorative clicks', () => {
    const inv = createInitialInvestigation('C001');

    // Inspect initial sources S001 and S002
    inv.inspectedSourceIds = ['S001', 'S002'];
    let progress = calculateFactualProgress(inv, false);
    expect(progress.completedCount).toBe(1);
    expect(progress.percentage).toBe(20);

    // Explore Missing Bridge question
    inv.exploredQuestionIds = ['Q001'];
    progress = calculateFactualProgress(inv, false);
    expect(progress.completedCount).toBe(2);
    expect(progress.percentage).toBe(40);

    // Inspect discovered S003
    inv.inspectedSourceIds = ['S001', 'S002', 'S003'];
    progress = calculateFactualProgress(inv, false);
    expect(progress.completedCount).toBe(3);
    expect(progress.percentage).toBe(60);

    // Draft conclusion
    inv.draftConclusionType = 'DISTINCT_EVENTS_PLAUSIBLE';
    inv.draftJustification =
      'Le registre technique de 1921 atteste le transfert de l horloge entre les tours.';
    inv.draftReferencedSourceIds = ['S001', 'S002', 'S003'];
    progress = calculateFactualProgress(inv, false);
    expect(progress.completedCount).toBe(4);
    expect(progress.percentage).toBe(80);

    // Verified contribution saved
    progress = calculateFactualProgress(inv, true);
    expect(progress.completedCount).toBe(5);
    expect(progress.percentage).toBe(100);
  });
});
