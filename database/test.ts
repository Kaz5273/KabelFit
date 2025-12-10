/**
 * Script de test pour vérifier le bon fonctionnement de la base de données
 * Peut être exécuté pour valider l'implémentation SQLite
 */

import {
  addComment,
  completeSessionLog,
  createExercise,
  createProgram,
  createSession,
  getAllExercises,
  getAllPrograms,
  getGlobalStats,
  getSessionLogsWithStats,
  getSessionWithExercises,
  initDatabase,
  logRep,
  seedDatabase,
  startSessionLog
} from './index';

export const testDatabase = async () => {
  console.log('Début des tests de la base de données...');

  try {
    // Test 1: Initialisation
    console.log('\n1. Initialisation de la base de données...');
    await initDatabase();
    await seedDatabase();
    console.log('Initialisation réussie');

    // Test 2: Exercices
    console.log('\n2. Test des exercices...');
    const exercises = await getAllExercises();
    console.log(`${exercises.length} exercices chargés`);

    // Note: createExercise nécessite un session_id, on teste après création de session

    // Test 3: Programmes
    console.log('\n3. Test des programmes...');
    const programId = await createProgram({
      name: 'Programme Test',
      description: 'Programme de test',
      type: 'Strength',
      duration_weeks: 8,
      sessions_per_week: 3,
      difficulty_level: 'Intermediate'
    });
    console.log(`Programme créé avec ID: ${programId}`);

    const programs = await getAllPrograms();
    console.log(`${programs.length} programme(s) dans la base`);

    // Test 4: Séances
    console.log('\n4. Test des séances...');
    const sessionId = await createSession({
      program_id: programId,
      name: 'Séance Test HIIT',
      duration_minutes: 20,
      order: 1
    });
    console.log(`Séance créée avec ID: ${sessionId}`);

    // Test des exercices pour cette séance
    const exerciseId = await createExercise({
      session_id: sessionId,
      name: 'Test Exercise',
      description: 'Exercice de test',
      muscle_group: 'Pectoraux',
      sets: 3,
      reps: 10,
      rest_minutes: 1.5
    });
    console.log(`Exercice créé avec ID: ${exerciseId}`);

    const session = await getSessionWithExercises(sessionId);
    console.log(`Séance récupérée avec ${session?.exercises.length} exercices`);

    // Test 5: Logs de séances
    console.log('\n5. Test des logs de séances...');
    const startTime = new Date().toISOString();
    const logId = await startSessionLog({
      session_id: sessionId,
      start_time: startTime
    });
    console.log(`Log de séance démarré avec ID: ${logId}`);

    // Enregistrer quelques répétitions
    await logRep({
      log_id: logId,
      exercise_id: 1,
      set_number: 1,
      reps_completed: 15,
      time_seconds: 45
    });

    await logRep({
      log_id: logId,
      exercise_id: 1,
      set_number: 2,
      reps_completed: 14,
      time_seconds: 50
    });

    console.log('Répétitions enregistrées');

    // Terminer la séance
    const endTime = new Date().toISOString();
    await completeSessionLog(logId, endTime, 600);
    console.log('Séance terminée');

    // Ajouter un commentaire
    await addComment({
      log_id: logId,
      text: 'Excellente séance de test',
      exercise_id: 1
    });
    console.log('Commentaire ajouté');

    // Test 6: Statistiques
    console.log('\n6. Test des statistiques...');
    const history = await getSessionLogsWithStats(10);
    console.log(`${history.length} séance(s) dans l'historique`);

    const stats = await getGlobalStats();
    console.log('Statistiques globales:', stats);

    console.log('\nTous les tests ont réussi!');
    return true;
  } catch (error) {
    console.error('Erreur lors des tests:', error);
    return false;
  }
};
