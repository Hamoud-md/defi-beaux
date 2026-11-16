import { describe, expect, it } from 'vitest';
import {
  createInitialInvestigation,
  investigationReducer,
} from './investigationReducer';

describe('Investigation Reducer & Reversible Verdict State (F06, M06, A07, P11)', () => {
  it('creates clean initial investigation state', () => {
    const state = createInitialInvestigation('C001');
    expect(state.caseId).toBe('C001');
    expect(state.currentStep).toBe('S01');
    expect(state.inspectedSourceIds).toHaveLength(0);
    expect(state.selectedQuestionId).toBeNull();
    expect(state.verdictHistory).toHaveLength(0);
    expect(state.interactionMode).toBe('missing-bridge');
  });

  it('navigates to step S02 on START_INVESTIGATION', () => {
    const initial = createInitialInvestigation('C001');
    const next = investigationReducer(initial, { type: 'START_INVESTIGATION' });
    expect(next.currentStep).toBe('S02');
    expect(next.state).toBe('comparing');
  });

  it('records inspected sources without duplicates', () => {
    let state = createInitialInvestigation('C001');
    state = investigationReducer(state, { type: 'INSPECT_SOURCE', sourceId: 'S001' });
    expect(state.inspectedSourceIds).toEqual(['S001']);
    expect(state.draftReferencedSourceIds).toEqual(['S001']);

    // Inspecting again should not duplicate
    state = investigationReducer(state, { type: 'INSPECT_SOURCE', sourceId: 'S001' });
    expect(state.inspectedSourceIds).toEqual(['S001']);
  });

  it('records selected questions and keeps track of all explored questions', () => {
    let state = createInitialInvestigation('C001');
    state = investigationReducer(state, {
      type: 'SELECT_QUESTION',
      questionId: 'Q002',
      unlocksSourceIds: [],
    });
    expect(state.selectedQuestionId).toBe('Q002');
    expect(state.exploredQuestionIds).toEqual(['Q002']);

    // Select Q001 which unlocks S003
    state = investigationReducer(state, {
      type: 'SELECT_QUESTION',
      questionId: 'Q001',
      unlocksSourceIds: ['S003'],
    });
    expect(state.selectedQuestionId).toBe('Q001');
    expect(state.exploredQuestionIds).toEqual(['Q002', 'Q001']);
    expect(state.state).toBe('reasoning');
  });

  it('tracks verdict revision history when changing conclusion (P11, F06, M06, A07)', () => {
    let state = createInitialInvestigation('C001');
    state = investigationReducer(state, {
      type: 'SET_CONCLUSION_TYPE',
      conclusionType: 'SAME_EVENT_UNPROVEN',
    });
    expect(state.draftConclusionType).toBe('SAME_EVENT_UNPROVEN');
    expect(state.verdictHistory).toHaveLength(0); // first selection, no previous revision

    // Change conclusion to DISTINCT_EVENTS_PLAUSIBLE
    state = investigationReducer(state, {
      type: 'SET_CONCLUSION_TYPE',
      conclusionType: 'DISTINCT_EVENTS_PLAUSIBLE',
    });
    expect(state.draftConclusionType).toBe('DISTINCT_EVENTS_PLAUSIBLE');
    expect(state.verdictHistory).toHaveLength(1);
    expect(state.verdictHistory[0].previousConclusion).toBe('SAME_EVENT_UNPROVEN');
    expect(state.verdictHistory[0].newConclusion).toBe('DISTINCT_EVENTS_PLAUSIBLE');
  });

  it('prevents toggling referenced source citation if source was never inspected', () => {
    let state = createInitialInvestigation('C001');
    state.inspectedSourceIds = ['S001'];

    // Try to toggle uninspected S002
    state = investigationReducer(state, {
      type: 'TOGGLE_REFERENCED_SOURCE',
      sourceId: 'S002',
    });
    expect(state.draftReferencedSourceIds).not.toContain('S002');

    // Toggle inspected S001
    state = investigationReducer(state, {
      type: 'TOGGLE_REFERENCED_SOURCE',
      sourceId: 'S001',
    });
    expect(state.draftReferencedSourceIds).toContain('S001');

    // Toggle S001 off
    state = investigationReducer(state, {
      type: 'TOGGLE_REFERENCED_SOURCE',
      sourceId: 'S001',
    });
    expect(state.draftReferencedSourceIds).not.toContain('S001');
  });

  it('supports toggling interaction mode between missing-bridge and guided-baseline (A23)', () => {
    let state = createInitialInvestigation('C001');
    expect(state.interactionMode).toBe('missing-bridge');

    state = investigationReducer(state, {
      type: 'SET_INTERACTION_MODE',
      mode: 'guided-baseline',
    });
    expect(state.interactionMode).toBe('guided-baseline');
  });
});
