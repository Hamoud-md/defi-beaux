import { ArchiveDataset, ConclusionOption } from '../types/archive';
import { Locale } from '../i18n/translations';

export function getLocalizedConclusionOptions(locale: Locale): ConclusionOption[] {
  if (locale === 'ar') {
    return [
      {
        value: 'DISTINCT_EVENTS_PLAUSIBLE',
        label: 'حدثان منفصلان محتملان (1920 ثم 1922 بعد النقل في 1921)',
        summary:
          'يوثق السجل التقني لعام 1921 تفكيكاً ونقلاً بين البرجين، مما يجعل متوافقاً افتتاح 1920 على البرج القديم واكتشاف 1922 على البرج الجديد.',
        epistemicWarning:
          'تنبيه: "محتمل" لا يعني "حقيقة تاريخية مؤكدة" حول ما عرفه كل ساكن بشكل فردي.',
      },
      {
        value: 'SAME_EVENT_UNPROVEN',
        label: 'فرضية حدث واحد خاطئ التاريخ غير مثبتة',
        summary:
          'تذكر الوثائق المفحوصة مبنيين مختلفين (برج قديم وبرج جديد) وعملية تقنية وسيطة في 1921، مما يناقض فكرة خطأ بسيط في التاريخ لحدث واحد.',
        epistemicWarning:
          'هذا الاستنتاج يستبعد الخلط المباشر في التواريخ مع الحفاظ على الحذر التوثيقي حول بقية المجموعة.',
      },
      {
        value: 'INSUFFICIENT_EVIDENCE',
        label: 'أدلة غير كافية لتأكيد جميع الشهادات',
        summary:
          'حتى مع سجل النقل لعام 1921، لا يمكن لأي أرشيف إثبات ما عرفه أو جهله جميع سكان ميموريا بين 1920 و1922.',
        epistemicWarning:
          'عدم اليقين المبرر هو استنتاج علمي وأرشيفي صحيح تماماً.',
      },
    ];
  }

  if (locale === 'en') {
    return [
      {
        value: 'DISTINCT_EVENTS_PLAUSIBLE',
        label: 'Two distinct events are plausible (1920 then 1922 after transfer in 1921)',
        summary:
          'The 1921 technical register documents a dismantling and transfer between the two towers, making compatible an inauguration in 1920 on the old tower and a discovery in 1922 on the new tower.',
        epistemicWarning:
          'Caution: "Plausible" does not mean "certain historical truth" about what each resident knew individually.',
      },
      {
        value: 'SAME_EVENT_UNPROVEN',
        label: 'The hypothesis of a single misdated event is not proven',
        summary:
          'The examined documents mention two distinct buildings (old tower and new tower) and an intermediate technical operation in 1921, contradicting the idea of a simple date error on a single event.',
        epistemicWarning:
          'This conclusion rules out direct date confusion while maintaining documentary caution regarding the rest of the corpus.',
      },
      {
        value: 'INSUFFICIENT_EVIDENCE',
        label: 'Insufficient evidence to certify all testimonies',
        summary:
          'Even with the 1921 transfer register, no archive can prove what all residents of Memoria knew or did not know between 1920 and 1922.',
        epistemicWarning:
          'Reasoned uncertainty is a fully valid scientific and archival conclusion.',
      },
    ];
  }

  // French default
  return [
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
}

export function getLocalizedDataset(locale: Locale): ArchiveDataset {
  if (locale === 'ar') {
    return {
      caseData: {
        id: 'C001',
        title: "لغز الساعة",
        city: 'ميموريا (مدينة خيالية)',
        description:
          "يبدو أن وثيقتين من أرشيف بلدية ميموريا تتناقضان بخصوص الساعة الأثرية: إحداهما تذكر افتتاحاً في يونيو 1920، والأخرى تؤكد أن السكان اكتشفوها لأول مرة في مايو 1922.",
        objective:
          "فهم سبب ذكر تاريخين مختلفين للساعة في وثيقتين أرشيفيتين، وتحديد المعلومة الناقصة التي تفسر هذا التباين، وتقديم استنتاج مبرر.",
        promise: 'لا تخمّن التاريخ: اكتشف ما ينقص لفهمه.',
        status: 'open',
        fictional: true,
      },
      sources: [
        {
          id: 'S001',
          caseId: 'C001',
          title: 'رسالة بلدية',
          sourceType: 'Lettre municipale',
          date: '15/06/1920',
          isoDate: '1920-06-15',
          content: "« تم اليوم افتتاح ساعة البرج القديم. »",
          contextNote:
            "مراسلة إدارية داخلية موجهة إلى أمانة بلدية ميموريا. تذكر صراحة المبنى المسمى «البرج القديم».",
          archiveCode: 'MEM-ADM-1920-0615',
          buildingMentioned: 'البرج البلدي القديم',
          illustrationType: 'old-tower',
          illustrationAlt:
            "رسم توضيحي خيالي للرسالة البلدية بتاريخ 15/06/1920 يوضح ختم البرج القديم في ميموريا.",
          fictional: true,
        },
        {
          id: 'S002',
          caseId: 'C001',
          title: 'صحيفة محلية',
          sourceType: 'Journal local',
          date: '04/05/1922',
          isoDate: '1922-05-04',
          content:
            "« يكتشف السكان لأول مرة الساعة المثبتة على البرج الجديد. »",
          contextNote:
            "قصاصة صحفية نُشرت في الصفحة الأولى لجريدة صدى ميموريا. تركز على تفاعل الجمهور أمام «البرج الجديد».",
          archiveCode: 'MEM-PRS-1922-0504',
          buildingMentioned: 'البرج المركزي الجديد',
          illustrationType: 'new-tower',
          illustrationAlt:
            "رسم توضيحي خيالي لقصاصة الصحيفة المحلية بتاريخ 04/05/1922 تصف الساعة على البرج الجديد.",
          fictional: true,
        },
        {
          id: 'S003',
          caseId: 'C001',
          title: 'سجل تقني',
          sourceType: 'Registre technique',
          date: '12/09/1921',
          isoDate: '1921-09-12',
          content:
            "« تم تفكيك ساعة البرج القديم لنقلها إلى البرج الجديد. »",
          contextNote:
            "مقتطف من دفتر تدخلات الورش البلدية لميموريا. يوثق عملية ميكانيكية للنقل بين مبنيين في سبتمبر 1921.",
          archiveCode: 'MEM-TEC-1921-0912',
          buildingMentioned: 'البرج القديم ← البرج الجديد',
          illustrationType: 'transfer-register',
          illustrationAlt:
            "رسم توضيحي خيالي للسجل التقني بتاريخ 12/09/1921 يثبت تفكيك ونقل الساعة.",
          fictional: true,
          requiresQuestionId: 'Q001',
        },
      ],
      claims: [
        {
          id: 'CL001',
          caseId: 'C001',
          title: 'الادعاء أ — أرشيف 1920',
          statement: 'تم ذكر افتتاح في عام 1920 (S001)',
          yearLabel: '15 يونيو 1920',
          locationLabel: 'البرج القديم',
          sourceIds: ['S001'],
        },
        {
          id: 'CL002',
          caseId: 'C001',
          title: 'الادعاء ب — أرشيف 1922',
          statement: 'تم ذكر أول اكتشاف على البرج الجديد في عام 1922 (S002)',
          yearLabel: '4 مايو 1922',
          locationLabel: 'البرج الجديد',
          sourceIds: ['S002'],
        },
        {
          id: 'CL003',
          caseId: 'C001',
          title: 'الادعاء ج — الرابط التوثيقي 1921',
          statement: 'تم توثيق عملية نقل في عام 1921 (S003)',
          yearLabel: '12 سبتمبر 1921',
          locationLabel: 'من البرج القديم إلى البرج الجديد',
          sourceIds: ['S003'],
          requiresQuestionId: 'Q001',
        },
      ],
      hypotheses: [
        {
          id: 'H001',
          caseId: 'C001',
          code: 'H001',
          title: 'نفس الحدث (افتراض خطأ في التاريخ)',
          text: 'الوثيقتان تصفان حدثاً واحداً في نفس المكان، وأحد التاريخين (1920 أو 1922) خاطئ.',
          status: 'challenged',
          epistemicNote:
            'تضعف هذه الفرضية فور ملاحظة اختلاف المبنى (البرج القديم مقابل البرج الجديد) ووجود سجل النقل لعام 1921.',
        },
        {
          id: 'H002',
          caseId: 'C001',
          code: 'H002',
          title: 'حدثان منفصلان (افتتاح ثم إعادة تثبيت)',
          text: 'تم افتتاح الساعة أولاً على البرج القديم عام 1920، ثم نُقلت عام 1921، واكتُشفت على البرج الجديد عام 1922.',
          status: 'plausible',
          epistemicNote:
            'مدعومة بالسجل S003، الذي يربط زمنياً ومادياً بين الموقعين دون الحاجة لافتراض خطأ في التواريخ.',
        },
        {
          id: 'H003',
          caseId: 'C001',
          code: 'H003',
          title: 'أدلة غير كافية لتأكيد كل التفاصيل',
          text: 'الأرشيفات المتاحة لا تكفي لإثبات ما عرفه كل مواطن عام 1920 أو سبب استخدام الصحيفة لصيغة عامة عام 1922.',
          status: 'open_uncertainty',
          epistemicNote:
            'تذكير بحدود الدليل التوثيقي: العمل التقني (S003) يفسر النقل المادي، وليس الذاكرة الذاتية للسكان جميعاً.',
        },
      ],
      questions: [
        {
          id: 'Q001',
          caseId: 'C001',
          shortLabel: 'المسار المكاني والمادي (Q001)',
          text: "هل غيّرت الساعة مبناها؟",
          relevantSourceIds: ['S003'],
          unlocksClaimId: 'CL003',
          trackStatus: 'pertinent_bridge',
          trackStatusLabel: 'مسار مفيد ومثمر — تم الكشف عن دليل جديد (S003)',
          feedback:
            "مسار وثيق الصلة: بالتساؤل عن تغيير المبنى بين «البرج القديم» (1920) و«البرج الجديد» (1922)، يتاح لك الاطلاع على السجل التقني S003 المؤرخ في 12/09/1921 والذي يوثق النقل.",
          epistemicLimit:
            "نطاق الدليل: يجعل السجل S003 وجود حدثين منفصلين أمراً محتملاً جداً، دون إثبات شهادات جميع المواطنين بشكل قاطع.",
        },
        {
          id: 'Q002',
          caseId: 'C001',
          shortLabel: 'مسار الصانع والمنشأ (Q002)',
          text: "من صنع الساعة؟",
          relevantSourceIds: [],
          trackStatus: 'unanswered_in_corpus',
          trackStatusLabel: 'مسار خارج النطاق السببي — لا توجد وثائق ذات صلة',
          feedback:
            "لا توجد إجابة في المجموعة: هوية الصانع أو الساعاتي لا تفسر مباشرة التباين في التواريخ والمباني بين 1920 و1922.",
          epistemicLimit:
            "درس منهجي: يمكن لسؤال أن يكون مثيراً للفضول دون أن يسهم في حل التناقض الظاهري بين وثيقتين.",
        },
        {
          id: 'Q003',
          caseId: 'C001',
          shortLabel: 'مسار الإدراك الجماعي (Q003)',
          text: 'هل كان الشهود على علم بالبرج القديم؟',
          relevantSourceIds: [],
          trackStatus: 'insufficient_data',
          trackStatusLabel: 'بيانات غير كافية في المجموعة — مسار غير محلول',
          feedback:
            "مسار معقول لكنه غير محلول (بيانات غير كافية): معرفة ما إذا كان السكان يرتادون البرج القديم قد توضح أسلوب الصحيفة عام 1922، لكن الأرشيف لا يتضمن إحصاءات لشهادات الأفراد.",
          epistemicLimit:
            "درس منهجي: إدراك ما لا تتيح المجموعة معرفته يحمي من التعميمات غير المسندة.",
        },
      ],
      relations: [
        {
          id: 'ER001',
          caseId: 'C001',
          sourceId: 'S003',
          hypothesisId: 'H002',
          relationType: 'supports',
          relationLabel: 'يدعم (supports)',
          rationale:
            "عملية التفكيك والنقل الموثقة في 12/09/1921 (S003) متوافقة تماماً مع حدثين منفصلين: الافتتاح على البرج القديم عام 1920 ثم الاكتشاف على البرج الجديد عام 1922.",
        },
        {
          id: 'ER002',
          caseId: 'C001',
          sourceId: 'S003',
          hypothesisId: 'H001',
          relationType: 'challenges',
          relationLabel: 'يتحدى / يطعن في (challenges)',
          rationale:
            "وجود نقل رسمي بين برجين مختلفين عام 1921 (S003) يتعارض مع الفرضية القائلة بأن S001 وS002 تتحدثان عن حدث وحيد في نفس المكان.",
        },
        {
          id: 'ER003',
          caseId: 'C001',
          sourceId: 'S001',
          hypothesisId: 'H003',
          relationType: 'insufficient',
          relationLabel: 'دليل غير كافٍ (insufficient)',
          rationale:
            "تثبت الرسالة البلدية لعام 1920 (S001) الافتتاح الإداري على البرج القديم، لكنها غير كافية لإثبات ما كان يعلمه عموم السكان في ذلك التاريخ.",
        },
        {
          id: 'ER004',
          caseId: 'C001',
          sourceId: 'S002',
          hypothesisId: 'H003',
          relationType: 'insufficient',
          relationLabel: 'دليل غير كافٍ (insufficient)',
          rationale:
            "مقال الصحيفة لعام 1922 (S002) ينقل اكتشاف الساعة على البرج الجديد، لكنه غير كافٍ لنفي معرفة سابقة لدى بعض المواطنين.",
        },
        {
          id: 'ER005',
          caseId: 'C001',
          sourceId: 'S001',
          hypothesisId: 'H001',
          relationType: 'unrelated',
          relationLabel: 'بدون صلة إثباتية مستقلة (unrelated)',
          rationale:
            "عند قراءة الرسالة S001 بمعزل عن غيرها، لا تحتوي على ما يثبت أو ينفي صحة تاريخ 1922 قبل المقارنة المعمارية.",
        },
      ],
    };
  }

  if (locale === 'en') {
    return {
      caseData: {
        id: 'C001',
        title: "The Clock Mystery",
        city: 'Memoria (Fictional City)',
        description:
          "Two documents from the municipal archives of Memoria appear to contradict each other regarding the monumental clock: one mentions an inauguration in June 1920, while the other claims residents discover it for the first time in May 1922.",
        objective:
          "Understand why two archival documents record different dates for the clock, identify the missing information that resolves this discrepancy, and submit an argumented conclusion.",
        promise: "Don't guess history: discover what's missing to understand it.",
        status: 'open',
        fictional: true,
      },
      sources: [
        {
          id: 'S001',
          caseId: 'C001',
          title: 'Municipal Letter',
          sourceType: 'Lettre municipale',
          date: '15/06/1920',
          isoDate: '1920-06-15',
          content: "« The clock of the old tower was inaugurated today. »",
          contextNote:
            "Internal administrative correspondence addressed to the town clerk of Memoria. Explicitly cites the building known as the 'old tower'.",
          archiveCode: 'MEM-ADM-1920-0615',
          buildingMentioned: 'Old Municipal Tower',
          illustrationType: 'old-tower',
          illustrationAlt:
            "Fictional archival illustration of the municipal letter of 15/06/1920 displaying the stamp of Memoria old tower.",
          fictional: true,
        },
        {
          id: 'S002',
          caseId: 'C001',
          title: 'Local Newspaper',
          sourceType: 'Journal local',
          date: '04/05/1922',
          isoDate: '1922-05-04',
          content:
            "« Residents discover for the first time the clock installed on the new tower. »",
          contextNote:
            "Press clipping published on the front page of The Memoria Echo. Emphasizes the public's reaction before the 'new tower'.",
          archiveCode: 'MEM-PRS-1922-0504',
          buildingMentioned: 'New Central Tower',
          illustrationType: 'new-tower',
          illustrationAlt:
            "Fictional archival illustration of the newspaper clipping of 04/05/1922 describing the clock on the new tower.",
          fictional: true,
        },
        {
          id: 'S003',
          caseId: 'C001',
          title: 'Technical Register',
          sourceType: 'Registre technique',
          date: '12/09/1921',
          isoDate: '1921-09-12',
          content:
            "« The clock of the old tower was dismantled to be transferred to the new tower. »",
          contextNote:
            "Excerpt from the municipal workshops log of Memoria. Documents a mechanical transfer operation between two buildings in September 1921.",
          archiveCode: 'MEM-TEC-1921-0912',
          buildingMentioned: 'Old Tower → New Tower',
          illustrationType: 'transfer-register',
          illustrationAlt:
            "Fictional archival illustration of technical register of 12/09/1921 attesting clock dismantling and transfer.",
          fictional: true,
          requiresQuestionId: 'Q001',
        },
      ],
      claims: [
        {
          id: 'CL001',
          caseId: 'C001',
          title: 'Claim A — 1920 Archive',
          statement: 'An inauguration is recorded in 1920 (S001)',
          yearLabel: '15 June 1920',
          locationLabel: 'Old Tower',
          sourceIds: ['S001'],
        },
        {
          id: 'CL002',
          caseId: 'C001',
          title: 'Claim B — 1922 Archive',
          statement: 'A first discovery on the new tower is recorded in 1922 (S002)',
          yearLabel: '4 May 1922',
          locationLabel: 'New Tower',
          sourceIds: ['S002'],
        },
        {
          id: 'CL003',
          caseId: 'C001',
          title: 'Claim C — 1921 Documentary Link',
          statement: 'A transfer is documented in 1921 (S003)',
          yearLabel: '12 September 1921',
          locationLabel: 'From the old tower to the new tower',
          sourceIds: ['S003'],
          requiresQuestionId: 'Q001',
        },
      ],
      hypotheses: [
        {
          id: 'H001',
          caseId: 'C001',
          code: 'H001',
          title: 'Same Event (Assumed Date Error)',
          text: 'Both archives describe one and the same event in the same place, one of the two dates (1920 or 1922) being erroneous.',
          status: 'challenged',
          epistemicNote:
            'Challenged as soon as the difference of building (old tower vs new tower) and the 1921 transfer register are noticed.',
        },
        {
          id: 'H002',
          caseId: 'C001',
          code: 'H002',
          title: 'Distinct Events (Inauguration then Reinstallation)',
          text: 'The clock was first inaugurated on the old tower in 1920, transferred in 1921, and discovered on the new tower in 1922.',
          status: 'plausible',
          epistemicNote:
            'Supported by S003, which chronologically and materially links both locations without requiring any date errors.',
        },
        {
          id: 'H003',
          caseId: 'C001',
          code: 'H003',
          title: 'Insufficient Evidence to Certify All Details',
          text: 'Available archives do not suffice to prove what each resident knew in 1920 nor why the 1922 newspaper used a broad statement.',
          status: 'open_uncertainty',
          epistemicNote:
            'A reminder of documentary limits: a technical act (S003) accounts for physical displacement, not the subjective memory of all residents.',
        },
      ],
      questions: [
        {
          id: 'Q001',
          caseId: 'C001',
          shortLabel: 'Spatial & Physical Trail (Q001)',
          text: "Did the clock change buildings?",
          relevantSourceIds: ['S003'],
          unlocksClaimId: 'CL003',
          trackStatus: 'pertinent_bridge',
          trackStatusLabel: 'Pertinent trail — New clue revealed (S003)',
          feedback:
            "Pertinent trail: by questioning the change of building between the 'old tower' (1920) and the 'new tower' (1922), you unlock access to technical register S003 of 12/09/1921 documenting the transfer.",
          epistemicLimit:
            "Scope of clue: S003 makes the existence of two distinct events highly plausible, without fully proving individual testimonies of all residents.",
        },
        {
          id: 'Q002',
          caseId: 'C001',
          shortLabel: 'Manufacturing Trail (Q002)',
          text: "Who made the clock?",
          relevantSourceIds: [],
          trackStatus: 'unanswered_in_corpus',
          trackStatusLabel: 'Out of causal scope — No related document',
          feedback:
            "No answer in the corpus: the identity of the clockmaker does not directly explain the discrepancy in dates and buildings between 1920 and 1922.",
          epistemicLimit:
            "Methodological lesson: a question can be factually interesting without helping resolve an apparent contradiction between two sources.",
        },
        {
          id: 'Q003',
          caseId: 'C001',
          shortLabel: 'Collective Perception Trail (Q003)',
          text: 'Did witnesses know about the old tower?',
          relevantSourceIds: [],
          trackStatus: 'insufficient_data',
          trackStatusLabel: 'Insufficient data in corpus — Unresolved trail',
          feedback:
            "Reasonable but unresolved trail (insufficient data): knowing whether residents visited the old tower might explain the tone of the 1922 paper, but municipal archives contain no record of individual testimonies.",
          epistemicLimit:
            "Methodological lesson: identifying what the corpus cannot tell us protects against unwarranted generalizations.",
        },
      ],
      relations: [
        {
          id: 'ER001',
          caseId: 'C001',
          sourceId: 'S003',
          hypothesisId: 'H002',
          relationType: 'supports',
          relationLabel: 'Supports (supports)',
          rationale:
            "The dismantling and transfer documented on 12/09/1921 (S003) are fully compatible with two distinct events: inauguration on the old tower in 1920, then discovery on the new tower in 1922.",
        },
        {
          id: 'ER002',
          caseId: 'C001',
          sourceId: 'S003',
          hypothesisId: 'H001',
          relationType: 'challenges',
          relationLabel: 'Challenges (challenges)',
          rationale:
            "The existence of an official transfer between two different towers in 1921 (S003) contradicts the hypothesis that S001 and S002 speak of a single misdated event in the same location.",
        },
        {
          id: 'ER003',
          caseId: 'C001',
          sourceId: 'S001',
          hypothesisId: 'H003',
          relationType: 'insufficient',
          relationLabel: 'Insufficient evidence (insufficient)',
          rationale:
            "The 1920 municipal letter (S001) confirms administrative inauguration on the old tower, but is insufficient to prove what all Memoria residents knew at that time.",
        },
        {
          id: 'ER004',
          caseId: 'C001',
          sourceId: 'S002',
          hypothesisId: 'H003',
          relationType: 'insufficient',
          relationLabel: 'Insufficient evidence (insufficient)',
          rationale:
            "The 1922 newspaper article (S002) reports the clock discovery on the new tower, but is insufficient to prove that no citizen had previous knowledge of it.",
        },
        {
          id: 'ER005',
          caseId: 'C001',
          sourceId: 'S001',
          hypothesisId: 'H001',
          relationType: 'unrelated',
          relationLabel: 'No autonomous probative link (unrelated)',
          rationale:
            "Read in isolation, letter S001 of 1920 contains nothing to evaluate the truth or falsity of the 1922 date prior to architectural comparison.",
        },
      ],
    };
  }

  // French default
  return CASE_C001_DATASET;
}

export const FICTIONAL_WARNING_BADGE = 'Archives fictives — démonstration';
export const LOCAL_RECEIPT_BADGE = 'Contribution enregistrée localement — démonstration';

export const CONCLUSION_OPTIONS: ConclusionOption[] = getLocalizedConclusionOptions('fr');

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
