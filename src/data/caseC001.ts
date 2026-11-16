import { ArchiveDataset, ConclusionOption } from '../types/archive';

export const FICTIONAL_WARNING_BADGE = 'Archives fictives — démonstration';
export const LOCAL_RECEIPT_BADGE = 'Contribution enregistrée localement — démonstration';

export const CONCLUSION_OPTIONS: ConclusionOption[] = [
  {
    value: 'DISTINCT_EVENTS_PLAUSIBLE',
    label: 'Deux événements distincts sont plausibles (1920 puis 1922 après transfert en 1921)',
    summary:
      'Le registre technique de 1921 documente un démontage et un transfert entre les deux tours, ce qui rend compatible une inauguration en 1920 sur la vieille tour et une découverte en 1922 sur la nouvelle tour.',
    epistemicWarning:
      'Attention : « plausible » ne signifie pas « vérité historique certaine » sur ce que chaque habitant savait individuellement.',
  },
  {
    value: 'SAME_EVENT_UNPROVEN',
    label: 'L’hypothèse d’un seul et même événement mal daté n’est pas démontrée',
    summary:
      'Les pièces consultées mentionnent deux édifices distincts (vieille tour et nouvelle tour) ainsi qu’une opération technique intermédiaire en 1921, ce qui contredit l’idée d’une simple erreur de date sur un unique événement.',
    epistemicWarning:
      'Cette conclusion écarte la confusion directe des dates tout en conservant la prudence documentaire sur le reste du corpus.',
  },
  {
    value: 'INSUFFICIENT_EVIDENCE',
    label: 'Preuves insuffisantes pour certifier l’ensemble des témoignages',
    summary:
      'Même avec le registre de transfert de 1921, aucune archive ne permet de prouver ce que tous les habitants de Memoria connaissaient ou ignoraient entre 1920 et 1922.',
    epistemicWarning:
      'L’incertitude motivée est une conclusion scientifique et archivistique pleinement valide.',
  },
];

