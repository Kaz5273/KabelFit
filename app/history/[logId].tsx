import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';

const crimson = Colors.dark.primary;
import {
    getCommentsBySessionLog,
    getRepLogsBySessionLog,
    getSessionLogById,
    getSessionWithExercises,
} from '@/database';
import type { Comment, RepLog, SessionLog, SessionWithExercises } from '@/database/types';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    View
} from 'react-native';

interface ExerciseStats {
  exerciseId: number;
  exerciseName: string;
  totalSets: number;
  totalReps: number;
  targetSets: number;
  targetReps: number;
  repsBySet: { [setNumber: number]: number };
}

export default function HistoryDetailScreen() {
  const router = useRouter();
  const { logId } = useLocalSearchParams<{ logId: string }>();

  const [sessionLog, setSessionLog] = useState<SessionLog | null>(null);
  const [session, setSession] = useState<SessionWithExercises | null>(null);
  const [repLogs, setRepLogs] = useState<RepLog[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [exerciseStats, setExerciseStats] = useState<ExerciseStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!logId) return;

      try {
        setIsLoading(true);
        const log = await getSessionLogById(Number(logId));
        if (!log) return;

        const [sessionData, repsData, commentsData] = await Promise.all([
          getSessionWithExercises(log.session_id),
          getRepLogsBySessionLog(Number(logId)),
          getCommentsBySessionLog(Number(logId)),
        ]);

        setSessionLog(log);
        setSession(sessionData);
        setRepLogs(repsData);
        setComments(commentsData);

        // Calculer les statistiques par exercice
        if (sessionData) {
          const stats: ExerciseStats[] = sessionData.exercises.map((exercise) => {
            const exerciseReps = repsData.filter((rep) => rep.exercise_id === exercise.id);
            const repsBySet: { [setNumber: number]: number } = {};
            let totalReps = 0;

            exerciseReps.forEach((rep) => {
              repsBySet[rep.set_number] = rep.reps_completed;
              totalReps += rep.reps_completed;
            });

            return {
              exerciseId: exercise.id,
              exerciseName: exercise.name,
              totalSets: exerciseReps.length,
              totalReps,
              targetSets: exercise.sets || 0,
              targetReps: exercise.reps || 0,
              repsBySet,
            };
          });

          setExerciseStats(stats);
        }
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [logId]);

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return 'N/A';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min ${secs}s`;
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: 'Détails de la séance' }} />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={crimson} />
        </View>
      </SafeAreaView>
    );
  }

  if (!sessionLog || !session) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: 'Détails de la séance' }} />
        <View style={styles.centerContainer}>
          <ThemedText>Séance introuvable</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  const isCompleted = sessionLog.status === 'completed';
  const statusIcon = isCompleted ? 'checkmark-circle' : 'close-circle';
  const statusColor = isCompleted ? '#4CAF50' : '#FF9800';
  const statusText = isCompleted ? 'Terminée' : 'Abandonnée';

  const totalSets = exerciseStats.reduce((sum, stat) => sum + stat.totalSets, 0);
  const totalReps = exerciseStats.reduce((sum, stat) => sum + stat.totalReps, 0);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: session.name,
          headerStyle: { backgroundColor: '#000' },
          headerTintColor: '#fff',
        }}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* En-tête avec statut */}
        <View style={styles.statusContainer}>
          <Ionicons name={statusIcon} size={48} color={statusColor} />
          <ThemedText style={[styles.statusText, { color: statusColor }]}>
            {statusText}
          </ThemedText>
          <ThemedText style={styles.dateText}>
            {formatDateTime(sessionLog.start_time)}
          </ThemedText>
        </View>

        {/* Statistiques de la séance */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Résumé</ThemedText>

          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Ionicons name="time" size={24} color={crimson} />
              <ThemedText style={styles.statValue}>
                {formatDuration(sessionLog.total_time)}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Durée totale</ThemedText>
            </View>

            <View style={styles.statBox}>
              <Ionicons name="barbell" size={24} color={crimson} />
              <ThemedText style={styles.statValue}>{exerciseStats.length}</ThemedText>
              <ThemedText style={styles.statLabel}>Exercices</ThemedText>
            </View>

            <View style={styles.statBox}>
              <Ionicons name="fitness" size={24} color={crimson} />
              <ThemedText style={styles.statValue}>{totalSets}</ThemedText>
              <ThemedText style={styles.statLabel}>Séries</ThemedText>
            </View>

            <View style={styles.statBox}>
              <Ionicons name="repeat" size={24} color={crimson} />
              <ThemedText style={styles.statValue}>{totalReps}</ThemedText>
              <ThemedText style={styles.statLabel}>Répétitions</ThemedText>
            </View>
          </View>
        </View>

        {/* Détails des exercices */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Exercices réalisés</ThemedText>

          {exerciseStats.map((stat, index) => {
            const completionRate =
              stat.targetSets > 0 ? (stat.totalSets / stat.targetSets) * 100 : 0;

            return (
              <View key={stat.exerciseId} style={styles.exerciseCard}>
                <View style={styles.exerciseHeader}>
                  <View style={styles.exerciseNumber}>
                    <ThemedText style={styles.exerciseNumberText}>{index + 1}</ThemedText>
                  </View>
                  <View style={styles.exerciseInfo}>
                    <ThemedText style={styles.exerciseName}>{stat.exerciseName}</ThemedText>
                    <ThemedText style={styles.exerciseTarget}>
                      Objectif: {stat.targetSets} × {stat.targetReps} reps
                    </ThemedText>
                  </View>
                  {completionRate >= 100 && (
                    <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                  )}
                </View>

                <View style={styles.setsContainer}>
                  {Object.entries(stat.repsBySet).map(([setNumber, reps]) => (
                    <View key={setNumber} style={styles.setItem}>
                      <ThemedText style={styles.setNumber}>Série {setNumber}</ThemedText>
                      <ThemedText style={styles.setReps}>{reps} reps</ThemedText>
                    </View>
                  ))}
                </View>

                <View style={styles.exerciseSummary}>
                  <ThemedText style={styles.summaryText}>
                    {stat.totalSets} séries • {stat.totalReps} répétitions totales
                  </ThemedText>
                </View>
              </View>
            );
          })}
        </View>

        {/* Commentaires */}
        {comments.length > 0 && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Commentaires</ThemedText>
            {comments.map((comment) => (
              <View key={comment.id} style={styles.commentCard}>
                <Ionicons name="chatbubble-outline" size={20} color={crimson} />
                <ThemedText style={styles.commentText}>{comment.text}</ThemedText>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  statusContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  statusText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 12,
  },
  dateText: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
    textTransform: 'capitalize',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statBox: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
  exerciseCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: crimson,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  exerciseNumberText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  exerciseTarget: {
    fontSize: 12,
    color: '#888',
  },
  setsContainer: {
    marginVertical: 12,
    gap: 8,
  },
  setItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#0a0a0a',
    padding: 12,
    borderRadius: 8,
  },
  setNumber: {
    fontSize: 14,
    color: '#888',
  },
  setReps: {
    fontSize: 14,
    fontWeight: '600',
  },
  exerciseSummary: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  summaryText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
  commentCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
    flexDirection: 'row',
    gap: 12,
  },
  commentText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});
