# Tests - KabelFit

Ce document décrit la configuration des tests pour le projet KabelFit.

## 📋 Vue d'ensemble

Le projet utilise une stratégie de tests en 3 niveaux :

| Type     | Framework                    | Dossier           | Commande            |
| -------- | ---------------------------- | ----------------- | ------------------- |
| **Unit** | Jest                         | `__tests__/unit/` | `npm run test:unit` |
| **UI**   | React Native Testing Library | `__tests__/ui/`   | `npm run test:ui`   |
| **E2E**  | Maestro                      | `e2e/`            | `npm run test:e2e`  |

## 🚀 Commandes disponibles

```bash
# Lancer tous les tests (unit + UI)
npm test

# Tests unitaires uniquement
npm run test:unit

# Tests UI uniquement
npm run test:ui

# Mode watch (développement)
npm run test:watch

# Avec couverture de code
npm run test:coverage

# Pipeline CI (couverture + rapports)
npm run test:ci

# Tests E2E (nécessite Maestro installé)
npm run test:e2e
```

## 📊 Indicateurs de qualité

| Indicateur      | Objectif | Actuel  |
| --------------- | -------- | ------- |
| Tests unitaires | ≥5       | ✅ 43   |
| Tests UI        | ≥3       | ✅ 34   |
| Tests E2E       | ≥1       | ✅ 1    |
| Couverture      | ≥60%     | ✅ ~89% |
| Warnings Jest   | 0        | ✅ 0    |

## 📁 Structure des tests

```
__tests__/
├── setup.ts                    # Configuration globale Jest
├── unit/                       # Tests unitaires
│   ├── stores/
│   │   ├── useSessionStore.test.ts
│   │   └── useExerciseStore.test.ts
│   └── utils/
│       └── validationSchemas.test.ts
└── ui/                         # Tests UI (React Native Testing Library)
    └── components/
        ├── Button.test.tsx
        ├── Badge.test.tsx
        └── SessionCard.test.tsx

e2e/                            # Tests End-to-End (Maestro)
├── maestro.yaml               # Configuration Maestro
├── README.md                  # Documentation E2E
└── flows/
    └── home-to-programs.yaml  # Test du parcours principal
```

## 🛠 Configuration

### Jest (`jest.config.js`)

- **Preset**: `react-native`
- **Seuil de couverture**: 60% (branches, fonctions, lignes, statements)
- **Reporters**: text, lcov, html, json-summary

### Fichiers couverts

Les tests ciblent actuellement :

- `stores/useSessionStore.ts` - Gestion d'état des séances
- `stores/useExerciseStore.ts` - Gestion d'état des exercices
- `utils/validationSchemas.ts` - Schémas de validation Yup
- `components/ui/badge.tsx` - Composant Badge
- `components/session/SessionCard.tsx` - Carte de séance
- `src/components/Button.tsx` - Composant Button

## 🧪 Écrire de nouveaux tests

### Test unitaire

```typescript
// __tests__/unit/stores/myStore.test.ts
import { useMyStore } from "@/stores/useMyStore";

describe("useMyStore", () => {
  beforeEach(() => {
    useMyStore.getState().reset();
  });

  it("should do something", () => {
    // Arrange
    const expected = "value";

    // Act
    useMyStore.getState().doSomething();

    // Assert
    expect(useMyStore.getState().value).toBe(expected);
  });
});
```

### Test UI

```typescript
// __tests__/ui/components/MyComponent.test.tsx
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { MyComponent } from '@/components/MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent title="Test" />);

    expect(screen.getByText('Test')).toBeTruthy();
  });

  it('should handle press', () => {
    const onPress = jest.fn();
    render(<MyComponent onPress={onPress} />);

    fireEvent.press(screen.getByText('Button'));

    expect(onPress).toHaveBeenCalled();
  });
});
```

### Test E2E (Maestro)

```yaml
# e2e/flows/my-flow.yaml
appId: com.kabelfit.app
---
- launchApp:
    clearState: true

- assertVisible:
    text: "Mon texte"

- tapOn:
    text: "Mon bouton"

- assertVisible:
    text: "Résultat attendu"
```

## 🔧 Installation Maestro (E2E)

### macOS

```bash
curl -Ls "https://get.maestro.mobile.dev" | bash
```

### Windows (via Chocolatey)

```bash
choco install maestro
```

### Lancer les tests E2E

```bash
# Prérequis: émulateur/simulateur en cours d'exécution avec l'app installée
npm run test:e2e
```

## 📈 Couverture de code

Les rapports de couverture sont générés dans le dossier `coverage/` :

- `coverage/lcov-report/index.html` - Rapport HTML interactif
- `coverage/lcov.info` - Fichier LCOV pour CI/CD
- `coverage/coverage-summary.json` - Résumé JSON

## 🔄 CI/CD

La commande `npm run test:ci` est conçue pour les pipelines CI/CD :

- Exécute tous les tests
- Génère les rapports de couverture
- Échoue si le seuil de couverture n'est pas atteint

Exemple GitHub Actions :

```yaml
- name: Run tests
  run: npm run test:ci
```
