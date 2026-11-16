import {
  ConclusionType,
  InteractionMode,
  Investigation,
  VerdictRevision,
  ViewStepId,
} from '../types/archive';

export type InvestigationAction =
  | { type: 'START_INVESTIGATION' }
  | { type: 'NAVIGATE_STEP'; step: ViewStepId }
  | { type: 'INSPECT_SOURCE'; sourceId: string }
  | { type: 'SELECT_QUESTION'; questionId: string; unlocksSourceIds: string[] }
  | { type: 'EVALUATE_RELATION'; relationId: string }
  | { type: 'SET_CONCLUSION_TYPE'; conclusionType: ConclusionType }
  | { type: 'SET_JUSTIFICATION'; justification: string }
  | { type: 'TOGGLE_REFERENCED_SOURCE'; sourceId: string }
  | { type: 'MARK_CONTRIBUTED' }
  | { type: 'REVISE_VERDICT' }
  | { type: 'SET_INTERACTION_MODE'; mode: InteractionMode }
  | { type: 'RESTORE_INVESTIGATION'; investigation: Investigation }
  | { type: 'RESET_INVESTIGATION'; caseId: string };

export function createInitialInvestigation(caseId = 'C001'): Investigation {
  return {
    id: `INV-${caseId}-SESSION`,
    caseId,
    currentStep: 'S01',
    inspectedSourceIds: [],
    selectedQuestionId: null,
    exploredQuestionIds: [],
    evaluatedRelationIds: [],
    state: 'discovering',
    draftConclusionType: null,
    draftJustification: '',
    draftReferencedSourceIds: [],
    verdictHistory: [],
    interactionMode: 'missing-bridge',
    restoredFromStorage: false,
    updatedAt: new Date().toISOString(),
  };
}

export function investigationReducer(
  state: Investigation,
  action: InvestigationAction
): Investigation {
  const now = new Date().toISOString();

  switch (action.type) {
    case 'START_INVESTIGATION': {
      return {
        ...state,
        currentStep: 'S02',
        state: state.state === 'discovering' ? 'comparing' : state.state,
        updatedAt: now,
      };
    }

    case 'NAVIGATE_STEP': {
      return {
        ...state,
        currentStep: action.step,
        updatedAt: now,
      };
    }

    case 'INSPECT_SOURCE': {
      const alreadyInspected = state.inspectedSourceIds.includes(action.sourceId);
      const nextInspected = alreadyInspected
        ? state.inspectedSourceIds
        : [...state.inspectedSourceIds, action.sourceId];

      // Auto-add newly inspected source to draftReferencedSourceIds if none yet or if S003
      const alreadyReferenced = state.draftReferencedSourceIds.includes(action.sourceId);
      const nextReferenced = alreadyReferenced
        ? state.draftReferencedSourceIds
        : [...state.draftReferencedSourceIds, action.sourceId];

      return {
        ...state,
        inspectedSourceIds: nextInspected,
        draftReferencedSourceIds: nextReferenced,
        updatedAt: now,
      };
    }

    case 'SELECT_QUESTION': {
      const nextExplored = state.exploredQuestionIds.includes(action.questionId)
        ? state.exploredQuestionIds
        : [...state.exploredQuestionIds, action.questionId];

      return {
        ...state,
        selectedQuestionId: action.questionId,
        exploredQuestionIds: nextExplored,
        state:
          action.unlocksSourceIds.length > 0
            ? 'reasoning'
            : state.state === 'discovering' || state.state === 'comparing'
              ? 'questioning'
              : state.state,
        updatedAt: now,
      };
    }

    case 'EVALUATE_RELATION': {
      const alreadyEvaluated = state.evaluatedRelationIds.includes(action.relationId);
      return {
        ...state,
        evaluatedRelationIds: alreadyEvaluated
          ? state.evaluatedRelationIds
          : [...state.evaluatedRelationIds, action.relationId],
        state: state.state === 'contributed' ? 'contributed' : 'reasoning',
        updatedAt: now,
      };
    }

    case 'SET_CONCLUSION_TYPE': {
      let nextHistory: VerdictRevision[] = state.verdictHistory;

      // Track reversible verdict change if switching from an existing different conclusion (F06 / M06 / A07 / P11)
      if (
        state.draftConclusionType &&
        state.draftConclusionType !== action.conclusionType
      ) {
        const revision: VerdictRevision = {
          id: `REV-${state.verdictHistory.length + 1}`,
          changedAt: now,
          previousConclusion: state.draftConclusionType,
          newConclusion: action.conclusionType,
          previousJustification: state.draftJustification,
          newJustification: state.draftJustification,
        };
        nextHistory = [revision, ...state.verdictHistory];
      }

      return {
        ...state,
        draftConclusionType: action.conclusionType,
        verdictHistory: nextHistory,
        state: state.state === 'contributed' ? 'contributed' : 'concluding',
        updatedAt: now,
      };
    }

    case 'SET_JUSTIFICATION': {
      return {
        ...state,
        draftJustification: action.justification,
        updatedAt: now,
      };
    }

    case 'TOGGLE_REFERENCED_SOURCE': {
      // Only allow referencing sources that have been inspected
      if (!state.inspectedSourceIds.includes(action.sourceId)) {
        return state;
      }
      const isSelected = state.draftReferencedSourceIds.includes(action.sourceId);
      const nextRefs = isSelected
        ? state.draftReferencedSourceIds.filter((id) => id !== action.sourceId)
        : [...state.draftReferencedSourceIds, action.sourceId];

      return {
        ...state,
        draftReferencedSourceIds: nextRefs,
        updatedAt: now,
      };
    }

    case 'MARK_CONTRIBUTED': {
      return {
        ...state,
        currentStep: 'S06',
        state: 'contributed',
        updatedAt: now,
      };
    }

    case 'REVISE_VERDICT': {
      return {
        ...state,
        currentStep: 'S05',
        state: 'concluding',
        updatedAt: now,
      };
    }

    case 'SET_INTERACTION_MODE': {
      return {
        ...state,
        interactionMode: action.mode,
        updatedAt: now,
      };
    }

    case 'RESTORE_INVESTIGATION': {
      return {
        ...action.investigation,
        restoredFromStorage: true,
      };
    }

    case 'RESET_INVESTIGATION': {
      return createInitialInvestigation(action.caseId);
    }

    default:
      return state;
  }
}
