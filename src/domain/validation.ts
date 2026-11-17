import {
  ArchiveDataset,
  ConclusionType,
  ContributionValidationErrors,
  DatasetValidationResult,
  Investigation,
  ResearchQuestion,
  Source,
} from '../types/archive';
import { CONCLUSION_OPTIONS } from '../data/caseC001';

const ALLOWED_CONCLUSIONS: ConclusionType[] = CONCLUSION_OPTIONS.map((opt) => opt.value);

const DATE_REGEX = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;

/**
 * Validates dataset integrity (Section 12.3, F01, F12, A20, A21)
 */
export function validateDataset(dataset: ArchiveDataset | null | undefined): DatasetValidationResult {
  if (
    !dataset ||
    !dataset.caseData ||
    dataset.sources.length === 0 ||
    dataset.claims.length === 0 ||
    dataset.questions.length === 0 ||
    dataset.hypotheses.length === 0
  ) {
    return {
      valid: false,
      errorType: 'EMPTY_DATASET',
      errors: [
        'Le jeu de données archivistiques est vide ou incomplet. Impossible de charger le dossier C001.',
      ],
    };
  }

  const errors: string[] = [];
  let errorType: DatasetValidationResult['errorType'];

  const { caseData, sources, claims, hypotheses, questions, relations } = dataset;

  // F12: Fictional flag check
  if (!caseData.fictional || sources.some((s) => !s.fictional)) {
    errorType = 'MISSING_FICTIONAL_FLAG';
    errors.push(
      'Drapeau obligatoire fictional=true manquant sur le dossier ou l’une de ses sources (Exigence F12).'
    );
  }

  // Check unique IDs across each entity collection
  const seenIds = new Set<string>();
  const checkUnique = (id: string, label: string) => {
    if (!id || id.trim() === '') {
      errors.push(`Identifiant vide détecté dans ${label}.`);
      return;
    }
    if (seenIds.has(id)) {
      errorType = errorType ?? 'DUPLICATE_ID';
      errors.push(`Identifiant dupliqué détecté : ${id} (${label}).`);
    }
    seenIds.add(id);
  };

  checkUnique(caseData.id, 'Case');
  const sourceIds = new Set<string>();
  const hypothesisIds = new Set<string>();
  const questionIds = new Set<string>();

  for (const s of sources) {
    checkUnique(s.id, 'Source');
    sourceIds.add(s.id);
    if (s.caseId !== caseData.id) {
      errorType = errorType ?? 'BROKEN_REFERENCE';
      errors.push(`La source ${s.id} référence un caseId incohérent (${s.caseId}).`);
    }
    if (!DATE_REGEX.test(s.date)) {
      errorType = errorType ?? 'INVALID_DATE';
      errors.push(`La source ${s.id} possède une date invalide (${s.date}). Format attendu : JJ/MM/AAAA.`);
    }
  }

  for (const h of hypotheses) {
    checkUnique(h.id, 'Hypothesis');
    hypothesisIds.add(h.id);
    if (h.caseId !== caseData.id) {
      errorType = errorType ?? 'BROKEN_REFERENCE';
      errors.push(`L'hypothèse ${h.id} référence un caseId incohérent (${h.caseId}).`);
    }
  }

  for (const q of questions) {
    checkUnique(q.id, 'ResearchQuestion');
    questionIds.add(q.id);
    if (q.caseId !== caseData.id) {
      errorType = errorType ?? 'BROKEN_REFERENCE';
      errors.push(`La question ${q.id} référence un caseId incohérent (${q.caseId}).`);
    }
    for (const refSourceId of q.relevantSourceIds) {
      if (!sourceIds.has(refSourceId)) {
        errorType = errorType ?? 'BROKEN_REFERENCE';
        errors.push(`La question ${q.id} pointe vers une source introuvable : ${refSourceId}.`);
      }
    }
  }

  for (const c of claims) {
    checkUnique(c.id, 'Claim');
    if (c.caseId !== caseData.id) {
      errorType = errorType ?? 'BROKEN_REFERENCE';
      errors.push(`L'affirmation ${c.id} référence un caseId incohérent (${c.caseId}).`);
    }
    for (const refSourceId of c.sourceIds) {
      if (!sourceIds.has(refSourceId)) {
        errorType = errorType ?? 'BROKEN_REFERENCE';
        errors.push(`L'affirmation ${c.id} pointe vers une source absente : ${refSourceId}.`);
      }
    }
  }

  for (const r of relations) {
    checkUnique(r.id, 'EvidenceRelation');
    if (r.caseId !== caseData.id) {
      errorType = errorType ?? 'BROKEN_REFERENCE';
      errors.push(`La relation ${r.id} référence un caseId incohérent (${r.caseId}).`);
    }
    if (!sourceIds.has(r.sourceId)) {
      errorType = errorType ?? 'BROKEN_REFERENCE';
      errors.push(`La relation ${r.id} référence une source inexistante : ${r.sourceId}.`);
    }
    if (!hypothesisIds.has(r.hypothesisId)) {
      errorType = errorType ?? 'BROKEN_REFERENCE';
      errors.push(`La relation ${r.id} référence une hypothèse inexistante : ${r.hypothesisId}.`);
    }
  }

  // Check requiresQuestionId on sources
  for (const s of sources) {
    if (s.requiresQuestionId && !questionIds.has(s.requiresQuestionId)) {
      errorType = errorType ?? 'BROKEN_REFERENCE';
      errors.push(
        `La source ${s.id} dépend d'une question inexistante : ${s.requiresQuestionId}.`
      );
    }
  }

  return {
    valid: errors.length === 0,
    errorType: errors.length > 0 ? errorType ?? 'BROKEN_REFERENCE' : undefined,
    errors,
  };
}

