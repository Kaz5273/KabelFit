import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import {
  completeSessionLog,
  abandonSessionLog,
  getSessionWithExercises,
  logRep,
  startSessionLog,
} from '@/database';
import type { SessionWithExercises } from '@/database/types';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Vibration,
} from 'react-native';

interface ExerciseProgress {
  exerciseId: number;
  setsCompleted: number;
  repsPerSet: number[];
}

export default function WorkoutScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [session, setSession] = useState<SessionWithExercises | null>(null);
  const [logId, setLogId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Workout state
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [exerciseProgress, setExerciseProgress] = useState<ExerciseProgress[]>([]);

  // Timer state
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const elapsedTimerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<string>('');

  const currentExercise = session?.exercises[currentExerciseIndex];
  const totalExercises = session?.exercises.length || 0;
  const totalSets = currentExercise?.sets || 3;

  // Sound refs
  const countdownSoundRef = useRef<Audio.Sound | null>(null);
  const suiiSoundRef = useRef<Audio.Sound | null>(null);
  const countdownStartedRef = useRef<boolean>(false);

  // Play countdown sound (starts at 11 seconds remaining)
  const playCountdown = useCallback(async () => {
    try {
      if (countdownSoundRef.current) {
        await countdownSoundRef.current.unloadAsync();
      }
      const { sound } = await Audio.Sound.createAsync(
        require('@/assets/sounds/countdown.mp3'),
        { shouldPlay: true, volume: 1.0 }
      );
      countdownSoundRef.current = sound;
    } catch (error) {
      console.log('Erreur audio countdown:', error);
    }
  }, []);

  // Play suiii sound at the end
  const playSuiii = useCallback(async () => {
    try {
      // Stop countdown if playing
      if (countdownSoundRef.current) {
        await countdownSoundRef.current.stopAsync();
        await countdownSoundRef.current.unloadAsync();
        countdownSoundRef.current = null;
      }
      const { sound } = await Audio.Sound.createAsync(
        require('@/assets/sounds/suiii.mp3'),
        { shouldPlay: true, volume: 1.0 }
      );
      suiiSoundRef.current = sound;
      // Unload after playing
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
          suiiSoundRef.current = null;
        }
      });
    } catch (error) {
      console.log('Erreur audio suiii:', error);
      Vibration.vibrate([0, 500, 200, 500]);
    }
  }, []);

  // Stop all sounds
  const stopAllSounds = useCallback(async () => {
    if (countdownSoundRef.current) {
      await countdownSoundRef.current.stopAsync();
      await countdownSoundRef.current.unloadAsync();
      countdownSoundRef.current = null;
    }
    if (suiiSoundRef.current) {
      await suiiSoundRef.current.stopAsync();
      await suiiSoundRef.current.unloadAsync();
      suiiSoundRef.current = null;
    }
  }, []);

  // Initialize session
  useEffect(() => {
    const initWorkout = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const sessionData = await getSessionWithExercises(Number(id));

        if (sessionData && sessionData.exercises.length > 0) {
          setSession(sessionData);

          // Initialize progress tracking
          const initialProgress: ExerciseProgress[] = sessionData.exercises.map((ex) => ({
            exerciseId: ex.id,
            setsCompleted: 0,
            repsPerSet: [],
          }));
          setExerciseProgress(initialProgress);

          // Start session log
          const now = new Date().toISOString();
          startTimeRef.current = now;
          const newLogId = await startSessionLog({
            session_id: sessionData.id,
            start_time: now,
          });
          setLogId(newLogId);

          // Start elapsed time counter
          elapsedTimerRef.current = setInterval(() => {
            setElapsedTime((prev) => prev + 1);
          }, 1000);
        } else {
          Alert.alert('Erreur', 'Aucun exercice dans cette séance', [
            { text: 'OK', onPress: () => router.back() },
          ]);
        }
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
        Alert.alert('Erreur', 'Impossible de charger la séance');
      } finally {
        setIsLoading(false);
      }
    };

    initWorkout();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current);
    };
  }, [id]);

  // Rest timer with countdown sound
  useEffect(() => {
    if (isResting && restTime > 0) {
      countdownStartedRef.current = false;

      timerRef.current = setInterval(() => {
        setRestTime((prev) => {
          // Start countdown at 11 seconds
          if (prev === 12 && !countdownStartedRef.current) {
            countdownStartedRef.current = true;
            playCountdown();
          }

          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsResting(false);
            countdownStartedRef.current = false;
            playSuiii();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isResting, playCountdown, playSuiii]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCompleteSet = useCallback(async () => {
    if (!currentExercise || !logId) return;

    const reps = currentExercise.reps || 10;

    // Log the rep
    await logRep({
      log_id: logId,
      exercise_id: currentExercise.id,
      set_number: currentSet,
      reps_completed: reps,
    });

    // Update progress
    setExerciseProgress((prev) =>
      prev.map((p) =>
        p.exerciseId === currentExercise.id
          ? {
              ...p,
              setsCompleted: p.setsCompleted + 1,
              repsPerSet: [...p.repsPerSet, reps],
            }
          : p
      )
    );

    // Check if exercise is complete
    if (currentSet >= totalSets) {
      // Move to next exercise
      if (currentExerciseIndex < totalExercises - 1) {
        setCurrentExerciseIndex((prev) => prev + 1);
        setCurrentSet(1);
        // Start rest timer before next exercise
        const restMinutes = currentExercise.rest_minutes || 1;
        setRestTime(Math.round(restMinutes * 60));
        setIsResting(true);
      } else {
        // Workout complete
        handleFinishWorkout();
      }
    } else {
      // Start rest timer
      const restMinutes = currentExercise.rest_minutes || 1;
      setRestTime(Math.round(restMinutes * 60));
      setIsResting(true);
      setCurrentSet((prev) => prev + 1);
    }
  }, [currentExercise, currentSet, totalSets, currentExerciseIndex, totalExercises, logId]);

  const handleSkipRest = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    stopAllSounds();
    setRestTime(0);
    setIsResting(false);
  };

  const handleSkipExercise = () => {
    stopAllSounds();
    if (currentExerciseIndex < totalExercises - 1) {
      setCurrentExerciseIndex((prev) => prev + 1);
      setCurrentSet(1);
      setIsResting(false);
      setRestTime(0);
    } else {
      handleFinishWorkout();
    }
  };

  const handleFinishWorkout = async () => {
    if (!logId) return;

    try {
      stopAllSounds();
      const endTime = new Date().toISOString();
      await completeSessionLog(logId, endTime, elapsedTime);

      if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current);

      // Navigate to summary page
      router.replace(`/session/${id}/summary?logId=${logId}` as any);
    } catch (error) {
      console.error('Erreur lors de la fin de séance:', error);
      Alert.alert('Erreur', 'Impossible de terminer la séance');
    }
  };

  const handleAbandonWorkout = () => {
    Alert.alert(
      'Abandonner la séance ?',
      'Votre progression sera enregistrée.',
      [
        { text: 'Continuer', style: 'cancel' },
        {
          text: 'Abandonner',
          style: 'destructive',
          onPress: async () => {
            stopAllSounds();
            if (logId) {
              const endTime = new Date().toISOString();
              await abandonSessionLog(logId, endTime);
            }
            if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current);
            router.back();
          },
        },
      ]
    );
  };

  const getProgressPercentage = () => {
    if (!session) return 0;
    const totalSetsAll = session.exercises.reduce((sum, ex) => sum + (ex.sets || 3), 0);
    const completedSets = exerciseProgress.reduce((sum, p) => sum + p.setsCompleted, 0);
    return Math.round((completedSets / totalSetsAll) * 100);
  };

  if (isLoading || !session || !currentExercise) {
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen
        options={{
          title: session.name,
          headerShown: true,
          headerStyle: { backgroundColor: Colors.dark.background },
          headerTintColor: Colors.dark.text,
          headerLeft: () => (
            <TouchableOpacity onPress={handleAbandonWorkout} style={styles.headerButton}>
              <Ionicons name="close" size={24} color={Colors.dark.text} />
            </TouchableOpacity>
          ),
        }}
      />
      <ThemedView style={styles.container}>
        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <ThemedText style={styles.progressText}>
              Progression: {getProgressPercentage()}%
            </ThemedText>
            <ThemedText style={styles.timerText}>{formatTime(elapsedTime)}</ThemedText>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${getProgressPercentage()}%` }]}
            />
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Exercise counter */}
          <View style={styles.exerciseCounter}>
            <ThemedText style={styles.exerciseCounterText}>
              Exercice {currentExerciseIndex + 1} / {totalExercises}
            </ThemedText>
          </View>

          {/* Current exercise card */}
          <View style={styles.exerciseCard}>
            <ThemedText type="title" style={styles.exerciseName}>
              {currentExercise.name}
            </ThemedText>

            {currentExercise.muscle_group && (
              <ThemedText style={styles.muscleGroup}>
                {currentExercise.muscle_group}
              </ThemedText>
            )}

            {currentExercise.description && (
              <ThemedText style={styles.exerciseDescription}>
                {currentExercise.description}
              </ThemedText>
            )}

            {/* Set progress */}
            <View style={styles.setsContainer}>
              <ThemedText style={styles.setsTitle}>Séries</ThemedText>
              <View style={styles.setsRow}>
                {Array.from({ length: totalSets }).map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.setIndicator,
                      index < currentSet - 1 && styles.setCompleted,
                      index === currentSet - 1 && !isResting && styles.setCurrent,
                    ]}
                  >
                    <ThemedText
                      style={[
                        styles.setNumber,
                        index < currentSet - 1 && styles.setNumberCompleted,
                      ]}
                    >
                      {index + 1}
                    </ThemedText>
                  </View>
                ))}
              </View>
            </View>

            {/* Reps info */}
            <View style={styles.repsInfo}>
              <View style={styles.repsStat}>
                <ThemedText style={styles.repsValue}>
                  {currentExercise.reps || 10}
                </ThemedText>
                <ThemedText style={styles.repsLabel}>répétitions</ThemedText>
              </View>
            </View>
          </View>

          {/* Rest timer overlay */}
          {isResting && (
            <View style={styles.restOverlay}>
              <ThemedText style={styles.restTitle}>Repos</ThemedText>
              <ThemedText style={styles.restTimer}>{formatTime(restTime)}</ThemedText>

              {/* Boutons pendant le repos */}
              <View style={styles.restActions}>
                <TouchableOpacity
                  style={styles.restActionButton}
                  onPress={handleSkipExercise}
                >
                  <Ionicons name="play-skip-forward" size={20} color={Colors.dark.background} />
                  <ThemedText style={styles.restActionText}>Passer la série</ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.restActionButton}
                  onPress={handleSkipRest}
                >
                  <Ionicons name="timer-outline" size={20} color={Colors.dark.background} />
                  <ThemedText style={styles.restActionText}>Skip repos</ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.restActionButton, styles.restFinishButton]}
                  onPress={handleFinishWorkout}
                >
                  <Ionicons name="flag" size={20} color={Colors.dark.primary} />
                  <ThemedText style={styles.restFinishText}>Fin de séance</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Action buttons - seulement quand pas en repos */}
        {!isResting && (
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.completeButton}
              onPress={handleCompleteSet}
            >
              <Ionicons name="checkmark-circle" size={28} color={Colors.dark.background} />
              <ThemedText style={styles.completeButtonText}>
                Série {currentSet} terminée
              </ThemedText>
            </TouchableOpacity>

            <View style={styles.secondaryActions}>
              <TouchableOpacity
                style={styles.skipButton}
                onPress={handleSkipExercise}
              >
                <Ionicons name="play-skip-forward" size={20} color={Colors.dark.text} />
                <ThemedText style={styles.skipButtonText}>Passer</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.finishButton}
                onPress={handleFinishWorkout}
              >
                <Ionicons name="flag" size={20} color={Colors.dark.primary} />
                <ThemedText style={styles.finishButtonText}>Terminer</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
  headerButton: {
    padding: 8,
  },
  progressContainer: {
    padding: 16,
    backgroundColor: Colors.dark.backgroundCard,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
  timerText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.dark.primary,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.dark.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.dark.primary,
    borderRadius: 3,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 24,
  },
  exerciseCounter: {
    alignItems: 'center',
    marginBottom: 16,
  },
  exerciseCounterText: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  exerciseCard: {
    backgroundColor: Colors.dark.backgroundCard,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  exerciseName: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  muscleGroup: {
    fontSize: 14,
    color: Colors.dark.primary,
    textAlign: 'center',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  exerciseDescription: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  setsContainer: {
    marginBottom: 24,
  },
  setsTitle: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  setsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  setIndicator: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.dark.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.dark.border,
  },
  setCompleted: {
    backgroundColor: Colors.dark.primary,
    borderColor: Colors.dark.primary,
  },
  setCurrent: {
    borderColor: Colors.dark.primary,
    borderWidth: 3,
  },
  setNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.textSecondary,
  },
  setNumberCompleted: {
    color: Colors.dark.background,
  },
  repsInfo: {
    alignItems: 'center',
  },
  repsStat: {
    alignItems: 'center',
    gap: 4,
  },
  repsValue: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.dark.text,
    lineHeight: 40,
  },
  repsLabel: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
  restOverlay: {
    marginTop: 24,
    backgroundColor: Colors.dark.primary,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
  },
  restTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark.background,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  restTimer: {
    fontSize: 64,
    fontWeight: '700',
    color: Colors.dark.background,
    marginBottom: 24,
    lineHeight: 76,
  },
  restActions: {
    width: '100%',
    gap: 10,
  },
  restActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
  },
  restActionText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.background,
  },
  restFinishButton: {
    backgroundColor: Colors.dark.background,
  },
  restFinishText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.primary,
  },
  actionsContainer: {
    padding: 20,
    paddingBottom: 32,
    gap: 12,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: Colors.dark.primary,
    paddingVertical: 18,
    borderRadius: 12,
  },
  completeButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.dark.background,
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 12,
  },
  skipButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    backgroundColor: Colors.dark.backgroundCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  skipButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.dark.text,
  },
  finishButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    backgroundColor: Colors.dark.backgroundCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.dark.primary,
  },
  finishButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.dark.primary,
  },
});
