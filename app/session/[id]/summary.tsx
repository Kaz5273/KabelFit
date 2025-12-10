import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { addComment, getSessionLogById, getRepLogsBySessionLog, getSessionWithExercises } from '@/database';
import type { RepLog, SessionLog, SessionWithExercises } from '@/database/types';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function SummaryScreen() {
  const router = useRouter();
  const { id, logId } = useLocalSearchParams<{ id: string; logId: string }>();

  const [session, setSession] = useState<SessionWithExercises | null>(null);
  const [sessionLog, setSessionLog] = useState<SessionLog | null>(null);
  const [repLogs, setRepLogs] = useState<RepLog[]>([]);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!id || !logId) return;

      try {
        setIsLoading(true);
        const [sessionData, logData, repsData] = await Promise.all([
          getSessionWithExercises(Number(id)),
          getSessionLogById(Number(logId)),
          getRepLogsBySessionLog(Number(logId)),
        ]);

        setSession(sessionData);
        setSessionLog(logData);
        setRepLogs(repsData);
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id, logId]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    if (mins < 60) {
      return `${mins} min`;
    }
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return `${hours}h ${remainingMins}min`;
  };

  const handleSaveAndClose = async () => {
    try {
      setIsSaving(true);

      // Save comment if provided
      if (comment.trim() && logId) {
        await addComment({
          log_id: Number(logId),
          text: comment.trim(),
        });
      }

      router.replace('/(tabs)/sessions' as any);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      Alert.alert('Erreur', 'Impossible de sauvegarder le commentaire');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    router.replace('/(tabs)/sessions' as any);
  };

  // Calculate stats
  const totalSets = repLogs.length;
  const totalReps = repLogs.reduce((sum, log) => sum + log.reps_completed, 0);
  const exercisesCompleted = new Set(repLogs.map((log) => log.exercise_id)).size;
  const duration = sessionLog?.total_time || 0;

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Stack.Screen
          options={{
            title: 'Chargement...',
            headerShown: false,
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
          headerShown: false,
        }}
      />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ThemedView style={styles.container}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Success Icon */}
            <View style={styles.successContainer}>
              <View style={styles.successIcon}>
                <Ionicons name="checkmark-circle" size={80} color={Colors.dark.primary} />
              </View>
              <ThemedText type="title" style={styles.successTitle}>
                Séance terminée !
              </ThemedText>
              <ThemedText style={styles.successSubtitle}>
                Bravo, tu as terminé ta séance
              </ThemedText>
            </View>

            {/* Session Info */}
            {session && (
              <View style={styles.sessionInfo}>
                <ThemedText style={styles.sessionName}>{session.name}</ThemedText>
              </View>
            )}

            {/* Comment Section */}
            <View style={styles.commentSection}>
              <ThemedText style={styles.commentLabel}>
                Comment ça s'est passé ?
              </ThemedText>
              <TextInput
                style={styles.commentInput}
                placeholder="Ajoute un commentaire (optionnel)..."
                placeholderTextColor={Colors.dark.textMuted}
                value={comment}
                onChangeText={setComment}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Stats Grid */}
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Ionicons name="time-outline" size={28} color={Colors.dark.primary} />
                <ThemedText style={styles.statValue}>{formatDuration(duration)}</ThemedText>
                <ThemedText style={styles.statLabel}>Durée</ThemedText>
              </View>

              <View style={styles.statCard}>
                <Ionicons name="fitness-outline" size={28} color={Colors.dark.primary} />
                <ThemedText style={styles.statValue}>{exercisesCompleted}</ThemedText>
                <ThemedText style={styles.statLabel}>Exercices</ThemedText>
              </View>

              <View style={styles.statCard}>
                <Ionicons name="layers-outline" size={28} color={Colors.dark.primary} />
                <ThemedText style={styles.statValue}>{totalSets}</ThemedText>
                <ThemedText style={styles.statLabel}>Séries</ThemedText>
              </View>

              <View style={styles.statCard}>
                <Ionicons name="repeat-outline" size={28} color={Colors.dark.primary} />
                <ThemedText style={styles.statValue}>{totalReps}</ThemedText>
                <ThemedText style={styles.statLabel}>Répétitions</ThemedText>
              </View>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleSaveAndClose}
              disabled={isSaving}
            >
              <ThemedText style={styles.primaryButtonText}>
                {isSaving ? 'Enregistrement...' : 'Terminer'}
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleClose}
              disabled={isSaving}
            >
              <ThemedText style={styles.secondaryButtonText}>
                Fermer sans commentaire
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </KeyboardAvoidingView>
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
    padding: 24,
    paddingBottom: 24,
  },
  successContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  successIcon: {
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
  },
  sessionInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  sessionName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark.primary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.dark.backgroundCard,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.dark.text,
    marginTop: 8,
    lineHeight: 30,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  commentSection: {
    marginBottom: 24,
  },
  commentLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: 12,
  },
  commentInput: {
    backgroundColor: Colors.dark.backgroundCard,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.dark.text,
    minHeight: 120,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  actionsContainer: {
    padding: 20,
    paddingBottom: 32,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: Colors.dark.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.dark.background,
  },
  secondaryButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
});