/**
 * Determines if a source is currently accessible to the investigator (F03, F04)
 */
export function isSourceAccessible(
  source: Source,
  selectedQuestionId: string | null,
  exploredQuestionIds: string[]
): boolean {
  if (!source.requiresQuestionId) {
    return true;
  }
  return (
    selectedQuestionId === source.requiresQuestionId ||
    exploredQuestionIds.includes(source.requiresQuestionId)
  );
}

/**
 * Resolves a research question selection into its causal outcome (F03, F04, A04, A05)
 */
export interface QuestionResolution {
  question: ResearchQuestion;
  unlockedSources: Source[];
  revealsNewEvidence: boolean;
}

export function resolveQuestionSelection(
  questionId: string,
  dataset: ArchiveDataset
): QuestionResolution | null {
  const question = dataset.questions.find((q) => q.id === questionId);
  if (!question) {
    return null;
  }
  const unlockedSources = dataset.sources.filter((s) =>
    question.relevantSourceIds.includes(s.id)
  );
  return {
    question,
    unlockedSources,
    revealsNewEvidence: unlockedSources.length > 0,
  };
}

/**
 * Sanitizes plain text input so HTML tags cannot be executed (Section 10 Security)
 */
export function sanitizeJustificationText(raw: string): string {
  return raw.replace(/[<>]/g, '').trim();
}

/**
 * Validates a contribution before saving (F07, F09, A09)
 */
