import { ConclusionType, Contribution, Investigation } from '../types/archive';

export const INVESTIGATION_STORAGE_KEY = 'memoria_echo_detective_investigation_v1';
export const CONTRIBUTIONS_STORAGE_KEY = 'memoria_echo_detective_contributions_v1';

let simulateStorageUnavailableFlag = false;

export function setSimulateStorageUnavailable(unavailable: boolean): void {
  simulateStorageUnavailableFlag = unavailable;
}

export function isSimulateStorageUnavailable(): boolean {
  return simulateStorageUnavailableFlag;
}

function getSafeStorage(): Storage {
  if (simulateStorageUnavailableFlag) {
    throw new Error('SIMULATED_STORAGE_UNAVAILABLE');
  }
  if (typeof window === 'undefined' || !window.localStorage) {
    throw new Error('LOCAL_STORAGE_MISSING');
  }
  return window.localStorage;
}

export interface StorageSaveResult<T> {
  ok: boolean;
  data?: T;
  error?: string;
  storageUnavailable?: boolean;
}

/**
 * Generates a unique local contribution ID at the moment of real persistence (Section 12.2)
 */
export function generateLocalContributionId(caseId: string): string {
  const now = new Date();
  const ymd = now.toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `MEM-${caseId}-${ymd}-${randomSuffix}`;
}

/**
 * Writes a Contribution to LocalStorage AND reads it back immediately to verify integrity
 * before any Receipt can be shown (F07, M07, A08, A22).
 */
