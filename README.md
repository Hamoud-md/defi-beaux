# The Memory City — The Echo Detective

> **Défi secondaire :** *Oh les beaux boutons* — La Nuit de l’Info 2025 (Thème UX / Gamification / Accessibilité)  
> **Nature du projet :** Simulation pédagogique autonome d’investigation archivistique dans une ville fictive (*Memoria*).  
> **Avertissement obligatoire :** **Archives fictives — démonstration.**

---

## 1. Présentation & Concept

Dans le cadre du défi **« Oh les beaux boutons »**, l'objectif est de transformer une attention passive en action concrète et signifiante grâce à une UX soignée, une gamification éthique et des interactions originales.

Plutôt que de proposer un simple quiz binaire (« 1920 ou 1922 ? ») incitant à la devinette, **The Echo Detective** place l'utilisateur dans le rôle d'un enquêteur examinant des archives contradictoires de la ville fictive de Memoria :
* **Pièce S001 (15/06/1920) :** Lettre municipale attestant l'inauguration de l'horloge sur la *vieille tour*.
* **Pièce S002 (04/05/1922) :** Coupure de presse relatant la première découverte de l'horloge par les citoyens sur la *nouvelle tour*.

### Signature Interaction — The Missing Bridge (Le Pont Manquant)
Au centre de l'écran, le lien entre les deux affirmations apparaît comme **une question non résolue** :
* **Question Q001 (« L'horloge a-t-elle changé de bâtiment ? ») :** Piste pertinente ouvrant l'accès au registre technique **S003 du 12/09/1921**, documentant le démontage et le transfert entre l'ancienne et la nouvelle tour.
* **Question Q002 (« Qui a fabriqué l'horloge ? ») :** Hors périmètre causal — feedback expliquant que le constructeur n'explique pas la divergence des dates.
* **Question Q003 (« Les témoins connaissaient-ils la vieille tour ? ») :** Données insuffisantes dans le corpus municipal — rappel des limites de l'archive.

---

## 2. Architecture & Choix Techniques (TDR-001 & CDR-001)

* **Framework & Typage :** React 19 + TypeScript (Strict mode) + Vite.
* **Direction Artistique (CDR-001) :** *Noir Archivistique Contemporain* (`#101A24`, `#203549`, papier documentaire `#E8DCC8`, accents ambre `#C58A45` et sauge/teal `#3A8C79`). Typographies *DM Sans* et *Cormorant Garamond*.
* **Cartes 3D interactives (CDR-002) :** *Cartes Archivistiques Volumétriques*. Chaque point de décision de l'enquête est matérialisé par un **éventail de cartes en 3D** (`Deck3D`) posé dans une scène de perspective CSS. Les cartes **retournent physiquement sur 180°** (`FlipCard3D`) en fonction du choix de l'utilisateur : la face avant porte la question / le verdict, la face arrière porte la réponse causale ou l'avertissement épistémique. La carte choisie est **avancée en profondeur** (`translateZ`) et mise en avant, les autres reculent et s'assombrissent. Une inclinaison parallaxe suit le pointeur (`useTilt3D`).
  * *S02* : les deux pièces S001 / S002 forment un éventail documentaire en profondeur.
  * *S03 (Signature Interaction)* : les trois pistes de recherche Q001 / Q002 / Q003 sont des cartes à retourner — le investigator « retourne » littéralement la piste choisie pour découvrir ce qu'elle répond.
  * *S04* : les hypothèses H001 / H002 / H003 sont disposées en éventail sur la table de raisonnement.
  * *S05* : les trois verdicts autorisés deviennent des cartes ; choisir un verdict fait pivoter sa carte et révèle son avertissement épistémique.
  * *Barre de progression* : les six étapes S01–S06 sont disposées sur un **chemin 3D**, l'étape active étant soulevée.
* **Motion Design (M01–M10) :** Micro-transitions contrôlées par variables CSS (120ms à 240ms), respect absolu de `prefers-reduced-motion` et bascule explicite d'accessibilité. Sous mouvement réduit, la profondeur décorative est aplatie et les transitions supprimées, **mais la rotation 180° de la carte est conservée** afin que la face arrière reste accessible.
* **Robustesse du rendu 3D :** aucune valeur d'`opacity`, de `filter` ou d'`isolation` n'est appliquée sur un conteneur `preserve-3d` (ces propriétés aplatiraient le contexte 3D et casseraient le retournement). L'assombrissement des cartes en retrait est réalisé par un voile superposé, et les faces arrière restent dans l'arbre d'accessibilité (aucun `aria-hidden`, aucun démontage).
* **Persistance & Intégrité (F07 / A08 / A22) :** Sauvegarde réelle dans le `LocalStorage` local de démonstration avec **relecture et vérification immédiate de concordance** avant émission de tout reçu. En cas de panne de stockage simulée (Test A22), aucun faux reçu n'est généré et la saisie de l'utilisateur est préservée.
* **Sécurité :** Neutralisation systématique des balises HTML dans les justifications d'enquête (Section 10).
* **Mode Fallback (A23) :** Commutateur permettant de basculer à tout moment entre la Signature Interaction (*Missing Bridge*) et le mode *Comparaison guidée classique*.

---

## 3. Matrice de Traçabilité des Exigences & Tests (A01 à A23)

| ID Test | Exigence | Scénario | Résultat & Preuve |
|---|---|---|---|
| **A01** | F01 / OFF-01 | Ouverture du dossier C001 | Validé (vue S01 avec titre, contexte et CTA) |
| **A02** | OFF-02 | Clarté et vulgarisation sans jargon | Validé (objectifs et méthode expliqués simplement) |
| **A03** | F02 / M02 | Examen des sources S001 et S002 | Validé (consultation, dates, cotes et fac-similés accessibles) |
| **A04** | **F03 / M03** | **Signature Interaction — The Missing Bridge** | **Validé (Q001, Q002, Q003 avec feedbacks causaux distincts)** |
| **A05** | F04 / M04 | Révélation de l'indice S003 | Validé (S003 apparaît immédiatement à proximité lors de Q001) |
| **A06** | F05 / M05 | Raisonnement sur preuves & 4 types de relations | Validé (qualification *supports*, *challenges*, *insufficient*, *unrelated*) |
| **A07** | F06 / M06 / P11 | Verdict réversible | Validé (comparaison Avant/Après avec pièces conservées) |
| **A08** | F07 / M07 | Enregistrement et vérification par relecture | Validé (écriture + relecture immédiate, reçu avec statut exact) |
| **A09** | F09 / M08 | Validation de saisie et récupération clavier | Validé (justification < 15 car. bloquée avec focus automatique) |
| **A10** | F11 / OFF-03 | Accessibilité clavier & ARIA | Validé (skip-link, outline focus 3px net, boutons natifs) |
| **A11** | F10 / OFF-04 | Progression factuelle vérifiée | Validé (5 jalons réels, progression découplée des clics décoratifs) |
| **A12** | M01–M10 / OFF-05 | Mode Reduced Motion | Validé (bascule instantanée, suppression des animations) |
| **A13** | OFF-06 | Démonstration Missing Bridge | Validé (liaison dynamique question → indice → hypothèse) |
| **A14** | OFF-07 | Dark patterns éthiques | Validé (aucun consentement forcé, transparence complète) |
| **A16** | F08 | Restauration de session après rafraîchissement | Validé (reprise d'état depuis le stockage local) |
| **A17** | F12 | Avertissement fictionnel permanent | Validé (badge « Archives fictives — démonstration ») |
| **A18** | Section 10 | Mise en page adaptative responsive | Validé (grille CSS fluide de 360px à 1440px) |
| **A20** | Dataset | Détection de référence corrompue | Validé (détection automatique, écran d'alerte et blocage) |
| **A21** | Dataset | Détection de jeu de données vide | Validé (signalement d'indisponibilité sans faux succès) |
| **A22** | Stockage | Panne de stockage simulée | Validé (aucun reçu mensonger, saisie conservée intacte) |
| **A23** | UX | Comparaison Signature vs Baseline classique | Validé (bouton de bascule interactif en en-tête) |
| **C01** | CDR-002 | Éventail 3D des trois pistes de recherche | Validé (`research-questions-deck` : 3 emplacements, 3 cartes, 6 faces) |
| **C02** | CDR-002 | Retournement de la carte déclenché par le choix | Validé (`select-question-Q001` → `.card-3d.is-flipped` + emplacement actif) |
| **C03** | CDR-002 / A10 | Face arrière accessible aux technologies d'assistance | Validé (`question-feedback-Q002` présent dans `.card-3d__face--back`, non masqué) |
| **C04** | CDR-002 | Éventail 3D des trois verdicts autorisés | Validé (`verdict-cards-deck` + radio-boutons préservés et focalisables) |
| **C05** | CDR-002 / A12 | Retournement toujours utilisable en mouvement réduit | Validé (`data-reduced-motion="true"` → carte toujours retournable, transitions supprimées) |

---

## 4. Installation, Lancement et Tests

### Pré-requis
* Node.js >= 18 (testé avec Node v24.15.0)
* npm >= 9 (testé avec npm 11.12.1)

### Installation
```bash
npm install
```

### Lancement en développement
```bash
npm run dev
```

### Vérification TypeScript & Linting
```bash
npm run lint
```

### Exécution de la suite de tests automatisés (Vitest + React Testing Library)
```bash
npm test
```

### Build de production
```bash
npm run build
```
Le livrable statique optimisé est généré dans le dossier `dist/`.

---

## 5. Outils de Démonstration & Test Intégrés

Une barre d'outils de test est accessible en bas de page pour vérifier les comportements de résilience en direct :
1. **Simuler panne stockage (A22) :** bloque l'écriture dans le navigateur pour démontrer qu'aucun faux reçu n'est émis et que la saisie reste récupérable.
2. **Tester Dataset vide (A21) :** simule l'absence de dossier pour valider l'affichage de l'état d'erreur et le bouton de récupération.
3. **Tester Réf. rompue (A20) :** simule une corruption référentielle pour vérifier la validation du domaine.