export function validateContributionDraft(
  draft: {
    conclusionType: ConclusionType | null;
    justification: string;
    referencedSourceIds: string[];
  },
  investigation: Pick<Investigation, 'inspectedSourceIds' | 'exploredQuestionIds'>,
  dataset: ArchiveDataset
): { valid: boolean; errors: ContributionValidationErrors; sanitizedJustification: string } {
  const errors: ContributionValidationErrors = {};

  if (investigation.exploredQuestionIds.length === 0) {
    errors.questionRequired =
      'Veuillez d’abord explorer au moins une question de recherche (Missing Bridge) avant de soumettre votre conclusion.';
  }

  if (!draft.conclusionType || !ALLOWED_CONCLUSIONS.includes(draft.conclusionType)) {
    errors.conclusionType =
      'Veuillez sélectionner un verdict parmi les conclusions autorisées.';
  }

  const sanitizedJustification = sanitizeJustificationText(draft.justification);
  if (!sanitizedJustification || sanitizedJustification.length < 15) {
    errors.justification =
      'Veuillez saisir une justification argumentée (au moins 15 caractères) expliquant votre raisonnement à partir des archives.';
  }

  const validSourceIds = new Set(dataset.sources.map((s) => s.id));
  const inspectedSet = new Set(investigation.inspectedSourceIds);

  if (!draft.referencedSourceIds || draft.referencedSourceIds.length === 0) {
    errors.referencedSourceIds =
      'Veuillez lier au moins une source documentaire que vous avez effectivement consultée.';
  } else {
    const uninspected = draft.referencedSourceIds.filter(
      (id) => !validSourceIds.has(id) || !inspectedSet.has(id)
    );
    if (uninspected.length > 0) {
      errors.referencedSourceIds = `Impossible de citer une archive non consultée (${uninspected.join(', ')}). Veuillez d'abord lire la source correspondante.`;
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    sanitizedJustification,
  };
}

/**
 * Factual progress calculation (F10, OFF-04, A11)
 * Strictly based on verifiable investigative milestones, never decorative clicks.
 */
export interface FactualProgressStep {
  id: string;
  label: string;
  completed: boolean;
  detail: string;
}

export interface FactualProgressSummary {
  completedCount: number;
  totalCount: number;
  percentage: number;
  steps: FactualProgressStep[];
}

export function calculateFactualProgress(
  investigation: Investigation,
  hasVerifiedContribution: boolean
): FactualProgressSummary {
  const initialDocsCompared =
    investigation.inspectedSourceIds.includes('S001') &&
    investigation.inspectedSourceIds.includes('S002');

  const questionExplored = investigation.exploredQuestionIds.length > 0;

  const pertinentClueInspected =
    investigation.exploredQuestionIds.includes('Q001') &&
    investigation.inspectedSourceIds.includes('S003');

  const reasoningEvaluated =
    pertinentClueInspected || investigation.evaluatedRelationIds.length > 0;

  const conclusionDrafted =
    Boolean(investigation.draftConclusionType) &&
    sanitizeJustificationText(investigation.draftJustification).length >= 15 &&
    investigation.draftReferencedSourceIds.length > 0;

  const steps: FactualProgressStep[] = [
    {
      id: 'STEP_COMPARE',
      label: '1. Comparaison initiale des deux pièces',
      completed: initialDocsCompared,
      detail: initialDocsCompared
        ? 'Les deux pièces de 1920 et 1922 ont été consultées'
        : 'Consultez les deux pièces pour observer l’écart',
    },
    {
      id: 'STEP_BRIDGE',
      label: '2. Question manquante (Le Pont Manquant)',
      completed: questionExplored,
      detail: questionExplored
        ? 'Une piste d’investigation a été explorée'
        : 'Interrogez le lien entre les deux affirmations',
    },
    {
      id: 'STEP_EVIDENCE',
      label: '3. Examen de preuve & relations',
      completed: reasoningEvaluated,
      detail: pertinentClueInspected
        ? 'Le registre de transfert de 1921 a été découvert et consulté'
        : reasoningEvaluated
          ? 'Relations preuve/hypothèse examinées'
          : 'Découvrez et examinez l’indice intermédiaire',
    },
    {
      id: 'STEP_CONCLUDE',
      label: '4. Conclusion motivée',
      completed: conclusionDrafted || hasVerifiedContribution,
      detail:
        conclusionDrafted || hasVerifiedContribution
          ? 'Verdict et justification rédigés avec sources liées'
          : 'Formulez un verdict nuancé et justifié',
    },
    {
      id: 'STEP_CONTRIBUTE',
      label: '5. Contribution vérifiée',
      completed: hasVerifiedContribution,
      detail: hasVerifiedContribution
        ? 'Enregistrée et relue dans le registre local de démo'
        : 'Enregistrez votre contribution pour obtenir le reçu',
    },
  ];

  const completedCount = steps.filter((s) => s.completed).length;
  const totalCount = steps.length;
  const percentage = Math.round((completedCount / totalCount) * 100);

  return {
    completedCount,
    totalCount,
    percentage,
    steps,
  };
}
