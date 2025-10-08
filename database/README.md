# Base de données SQLite - KabelFit

## Structure

La base de données utilise 7 tables principales interconnectées :

### Tables

1. **programs** - Programmes d'entraînement
2. **exercises** - Bibliothèque d'exercices (prédéfinis + personnalisés)
3. **sessions** - Séances planifiées
4. **session_exercises** - Liaison entre séances et exercices
5. **session_logs** - Historique des séances effectuées
6. **rep_logs** - Répétitions enregistrées pendant les séances
7. **comments** - Commentaires texte ou audio sur les séances

### Relations

```
programs (1) ──< (N) sessions
exercises (1) ──< (N) session_exercises
sessions (1) ──< (N) session_exercises
sessions (1) ──< (N) session_logs
session_logs (1) ──< (N) rep_logs
session_logs (1) ──< (N) comments
exercises (1) ──< (N) rep_logs
```

## Initialisation

La base de données doit être initialisée au démarrage de l'application :

```typescript
import { initDatabase, seedDatabase } from '@/database';

// Au démarrage de l'app
await initDatabase();
await seedDatabase(); // Insère des exercices de démonstration
```

## Utilisation des services

### Programmes

```typescript
import { 
  getAllPrograms, 
  createProgram, 
  updateProgram, 
  deleteProgram 
} from '@/database';

// Créer un programme
const programId = await createProgram({
  name: 'Programme Débutant',
  description: 'Programme pour débutants'
});

// Récupérer tous les programmes
const programs = await getAllPrograms();

// Mettre à jour
await updateProgram(programId, { name: 'Nouveau nom' });

// Supprimer (supprime aussi toutes les séances associées)
await deleteProgram(programId);
```

### Exercices

```typescript
import { 
  getAllExercises, 
  createExercise, 
  getExercisesByCategory,
  searchExercises 
} from '@/database';

// Créer un exercice personnalisé
const exerciseId = await createExercise({
  name: 'Mon exercice',
  description: 'Description',
  category: 'Force',
  is_custom: true
});

// Rechercher des exercices
const results = await searchExercises('pompe');

// Filtrer par catégorie
const forceExercises = await getExercisesByCategory('Force');
```

### Séances

```typescript
import { 
  createSession, 
  getSessionWithExercises,
  getUpcomingSessions 
} from '@/database';

// Créer une séance complète avec exercices
const sessionId = await createSession({
  program_id: 1,
  name: 'Séance HIIT',
  type: 'HIIT',
  duration: 1200, // 20 minutes en secondes
  scheduled_date: '2025-10-15T18:00:00',
  exercises: [
    { exercise_id: 1, order: 1, sets: 3, reps: 15, rest_time: 60 },
    { exercise_id: 2, order: 2, sets: 3, reps: 20, rest_time: 45 }
  ]
});

// Récupérer une séance avec tous ses exercices
const session = await getSessionWithExercises(sessionId);

// Prochaines séances planifiées
const upcoming = await getUpcomingSessions(5);
```

### Logs de séances

```typescript
import { 
  startSessionLog, 
  logRep, 
  completeSessionLog,
  addComment,
  getSessionLogsWithStats 
} from '@/database';

// Démarrer une séance
const logId = await startSessionLog({
  session_id: sessionId,
  start_time: new Date().toISOString()
});

// Enregistrer des répétitions pendant la séance
await logRep({
  log_id: logId,
  exercise_id: 1,
  set_number: 1,
  reps_completed: 15,
  time_seconds: 45
});

// Terminer la séance
await completeSessionLog(
  logId,
  new Date().toISOString(),
  1200 // durée totale en secondes
);

// Ajouter un commentaire
await addComment({
  log_id: logId,
  text: 'Très bonne séance',
  exercise_id: 1 // optionnel, pour commenter un exercice spécifique
});

// Récupérer l'historique avec statistiques
const history = await getSessionLogsWithStats(20);
```

### Statistiques

```typescript
import { 
  getExerciseStats, 
  getGlobalStats 
} from '@/database';

// Statistiques d'un exercice
const exerciseStats = await getExerciseStats(1);
// { total_sessions, total_reps, avg_reps, max_reps }

// Statistiques globales
const globalStats = await getGlobalStats();
// { total_sessions, completed_sessions, total_time, total_reps }
```

## Transactions

Les opérations critiques utilisent des transactions pour garantir la cohérence :

- Création de séance avec exercices (createSession)
- La transaction assure que soit tout est créé, soit rien en cas d'erreur

## Index

Les tables sont indexées sur les colonnes fréquemment requêtées :
- Dates de création et de planification
- Clés étrangères
- Colonnes de filtrage (catégorie, type, statut)

Cela garantit des performances optimales même avec beaucoup de données.

## Contraintes

- Foreign keys activées : suppression en cascade des données liées
- Types de séances : AMRAP, HIIT, EMOM uniquement
- Statuts de log : in_progress, completed, abandoned

## Réinitialisation

Pour développement uniquement - supprime toutes les données :

```typescript
import { resetDatabase } from '@/database';

await resetDatabase();
```