export const CASE_C001_DATASET: ArchiveDataset = {
  caseData: {
    id: 'C001',
    title: "Le Mystère de l'Horloge",
    city: 'Memoria (Ville fictive)',
    description:
      "Deux documents issus des archives municipales de Memoria semblent se contredire à propos de l'horloge monumentale : l'un évoque une inauguration en juin 1920, l'autre affirme que les habitants la découvrent pour la première fois en mai 1922.",
    objective:
      "Comprendre pourquoi deux archives parlent de dates différentes concernant l'horloge, identifier l'information manquante qui éclaire cet écart, et déposer une conclusion argumentée.",
    promise: 'Ne devinez pas l’histoire : découvrez ce qu’il manque pour la comprendre.',
    status: 'open',
    fictional: true,
  },
  sources: [
    {
      id: 'S001',
      caseId: 'C001',
      title: 'Lettre municipale',
      sourceType: 'Lettre municipale',
      date: '15/06/1920',
      isoDate: '1920-06-15',
      content: "« L'horloge de la vieille tour a été inaugurée aujourd'hui. »",
      contextNote:
        "Correspondance administrative interne adressée au secrétariat de la mairie de Memoria. Mentionne explicitement l'édifice dit « la vieille tour ».",
      archiveCode: 'MEM-ADM-1920-0615',
      buildingMentioned: 'Vieille tour municipale',
      illustrationType: 'old-tower',
      illustrationAlt:
        "Illustration archivistique fictive de la lettre municipale du 15/06/1920 montrant le timbre de la vieille tour de Memoria.",
      fictional: true,
    },
    {
      id: 'S002',
      caseId: 'C001',
      title: 'Journal local',
      sourceType: 'Journal local',
      date: '04/05/1922',
      isoDate: '1922-05-04',
      content:
        "« Les habitants découvrent pour la première fois l'horloge installée sur la nouvelle tour. »",
      contextNote:
        "Coupure de presse publiée en première page de L'Écho de Memoria. Met l'accent sur la réaction du public devant « la nouvelle tour ».",
      archiveCode: 'MEM-PRS-1922-0504',
      buildingMentioned: 'Nouvelle tour centrale',
      illustrationType: 'new-tower',
      illustrationAlt:
        "Illustration archivistique fictive de la coupure du journal local du 04/05/1922 décrivant l'horloge sur la nouvelle tour de Memoria.",
      fictional: true,
    },
    {
      id: 'S003',
      caseId: 'C001',
      title: 'Registre technique',
      sourceType: 'Registre technique',
      date: '12/09/1921',
      isoDate: '1921-09-12',
      content:
        "« L'horloge de l'ancienne tour a été démontée pour être transférée vers la nouvelle tour. »",
      contextNote:
        "Extrait du carnet d'intervention des ateliers municipaux de Memoria. Documente une opération mécanique de déplacement entre deux bâtiments en septembre 1921.",
      archiveCode: 'MEM-TEC-1921-0912',
      buildingMentioned: 'Ancienne tour → Nouvelle tour',
      illustrationType: 'transfer-register',
      illustrationAlt:
        "Illustration archivistique fictive du registre technique du 12/09/1921 attestant le démontage et le transfert de l'horloge entre l'ancienne et la nouvelle tour.",
      fictional: true,
      requiresQuestionId: 'Q001',
    },
  ],
  claims: [
    {
      id: 'CL001',
      caseId: 'C001',
      title: 'Affirmation A — Archive 1920',
      statement: 'Une inauguration est mentionnée en 1920 (S001)',
      yearLabel: '15 juin 1920',
      locationLabel: 'Vieille tour',
      sourceIds: ['S001'],
    },
    {
      id: 'CL002',
      caseId: 'C001',
      title: 'Affirmation B — Archive 1922',
      statement: 'Une première découverte sur la nouvelle tour est mentionnée en 1922 (S002)',
      yearLabel: '4 mai 1922',
      locationLabel: 'Nouvelle tour',
      sourceIds: ['S002'],
    },
    {
      id: 'CL003',
      caseId: 'C001',
      title: 'Affirmation C — Liaison documentaire 1921',
      statement: 'Un transfert est documenté en 1921 (S003)',
      yearLabel: '12 septembre 1921',
      locationLabel: 'De l’ancienne vers la nouvelle tour',
      sourceIds: ['S003'],
      requiresQuestionId: 'Q001',
    },
  ],
  hypotheses: [
    {
      id: 'H001',
      caseId: 'C001',
      code: 'H001',
      title: 'Même événement (erreur de date supposée)',
      text: 'Les deux archives décriraient un seul et même événement au même endroit, l’une des deux dates (1920 ou 1922) étant erronée.',
      status: 'challenged',
      epistemicNote:
        'Mise en difficulté dès que l’on remarque la différence de bâtiment (vieille tour vs nouvelle tour) et le registre de transfert de 1921.',
    },
    {
      id: 'H002',
      caseId: 'C001',
      code: 'H002',
      title: 'Événements distincts (inauguration puis réinstallation)',
      text: 'L’horloge a d’abord été inaugurée sur la vieille tour en 1920, transférée en 1921, puis découverte sur la nouvelle tour en 1922.',
      status: 'plausible',
      epistemicNote:
        'Soutenue par S003, qui relie chronologiquement et matériellement les deux emplacements sans nécessiter d’erreur de date.',
    },
    {
      id: 'H003',
      caseId: 'C001',
      code: 'H003',
      title: 'Insuffisance de preuves pour affirmer tous les détails',
      text: 'Les archives disponibles ne suffisent pas à prouver ce que chaque habitant savait en 1920 ni pourquoi le journal de 1922 emploie une formule générale.',
      status: 'open_uncertainty',
      epistemicNote:
        'Rappelle les limites de la preuve documentaire : un acte technique (S003) explique le déplacement matériel, pas la mémoire subjective de toute la population.',
    },
  ],
  questions: [
    {
      id: 'Q001',
      caseId: 'C001',
      shortLabel: 'Piste spatiale & matérielle (Q001)',
      text: "L'horloge a-t-elle changé de bâtiment ?",
      relevantSourceIds: ['S003'],
      unlocksClaimId: 'CL003',
      trackStatus: 'pertinent_bridge',
      trackStatusLabel: 'Piste pertinente — Nouvel indice révélé (S003)',
      feedback:
        "Piste pertinente : en interrogeant le changement d'édifice entre la « vieille tour » (1920) et la « nouvelle tour » (1922), vous ouvrez l'accès au registre technique S003 du 12/09/1921 qui documente le transfert.",
      epistemicLimit:
        "Portée de l'indice : S003 rend très plausible l'existence de deux événements distincts, sans pour autant prouver les témoignages individuels de tous les habitants.",
    },
    {
      id: 'Q002',
      caseId: 'C001',
      shortLabel: 'Piste de fabrication (Q002)',
      text: "Qui a fabriqué l'horloge ?",
      relevantSourceIds: [],
      trackStatus: 'unanswered_in_corpus',
      trackStatusLabel: 'Piste hors périmètre causal — Aucun document lié',
      feedback:
        "Pas de réponse dans le corpus : l'identité du constructeur ou de l'horloger n'explique pas directement la divergence de dates et de bâtiments observée entre 1920 et 1922.",
      epistemicLimit:
        "Leçon méthodologique : une question peut être factuellement curieuse sans pouvoir résoudre la contradiction apparente entre deux sources.",
    },
    {
      id: 'Q003',
      caseId: 'C001',
      shortLabel: 'Piste de perception collective (Q003)',
      text: 'Les témoins connaissaient-ils la vieille tour ?',
      relevantSourceIds: [],
      trackStatus: 'insufficient_data',
      trackStatusLabel: 'Données insuffisantes dans le corpus — Piste non résolue',
      feedback:
        "Piste raisonnable mais non résolue (données insuffisantes) : savoir si les habitants fréquentaient la vieille tour éclairerait le ton du journal de 1922, mais les archives municipales ne contiennent aucun recensement des témoignages individuels.",
      epistemicLimit:
        "Leçon méthodologique : identifier ce que le corpus ne permet pas de savoir protège contre les généralisations abusives.",
    },
  ],
  relations: [
    {
      id: 'ER001',
      caseId: 'C001',
      sourceId: 'S003',
      hypothesisId: 'H002',
      relationType: 'supports',
      relationLabel: 'Soutient (supports)',
      rationale:
        "Le démontage et le transfert documentés le 12/09/1921 (S003) sont pleinement compatibles avec deux événements distincts : inauguration sur la vieille tour en 1920, puis découverte sur la nouvelle tour en 1922.",
    },
    {
      id: 'ER002',
      caseId: 'C001',
      sourceId: 'S003',
      hypothesisId: 'H001',
      relationType: 'challenges',
      relationLabel: 'Contredit / Met en difficulté (challenges)',
      rationale:
        "L'existence d'un transfert officiel entre deux tours différentes en 1921 (S003) contredit l'hypothèse stricte selon laquelle S001 et S002 parleraient d'un unique événement mal daté au même endroit.",
    },
    {
      id: 'ER003',
      caseId: 'C001',
      sourceId: 'S001',
      hypothesisId: 'H003',
      relationType: 'insufficient',
      relationLabel: 'Preuve insuffisante (insufficient)',
      rationale:
        "La lettre municipale de 1920 (S001) atteste l'inauguration administrative sur la vieille tour, mais reste insuffisante pour prouver ce que l'ensemble des habitants de Memoria savait à cette date.",
    },
    {
      id: 'ER004',
      caseId: 'C001',
      sourceId: 'S002',
      hypothesisId: 'H003',
      relationType: 'insufficient',
      relationLabel: 'Preuve insuffisante (insufficient)',
      rationale:
        "L'article du journal de 1922 (S002) rapporte la découverte de l'horloge sur la nouvelle tour, mais est insuffisant pour prouver l'absence totale de connaissance antérieure de l'horloge par certains citoyens.",
    },
    {
      id: 'ER005',
      caseId: 'C001',
      sourceId: 'S001',
      hypothesisId: 'H001',
      relationType: 'unrelated',
      relationLabel: 'Sans lien probant autonome (unrelated)',
      rationale:
        "Lue isolément, la lettre S001 de 1920 ne contient aucun élément permettant d'évaluer la véracité ou la fausseté de la date de 1922 avant comparaison architecturale.",
    },
  ],
};

/**
 * Test datasets for automated validation and resilience verification (A20 & A21)
 */
export const EMPTY_ARCHIVE_DATASET: ArchiveDataset = {
  caseData: null,
  sources: [],
  claims: [],
  hypotheses: [],
  questions: [],
  relations: [],
};

export const BROKEN_REFERENCE_DATASET: ArchiveDataset = {
  ...CASE_C001_DATASET,
  claims: [
    ...CASE_C001_DATASET.claims,
    {
      id: 'CL999',
      caseId: 'C001',
      title: 'Affirmation corrompue',
      statement: 'Référence vers une source inexistante S999',
      yearLabel: '1925',
      locationLabel: 'Inconnu',
      sourceIds: ['S999'],
    },
  ],
};
