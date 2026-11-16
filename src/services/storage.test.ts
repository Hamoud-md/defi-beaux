import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  clearInvestigationSession,
  CONTRIBUTIONS_STORAGE_KEY,
  generateLocalContributionId,
  INVESTIGATION_STORAGE_KEY,
  loadInvestigationSession,
  loadSavedContributions,
  saveAndVerifyContribution,
  saveInvestigationSession,
  setSimulateStorageUnavailable,
} from './storage';
import { createInitialInvestigation } from '../state/investigationReducer';

describe('Storage Service & Read-Back Verification (F07, F08, A08, A16, A22)', () => {
  beforeEach(() => {
    localStorage.clear();
    setSimulateStorageUnavailable(false);
  });

  afterEach(() => {
    localStorage.clear();
    setSimulateStorageUnavailable(false);
  });

  it('generates unique contribution IDs with case code and date prefix', () => {
    const id1 = generateLocalContributionId('C001');
    const id2 = generateLocalContributionId('C001');
    expect(id1).toMatch(/^MEM-C001-\d{8}-[A-Z0-9]{4}$/);
    expect(id2).toMatch(/^MEM-C001-\d{8}-[A-Z0-9]{4}$/);
    expect(id1).not.toBe(id2);
  });

  it('writes a contribution AND verifies by reading back immediately before confirming (A08)', () => {
    const result = saveAndVerifyContribution({
      caseId: 'C001',
      conclusionType: 'DISTINCT_EVENTS_PLAUSIBLE',
      justification:
        "Le registre de 1921 évoque un transfert, ce qui rend plausible l'existence de deux événements distincts.",
      referencedSourceIds: ['S001', 'S002', 'S003'],
      selectedQuestionId: 'Q001',
    });

    expect(result.ok).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data?.verifiedReadBack).toBe(true);
    expect(result.data?.status).toBe('saved_local_demo');
    expect(result.data?.caseId).toBe('C001');

    // Confirm it is indeed persisted in window.localStorage
    const raw = localStorage.getItem(CONTRIBUTIONS_STORAGE_KEY);
    expect(raw).not.toBeNull();
    const list = JSON.parse(raw!);
    expect(list).toHaveLength(1);
    expect(list[0].id).toBe(result.data?.id);
    expect(list[0].verifiedReadBack).toBe(true);
  });

  it('fails verification and returns an error if read-back data is corrupted or missing', () => {
    // Spy on Storage.prototype.getItem: first call returns null (existing items), second call returns corrupted list
    const getItemSpy = vi
      .spyOn(Storage.prototype, 'getItem')
      .mockReturnValueOnce(null)
      .mockReturnValueOnce(JSON.stringify([{ id: 'CORRUPTED_ENTRY', caseId: 'C001' }]));

    const result = saveAndVerifyContribution({
      caseId: 'C001',
      conclusionType: 'SAME_EVENT_UNPROVEN',
      justification: 'Justification de test pour vérifier la relecture.',
      referencedSourceIds: ['S001'],
      selectedQuestionId: 'Q001',
    });

    expect(result.ok).toBe(false);
    expect(result.error).toContain('Échec d’intégrité à la relecture');
    expect(result.storageUnavailable).toBe(true);

    getItemSpy.mockRestore();
  });

  it('refuses to issue any receipt when storage fails or is simulated down (A22)', () => {
    setSimulateStorageUnavailable(true);

    const result = saveAndVerifyContribution({
      caseId: 'C001',
      conclusionType: 'INSUFFICIENT_EVIDENCE',
      justification: 'Preuves insuffisantes selon les pièces archivistiques disponibles.',
      referencedSourceIds: ['S001', 'S002'],
      selectedQuestionId: 'Q003',
    });

    expect(result.ok).toBe(false);
    expect(result.data).toBeUndefined();
    expect(result.storageUnavailable).toBe(true);
    expect(result.error).toContain('Stockage local indisponible');
  });

  it('saves and restores an investigation session (F08, A16)', () => {
    const inv = createInitialInvestigation('C001');
    inv.currentStep = 'S03';
    inv.inspectedSourceIds = ['S001', 'S002'];
    inv.selectedQuestionId = 'Q001';
    inv.exploredQuestionIds = ['Q001'];

    const saveResult = saveInvestigationSession(inv);
    expect(saveResult.ok).toBe(true);

    const restoredResult = loadInvestigationSession('C001');
    expect(restoredResult.restored).not.toBeNull();
    expect(restoredResult.restored?.currentStep).toBe('S03');
    expect(restoredResult.restored?.inspectedSourceIds).toEqual(['S001', 'S002']);
    expect(restoredResult.restored?.selectedQuestionId).toBe('Q001');
    expect(restoredResult.restored?.restoredFromStorage).toBe(true);
  });

  it('recovers gracefully from corrupted session JSON in LocalStorage', () => {
    localStorage.setItem(INVESTIGATION_STORAGE_KEY, '{"corrupted": true, broken JSON ...');

    const result = loadInvestigationSession('C001');
    expect(result.restored).toBeNull();
    expect(result.corruptedError).toBeDefined();
    expect(result.corruptedError).toContain('illisibles');
  });

  it('clears session cleanly when requested', () => {
    const inv = createInitialInvestigation('C001');
    saveInvestigationSession(inv);
    expect(localStorage.getItem(INVESTIGATION_STORAGE_KEY)).not.toBeNull();

    clearInvestigationSession();
    expect(localStorage.getItem(INVESTIGATION_STORAGE_KEY)).toBeNull();
  });

  it('loads empty contributions when none exist, and handles corrupted arrays safely', () => {
    expect(loadSavedContributions().contributions).toHaveLength(0);

    localStorage.setItem(CONTRIBUTIONS_STORAGE_KEY, '{"notAnArray": true}');
    const loadedCorrupted = loadSavedContributions();
    expect(loadedCorrupted.ok).toBe(false);
    expect(loadedCorrupted.contributions).toHaveLength(0);
  });
});