export function saveAndVerifyContribution(input: {
  caseId: string;
  conclusionType: ConclusionType;
  justification: string;
  referencedSourceIds: string[];
  selectedQuestionId: string | null;
}): StorageSaveResult<Contribution> {
  try {
    const storage = getSafeStorage();

    const existingRaw = storage.getItem(CONTRIBUTIONS_STORAGE_KEY);
    let existingList: Contribution[] = [];
    if (existingRaw) {
      try {
        const parsed = JSON.parse(existingRaw);
        if (Array.isArray(parsed)) {
          existingList = parsed;
        }
      } catch {
        // Recover from corrupted array by starting a fresh array
        existingList = [];
      }
    }

    const newContribution: Contribution = {
      id: generateLocalContributionId(input.caseId),
      caseId: input.caseId,
      conclusionType: input.conclusionType,
      justification: input.justification,
      referencedSourceIds: [...input.referencedSourceIds],
      selectedQuestionId: input.selectedQuestionId,
      status: 'saved_local_demo',
      savedAt: new Date().toISOString(),
      fictional: true,
      verifiedReadBack: false,
    };

    const updatedList = [newContribution, ...existingList];
    storage.setItem(CONTRIBUTIONS_STORAGE_KEY, JSON.stringify(updatedList));

    // Mandatory Read-Back Verification (F07 / A08)
    const readBackRaw = storage.getItem(CONTRIBUTIONS_STORAGE_KEY);
    if (!readBackRaw) {
      return {
        ok: false,
        storageUnavailable: true,
        error:
          'Échec de vérification après écriture : le stockage local n’a retourné aucune donnée à la relecture.',
      };
    }

    const readBackList = JSON.parse(readBackRaw) as Contribution[];
    const verifiedEntry = readBackList.find((c) => c.id === newContribution.id);

    if (
      !verifiedEntry ||
      verifiedEntry.caseId !== input.caseId ||
      verifiedEntry.conclusionType !== input.conclusionType ||
      verifiedEntry.justification !== input.justification ||
      verifiedEntry.status !== 'saved_local_demo' ||
      verifiedEntry.referencedSourceIds.join(',') !== input.referencedSourceIds.join(',')
    ) {
      return {
        ok: false,
        storageUnavailable: true,
        error:
          'Échec d’intégrité à la relecture : la contribution relue ne correspond pas exactement aux données soumises.',
      };
    }

    const confirmedContribution: Contribution = {
      ...verifiedEntry,
      verifiedReadBack: true,
    };

    // Update the verified flag in storage as well
    readBackList[0] = confirmedContribution;
    storage.setItem(CONTRIBUTIONS_STORAGE_KEY, JSON.stringify(readBackList));

    return {
      ok: true,
      data: confirmedContribution,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'UNKNOWN_STORAGE_ERROR';
    return {
      ok: false,
      storageUnavailable: true,
      error:
        message === 'SIMULATED_STORAGE_UNAVAILABLE'
          ? 'Stockage local indisponible (mode simulation d’erreur A22 actif ou accès navigateur refusé). Aucun reçu n’a été émis ; votre saisie est intégralement conservée à l’écran pour réessayer.'
          : 'Impossible d’accéder au stockage local du navigateur (quota dépassé ou stockage désactivé). Aucun reçu fictif n’est généré ; votre saisie reste préservée.',
    };
  }
}

/**
 * Loads saved local contributions (F07, A08)
 */
export function loadSavedContributions(): {
  ok: boolean;
  contributions: Contribution[];
  error?: string;
} {
  try {
    const storage = getSafeStorage();
    const raw = storage.getItem(CONTRIBUTIONS_STORAGE_KEY);
    if (!raw) {
      return { ok: true, contributions: [] };
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return {
        ok: false,
        contributions: [],
        error: 'Le registre local des contributions était corrompu et n’a pas pu être lu.',
      };
    }
    return { ok: true, contributions: parsed as Contribution[] };
  } catch {
    return {
      ok: false,
      contributions: [],
      error: 'Stockage local inaccessible pour la lecture des contributions.',
    };
  }
}

/**
 * Saves current investigation progress to LocalStorage (F08, P09)
 */
export function saveInvestigationSession(investigation: Investigation): StorageSaveResult<Investigation> {
  try {
    const storage = getSafeStorage();
    storage.setItem(INVESTIGATION_STORAGE_KEY, JSON.stringify(investigation));
    return { ok: true, data: investigation };
  } catch {
    return {
      ok: false,
      storageUnavailable: true,
      error:
        'Sauvegarde automatique de session indisponible (stockage local refusé). Vous pouvez poursuivre votre lecture en mémoire.',
    };
  }
}

/**
 * Restores an existing investigation session from LocalStorage (F08, A16)
 */
export function loadInvestigationSession(expectedCaseId: string): {
  restored: Investigation | null;
  corruptedError?: string;
} {
  try {
    const storage = getSafeStorage();
    const raw = storage.getItem(INVESTIGATION_STORAGE_KEY);
    if (!raw) {
      return { restored: null };
    }
    const parsed = JSON.parse(raw) as Partial<Investigation>;
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      parsed.caseId !== expectedCaseId ||
      !Array.isArray(parsed.inspectedSourceIds) ||
      !Array.isArray(parsed.exploredQuestionIds)
    ) {
      storage.removeItem(INVESTIGATION_STORAGE_KEY);
      return {
        restored: null,
        corruptedError:
          'Une session locale antérieure était incomplète ou corrompue. Une nouvelle session d’enquête C001 a été initialisée proprement.',
      };
    }

    return {
      restored: {
        id: parsed.id ?? `INV-${expectedCaseId}`,
        caseId: expectedCaseId,
        currentStep: parsed.currentStep ?? 'S01',
        inspectedSourceIds: parsed.inspectedSourceIds,
        selectedQuestionId: parsed.selectedQuestionId ?? null,
        exploredQuestionIds: parsed.exploredQuestionIds,
        evaluatedRelationIds: Array.isArray(parsed.evaluatedRelationIds)
          ? parsed.evaluatedRelationIds
          : [],
        state: parsed.state ?? 'discovering',
        draftConclusionType: parsed.draftConclusionType ?? null,
        draftJustification: typeof parsed.draftJustification === 'string' ? parsed.draftJustification : '',
        draftReferencedSourceIds: Array.isArray(parsed.draftReferencedSourceIds)
          ? parsed.draftReferencedSourceIds
          : [],
        verdictHistory: Array.isArray(parsed.verdictHistory) ? parsed.verdictHistory : [],
        interactionMode: parsed.interactionMode ?? 'missing-bridge',
        restoredFromStorage: true,
        updatedAt: parsed.updatedAt ?? new Date().toISOString(),
      },
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : '';
    if (msg === 'SIMULATED_STORAGE_UNAVAILABLE' || msg === 'LOCAL_STORAGE_MISSING') {
      return { restored: null };
    }
    return {
      restored: null,
      corruptedError:
        'Les données de session locales étaient illisibles (JSON corrompu). L’enquête a été réinitialisée sans perte des archives du dossier.',
    };
  }
}

export function clearInvestigationSession(): void {
  try {
    const storage = getSafeStorage();
    storage.removeItem(INVESTIGATION_STORAGE_KEY);
  } catch {
    // Ignore if storage is disabled
  }
}
