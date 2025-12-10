import { ExerciseCard } from '@/components/session/ExerciseCard';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Badge } from '@/components/ui/badge';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { deleteExercise, deleteSession, getProgramById, getSessionWithExercises } from '@/database';
import type { Exercise, Program, SessionWithExercises } from '@/database/types';
import { useFocusEffect } from '@react-navigation/native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Alert,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

/**
 * Page de détail d'une séance
 * Affiche tous les exercices, paramètres et actions possibles
 */
export default function SessionDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [session, setSession] = useState<SessionWithExercises | null>(null);
  const [program, setProgram] = useState<Program | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadSessionData = useCallback(async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      const sessionData = await getSessionWithExercises(Number(id));
      
      if (sessionData) {
        setSession(sessionData);
        
        // Charger le programme pour obtenir son type
        const programData = await getProgramById(sessionData.program_id);
        setProgram(programData);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la séance:', error);
      Alert.alert('Erreur', 'Impossible de charger la séance');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadSessionData();
    setRefreshing(false);
  }, [loadSessionData]);

  // Recharger les données quand la page redevient active (après retour)
  useFocusEffect(
    useCallback(() => {
      loadSessionData();
    }, [loadSessionData])
  );

  const handleStartSession = () => {
    router.push(`/session/${id}/workout` as any);
  };

  const handleEditSession = () => {
    router.push(`/session/${id}/edit` as any);
  };

  const handleDeleteSession = () => {
    Alert.alert(
      'Supprimer la séance',
      'Voulez-vous vraiment supprimer cette séance et tous ses exercices ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteSession(Number(id));
              Alert.alert('Succès', 'Séance supprimée', [
                {
                  text: 'OK',
                  onPress: () => router.replace('/(tabs)/sessions' as any),
                },
              ]);
            } catch (error) {
              console.error('Erreur lors de la suppression:', error);
              Alert.alert('Erreur', 'Impossible de supprimer la séance');
            }
          },
        },
      ]
    );
  };

  const handleAddExercise = () => {
    router.push(`/session/${id}/add-exercise` as any);
  };

  const handleEditExercise = (exercise: Exercise) => {
    router.push(`/exercise/${exercise.id}/edit` as any);
  };

  const handleDeleteExercise = async (exercise: Exercise) => {
    try {
      await deleteExercise(exercise.id);
      Alert.alert('Succès', 'Exercice supprimé');
      await loadSessionData(); // Recharger la séance
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      Alert.alert('Erreur', 'Impossible de supprimer l\'exercice');
    }
  };

  const formatDay = (dayOfWeek: string | null) => {
    if (!dayOfWeek) return null;
    const days: { [key: string]: string } = {
      Monday: 'Lundi',
      Tuesday: 'Mardi',
      Wednesday: 'Mercredi',
      Thursday: 'Jeudi',
      Friday: 'Vendredi',
      Saturday: 'Samedi',
      Sunday: 'Dimanche',
    };
    return days[dayOfWeek] || dayOfWeek;
  };

  const getTypeColor = (type: string) => {
    switch (type?.toUpperCase()) {
      case 'HIIT':
        return 'primary';
      case 'STRENGTH':
        return 'success';
      case 'CARDIO':
        return 'warning';
      case 'YOGA':
        return 'neutral';
      default:
        return 'neutral';
    }
  };

  if (isLoading || !session) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Stack.Screen
          options={{
            title: 'Chargement...',
            headerShown: true,
            headerStyle: { backgroundColor: Colors.dark.background },
            headerTintColor: Colors.dark.text,
          }}
        />
        <ThemedView style={styles.container}>
          <View style={styles.loadingContainer}>
            <ThemedText>Chargement...</ThemedText>
          </View>
        </ThemedView>
      </SafeAreaView>
    );
  }

  const totalSets = session.exercises.reduce((sum, ex) => sum + (ex.sets || 0), 0);
  const totalReps = session.exercises.reduce((sum, ex) => sum + (ex.reps || 0), 0);
  const avgRestTime = session.exercises.length > 0
    ? session.exercises.reduce((sum, ex) => sum + (ex.rest_minutes || 0), 0) / session.exercises.length
    : 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen
        options={{
          title: session.name,
          headerShown: true,
          headerStyle: { backgroundColor: Colors.dark.background },
          headerTintColor: Colors.dark.text,
          headerTitleStyle: { fontWeight: '700' },
        }}
      />
      <ThemedView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.dark.primary}
            />
          }
        >
          {/* En-tête avec infos principales */}
          <View style={styles.sessionHeader}>
            <View style={styles.sessionHeaderTop}>
              <View style={styles.badges}>
                {program && (
                  <Badge label={program.type} variant={getTypeColor(program.type) as any} />
                )}
                {session.day_of_week && (
                  <Badge label={formatDay(session.day_of_week) || ''} variant="neutral" />
                )}
              </View>
            </View>

            <ThemedText type="title" style={styles.sessionTitle}>
              {session.name}
            </ThemedText>

            {session.description && (
              <ThemedText style={styles.sessionDescription}>
                {session.description}
              </ThemedText>
            )}

            {/* Paramètres principaux */}
            <View style={styles.statsContainer}>
              <View style={styles.stat}>
                <IconSymbol name="clock" size={24} color={Colors.dark.primary} />
                <ThemedText style={styles.statValue}>{session.duration_minutes}</ThemedText>
                <ThemedText style={styles.statLabel}>Minutes</ThemedText>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.stat}>
                <IconSymbol name="square.stack.3d.up" size={24} color={Colors.dark.primary} />
                <ThemedText style={styles.statValue}>{totalSets}</ThemedText>
                <ThemedText style={styles.statLabel}>Séries</ThemedText>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.stat}>
                <IconSymbol name="arrow.clockwise" size={24} color={Colors.dark.primary} />
                <ThemedText style={styles.statValue}>{totalReps}</ThemedText>
                <ThemedText style={styles.statLabel}>Reps</ThemedText>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.stat}>
                <IconSymbol name="timer" size={24} color={Colors.dark.primary} />
                <ThemedText style={styles.statValue}>
                  {avgRestTime < 1 ? `${Math.round(avgRestTime * 60)}s` : `${avgRestTime.toFixed(1)}min`}
                </ThemedText>
                <ThemedText style={styles.statLabel}>Repos moy.</ThemedText>
              </View>
            </View>
          </View>

          {/* Actions principales */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.primaryButton]}
              onPress={handleStartSession}
            >
              <IconSymbol name="play.fill" size={20} color={Colors.dark.background} />
              <ThemedText style={styles.primaryButtonText}>LANCER LA SÉANCE</ThemedText>
            </TouchableOpacity>

            <View style={styles.secondaryActions}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleEditSession}
              >
                <IconSymbol name="pencil" size={20} color={Colors.dark.text} />
                <ThemedText style={styles.secondaryButtonText}>Modifier</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleAddExercise}
              >
                <IconSymbol name="plus" size={20} color={Colors.dark.text} />
                <ThemedText style={styles.secondaryButtonText}>Ajouter exercice</ThemedText>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.actionButton, styles.deleteSessionButton]}
              onPress={handleDeleteSession}
            >
              <IconSymbol name="trash" size={20} color={Colors.dark.error} />
              <ThemedText style={styles.deleteSessionButtonText}>Supprimer la séance</ThemedText>
            </TouchableOpacity>
          </View>

          {/* Liste des exercices */}
          <View style={styles.exercisesSection}>
            <View style={styles.sectionHeader}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Exercices ({session.exercises.length})
              </ThemedText>
            </View>

            {session.exercises.length === 0 ? (
              <View style={styles.emptyContainer}>
                <IconSymbol name="figure.strengthtraining.traditional" size={64} color={Colors.dark.textMuted} />
                <ThemedText style={styles.emptyText}>Aucun exercice</ThemedText>
                <ThemedText style={styles.emptySubtext}>
                  Ajoutez des exercices à cette séance
                </ThemedText>
              </View>
            ) : (
              session.exercises.map((exercise, index) => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  index={index}
                  showActions={true}
                  onEdit={handleEditExercise}
                  onDelete={handleDeleteExercise}
                />
              ))
            )}
          </View>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  sessionHeader: {
    padding: 20,
    backgroundColor: Colors.dark.backgroundCard,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.divider,
  },
  sessionHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
  },
  sessionTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  sessionDescription: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    backgroundColor: Colors.dark.background,
    borderRadius: 12,
  },
  stat: {
    alignItems: 'center',
    gap: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.dark.divider,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.dark.text,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.dark.textSecondary,
    textTransform: 'uppercase',
  },
  actionsContainer: {
    padding: 20,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
  },
  primaryButton: {
    backgroundColor: Colors.dark.primary,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.dark.background,
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.dark.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.dark.text,
  },
  deleteSessionButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.dark.error,
  },
  deleteSessionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.dark.error,
  },
  exercisesSection: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.textMuted,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.dark.textMuted,
    marginTop: 4,
  },
});
