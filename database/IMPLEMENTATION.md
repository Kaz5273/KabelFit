# Implémentation SQLite - Documentation

## Fichiers créés

### Structure de base
- `database/index.ts` - Initialisation et configuration de la base de données
- `database/types.ts` - Types TypeScript pour toutes les entités
- `database/README.md` - Documentation d'utilisation

### Services CRUD
- `database/programService.ts` - Gestion des programmes d'entraînement
- `database/exerciseService.ts` - Gestion de la bibliothèque d'exercices
- `database/sessionService.ts` - Gestion des séances planifiées
- `database/logService.ts` - Gestion des logs de séances et statistiques

### Utilitaires
- `hooks/use-database.ts` - Hook React pour initialisation au démarrage
- `database/test.ts` - Script de test de la base de données

## Caractéristiques importantes

### 1. Architecture modulaire

Chaque entité possède son propre service avec des fonctions dédiées.
Facilite la maintenance et les tests unitaires.

### 2. Typage strict TypeScript

Tous les types sont définis dans types.ts.
Garantit la cohérence des données entre la base et l'application.

### 3. Relations et contraintes

Foreign keys activées avec suppression en cascade.
Assure l'intégrité référentielle des données.

### 4. Transactions

Les opérations complexes utilisent des transactions.
Exemple: création d'une séance avec ses exercices en une seule transaction atomique.

### 5. Index optimisés

Index sur les colonnes fréquemment requêtées.
Garantit de bonnes performances même avec beaucoup de données.

### 6. Données de démonstration

seedDatabase insère 10 exercices prédéfinis au premier lancement.
Facilite le développement et les tests.

## Utilisation dans l'application

### Initialisation au démarrage

Dans app/_layout.tsx, utiliser le hook useDatabase:

```typescript
import { useDatabase } from '@/hooks/use-database';

export default function RootLayout() {
  const { isLoading, error, isReady } = useDatabase();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorScreen error={error} />;
  }

  // Continuer le rendu normal
}
```

### Import des services

Tous les services sont exportés depuis database/index.ts:

```typescript
import { 
  createProgram, 
  getAllExercises, 
  createSession,
  startSessionLog 
} from '@/database';
```

## Points techniques importants

### SQLite et React Native

expo-sqlite utilise l'API moderne avec Promises.
Compatible iOS et Android sans configuration supplémentaire.

### Format des dates

Toutes les dates sont stockées en format ISO 8601 (string).
Utiliser new Date().toISOString() pour créer, new Date(string) pour parser.

### Boolean en SQLite

SQLite n'a pas de type boolean natif.
Utilisation de INTEGER avec 0 (false) et 1 (true).

### Durées et temps

Toutes les durées sont stockées en secondes (INTEGER).
Facilite les calculs et évite les conversions.

### Patterns de récurrence

Stockés en JSON dans le champ recurrence_pattern.
Permet de définir des règles complexes (tous les lundis, etc.).

### Chemins audio

Les commentaires vocaux stockent uniquement le chemin du fichier.
Les fichiers audio sont gérés par expo-file-system séparément.

## Évolutions futures possibles

### Migrations

Ajouter un système de versioning de schéma.
Permettra de modifier la structure sans perdre les données utilisateur.

### Sync cloud

Les IDs auto-incrémentés sont compatibles avec une synchronisation future.
Possibilité d'ajouter des UUID si synchronisation multi-devices.

### Backup

Implémenter une fonction d'export/import de la base complète.
Utile pour sauvegarde ou transfert entre appareils.

### Cache

Zustand peut cacher certaines requêtes fréquentes.
Réduira les accès à la base pour améliorer les performances.

## Maintenance

### Ajout d'une table

1. Créer la table dans initDatabase
2. Ajouter le type dans types.ts
3. Créer le service associé
4. Exporter depuis index.ts

### Modification de schéma

Pour le développement: utiliser resetDatabase().
Pour la production: implémenter un système de migrations.

### Débogage

Utiliser le script test.ts pour valider les opérations.
Consulter les logs console pour les erreurs SQL.
