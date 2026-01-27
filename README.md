# KabelFit 💪

Application mobile de suivi d'entraînement développée avec **React Native** et **Expo**.

![React Native](https://img.shields.io/badge/React%20Native-0.81-blue)
![Expo](https://img.shields.io/badge/Expo-SDK%2054-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Tests](https://img.shields.io/badge/Tests-77%20passing-green)
![Coverage](https://img.shields.io/badge/Coverage-89%25-brightgreen)

## 📱 Fonctionnalités

### 🏋️ Gestion d'entraînement

- **Programmes** : Créer des programmes personnalisés (Force, Cardio, HIIT, Yoga)
- **Séances** : Organiser des séances par jour de la semaine avec durée estimée
- **Exercices** : Configurer séries, répétitions, temps de repos et groupe musculaire
- **Ordre personnalisé** : Réorganiser les séances et exercices

### 📊 Suivi et progression

- **Historique** : Consulter toutes les séances terminées
- **Compteur de pas** : Suivi quotidien avec capteur podomètre natif
- **Statistiques** : Visualiser sa progression

### 🎨 Interface utilisateur

- **Thème sombre** : Design moderne et élégant
- **Navigation fluide** : Onglets + navigation par pile
- **Feedback haptique** : Vibrations lors des interactions
- **Animations** : Transitions fluides avec Reanimated

## 📸 Captures d'écran

| Accueil                          | Programmes           | Séance              | Exercice               |
| -------------------------------- | -------------------- | ------------------- | ---------------------- |
| Menu principal avec accès rapide | Liste des programmes | Détail d'une séance | Configuration exercice |

## 🚀 Installation

```bash
# Cloner le projet
git clone https://github.com/Kaz5273/FinalProject_ReactNative.git
cd KabelFit

# Installer les dépendances
npm install

# Lancer l'application
npx expo start
```

Scannez le QR code avec **Expo Go** (iOS/Android).

## 🏗️ Architecture

```
KabelFit/
├── app/                    # Écrans (file-based routing avec expo-router)
│   ├── (tabs)/             # Navigation par onglets
│   ├── program/            # Pages programmes
│   ├── session/            # Pages séances
│   ├── exercise/           # Pages exercices
│   └── history/            # Historique
├── components/             # Composants réutilisables
│   ├── forms/              # Formulaires (ExerciseForm, SessionForm)
│   ├── session/            # Composants séance (SessionCard, ExerciseCard)
│   ├── program/            # Composants programme
│   └── ui/                 # Composants UI (Badge, Modal, etc.)
├── database/               # Base de données SQLite
│   ├── index.ts            # Initialisation DB
│   ├── types.ts            # Types TypeScript
│   └── *Service.ts         # Services CRUD
├── stores/                 # State management (Zustand)
│   ├── useSessionStore.ts
│   ├── useExerciseStore.ts
│   ├── useUserStore.ts
│   └── useWorkoutHistoryStore.ts
├── hooks/                  # Hooks personnalisés
├── utils/                  # Utilitaires (validationSchemas.ts)
└── __tests__/              # Tests (Jest + RNTL)
```

## 🛠️ Stack technique

| Catégorie           | Technologie                                    |
| ------------------- | ---------------------------------------------- |
| **Framework**       | React Native 0.81 + Expo SDK 54                |
| **Navigation**      | Expo Router (file-based routing)               |
| **State**           | Zustand (stores réactifs)                      |
| **Base de données** | SQLite (expo-sqlite) - stockage local          |
| **Formulaires**     | Formik (gestion) + Yup (validation)            |
| **Tests**           | Jest + React Native Testing Library + Maestro  |
| **UI/Animations**   | React Native Reanimated + Expo Linear Gradient |
| **Langage**         | TypeScript 5.9                                 |

### 📚 Dépendances principales

```json
{
  "expo": "~54.0.12",
  "react-native": "0.81.4",
  "zustand": "^5.0.9",
  "expo-sqlite": "^16.0.8",
  "expo-router": "~6.0.10",
  "formik": "^2.4.9",
  "yup": "^1.7.1",
  "expo-sensors": "~15.0.8"
}
```

## 🧪 Tests

Le projet utilise une stratégie de tests en 3 niveaux :

```bash
# Lancer tous les tests
npm test

# Tests unitaires uniquement
npm run test:unit

# Tests UI uniquement
npm run test:ui

# Avec couverture de code
npm run test:coverage

# Pipeline CI
npm run test:ci

# Tests E2E (nécessite Maestro)
npm run test:e2e
```

### Couverture actuelle

| Type      | Framework                    | Nombre | Couverture |
| --------- | ---------------------------- | ------ | ---------- |
| Unitaires | Jest                         | 43     | ~89%       |
| UI        | React Native Testing Library | 34     |            |
| E2E       | Maestro                      | 1      |            |

**Seuil de couverture configuré : 60%**

## 📦 Scripts disponibles

| Commande                | Description                    |
| ----------------------- | ------------------------------ |
| `npm start`             | Lancer Expo                    |
| `npm run android`       | Lancer sur Android             |
| `npm run ios`           | Lancer sur iOS                 |
| `npm run lint`          | Linter ESLint                  |
| `npm test`              | Lancer les tests               |
| `npm run test:coverage` | Tests + rapport de couverture  |
| `npm run test:ci`       | Pipeline CI (coverage + junit) |

## 🗄️ Base de données

L'application utilise **SQLite** en local (pas d'API REST). Les données sont stockées directement sur l'appareil.

### Schéma de la base

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│   programs   │───1:N─│   sessions   │───1:N─│  exercises   │
│──────────────│       │──────────────│       │──────────────│
│ id           │       │ id           │       │ id           │
│ name         │       │ program_id   │       │ session_id   │
│ type         │       │ name         │       │ name         │
│ duration_wks │       │ day_of_week  │       │ muscle_group │
│ difficulty   │       │ duration_min │       │ sets / reps  │
│ objective    │       │ order        │       │ rest_minutes │
└──────────────┘       └──────────────┘       └──────────────┘
                              │
                              │ 1:N
                              ▼
                       ┌──────────────┐
                       │ workout_logs │
                       │──────────────│
                       │ id           │
                       │ session_id   │
                       │ started_at   │
                       │ completed_at │
                       │ status       │
                       └──────────────┘
```

### Tables principales

| Table          | Description                                          |
| -------------- | ---------------------------------------------------- |
| `users`        | Profils utilisateurs (nom, email, objectifs, niveau) |
| `programs`     | Programmes d'entraînement (type, durée, difficulté)  |
| `sessions`     | Séances liées à un programme (jour, durée, ordre)    |
| `exercises`    | Exercices d'une séance (séries, reps, repos)         |
| `workout_logs` | Historique des entraînements effectués               |

### Services CRUD

Chaque entité a son service dans `database/` :

- `programService.ts` - CRUD programmes
- `sessionService.ts` - CRUD séances
- `exerciseService.ts` - CRUD exercices
- `logService.ts` - Gestion de l'historique

## 📂 Dossiers clés

| Dossier       | Contenu                             |
| ------------- | ----------------------------------- |
| `app/`        | Écrans et navigation (expo-router)  |
| `components/` | Composants React réutilisables      |
| `database/`   | SQLite : init, types, services CRUD |
| `stores/`     | State management Zustand            |
| `__tests__/`  | Tests unitaires et UI               |
| `e2e/`        | Tests end-to-end Maestro            |
