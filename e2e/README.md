# Tests E2E avec Maestro pour KabelFit

Ce dossier contient les tests End-to-End (E2E) utilisant [Maestro](https://maestro.mobile.dev/).

## Installation de Maestro

### macOS

```bash
curl -Ls "https://get.maestro.mobile.dev" | bash
```

### Windows (via WSL ou Chocolatey)

```bash
# Via Chocolatey
choco install maestro

# Ou via WSL (recommandé)
wsl --install
# Puis dans WSL:
curl -Ls "https://get.maestro.mobile.dev" | bash
```

## Structure des tests

```
e2e/
├── maestro.yaml          # Configuration principale
├── README.md             # Ce fichier
└── flows/
    └── home-to-programs.yaml  # Test du parcours accueil → programmes
```

## Lancer les tests

### Prérequis

1. Un émulateur Android ou simulateur iOS en cours d'exécution
2. L'application installée sur l'émulateur/simulateur

### Commandes

```bash
# Lancer tous les tests E2E
npm run test:e2e

# Lancer un test spécifique
maestro test e2e/flows/home-to-programs.yaml

# Mode studio (interactif)
maestro studio
```

## Écriture de tests

Consultez la [documentation Maestro](https://maestro.mobile.dev/api-reference/commands) pour plus de détails sur les commandes disponibles.

### Commandes courantes

- `launchApp` - Lancer l'application
- `tapOn` - Appuyer sur un élément
- `assertVisible` - Vérifier qu'un élément est visible
- `inputText` - Saisir du texte
- `scroll` - Faire défiler
- `swipe` - Faire glisser
