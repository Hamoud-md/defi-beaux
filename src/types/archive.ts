export type CaseStatus = 'open' | 'archived';

export interface Case {
  id: string;
  title: string;
  city: string;
  description: string;
  objective: string;
  promise: string;
  status: CaseStatus;
  fictional: boolean;
}

export type SourceType = 'Lettre municipale' | 'Journal local' | 'Registre technique';

export interface Source {
  id: string;
  caseId: string;
  title: string;
  sourceType: SourceType;
  date: string; // Format DD/MM/YYYY
  isoDate: string; // Format YYYY-MM-DD
  content: string;
  contextNote: string;
  archiveCode: string;
  buildingMentioned: string;
  illustrationType: 'old-tower' | 'new-tower' | 'transfer-register';
  illustrationAlt: string;
  fictional: boolean;
  requiresQuestionId?: string;
}

export interface Claim {
  id: string;
  caseId: string;
  title: string;
  statement: string;
  yearLabel: string;
  locationLabel: string;
  sourceIds: string[];
  requiresQuestionId?: string;
}

export type HypothesisStatus = 'plausible' | 'challenged' | 'open_uncertainty';

export interface Hypothesis {
  id: string;
  caseId: string;
  code: string;
  title: string;
  text: string;
  status: HypothesisStatus;
  epistemicNote: string;
}

export type QuestionTrackStatus = 'pertinent_bridge' | 'unanswered_in_corpus' | 'insufficient_data';

export interface ResearchQuestion {
  id: string;
  caseId: string;
  text: string;
  shortLabel: string;
  relevantSourceIds: string[];
  unlocksClaimId?: string;
  trackStatus: QuestionTrackStatus;
  trackStatusLabel: string;
  feedback: string;
  epistemicLimit: string;
}

export type EvidenceRelationType = 'supports' | 'challenges' | 'insufficient' | 'unrelated';

export interface EvidenceRelation {
  id: string;
  caseId: string;
  sourceId: string;
  hypothesisId: string;
  relationType: EvidenceRelationType;
  relationLabel: string;
  rationale: string;
}

export type ConclusionType =
  | 'DISTINCT_EVENTS_PLAUSIBLE'
  | 'SAME_EVENT_UNPROVEN'
  | 'INSUFFICIENT_EVIDENCE';

export interface ConclusionOption {
  value: ConclusionType;
  label: string;
  summary: string;
  epistemicWarning: string;
}

export type ViewStepId = 'S01' | 'S02' | 'S03' | 'S04' | 'S05' | 'S06';

export type TransverseState =
  | 'initial'
  | 'loading'
  | 'empty'
  | 'error'
  | 'success'
  | 'revisited'
  | 'reduced-motion'
  | 'storage-unavailable';

export type InteractionMode = 'missing-bridge' | 'guided-baseline';

export interface VerdictRevision {
  id: string;
  changedAt: string;
  previousConclusion: ConclusionType;
  newConclusion: ConclusionType;
  previousJustification: string;
  newJustification: string;
}

export type InvestigationLifecycleState =
  | 'discovering'
  | 'comparing'
  | 'questioning'
  | 'reasoning'
  | 'concluding'
  | 'contributed';

export interface Investigation {
  id: string;
  caseId: string;
  currentStep: ViewStepId;
  inspectedSourceIds: string[];
  selectedQuestionId: string | null;
  exploredQuestionIds: string[];
  evaluatedRelationIds: string[];
  state: InvestigationLifecycleState;
  draftConclusionType: ConclusionType | null;
  draftJustification: string;
  draftReferencedSourceIds: string[];
  verdictHistory: VerdictRevision[];
  interactionMode: InteractionMode;
  restoredFromStorage: boolean;
  updatedAt: string;
}

export type ContributionStatus = 'saved_local_demo';

export interface Contribution {
  id: string;
  caseId: string;
  conclusionType: ConclusionType;
  justification: string;
  referencedSourceIds: string[];
  selectedQuestionId: string | null;
  status: ContributionStatus;
  savedAt: string;
  fictional: boolean;
  verifiedReadBack: boolean;
}

export interface ArchiveDataset {
  caseData: Case | null;
  sources: Source[];
  claims: Claim[];
  hypotheses: Hypothesis[];
  questions: ResearchQuestion[];
  relations: EvidenceRelation[];
}

export interface DatasetValidationResult {
  valid: boolean;
  errorType?: 'EMPTY_DATASET' | 'MISSING_FICTIONAL_FLAG' | 'DUPLICATE_ID' | 'BROKEN_REFERENCE' | 'INVALID_DATE';
  errors: string[];
}

export interface ContributionValidationErrors {
  conclusionType?: string;
  justification?: string;
  referencedSourceIds?: string;
  questionRequired?: string;
}
