import { SessionCard } from '@/components/session/SessionCard';
import { ThemedText } from '@/components/themed-text';
import { Badge } from '@/components/ui/badge';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { getProgramById, getSessionsByProgram } from '@/database';
import type { Program, Session } from '@/database/types';
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
 * Page de détail d'un programme
 * Affiche toutes les séances du programme
 */
export default function ProgramDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [program, setProgram] = useState<Program | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadProgramData = useCallback(async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      const programData = await getProgramById(Number(id));
      const sessionsData = await getSessionsByProgram(Number(id));
      
      if (programData) {
        setProgram(programData);
        setSessions(sessionsData);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du programme:', error);
      Alert.alert('Erreur', 'Impossible de charger le programme');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadProgramData();
    setRefreshing(false);
  }, [loadProgramData]);

  useFocusEffect(
    useCallback(() => {
      loadProgramData();
    }, [loadProgramData])
  );

  const handleSessionPress = (session: Session) => {
    router.push(`/session/${session.id}` as any);
  };

  const handleAddSession = () => {
    router.push(`/session/create?programId=${id}` as any);
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'danger';
      default: return 'neutral';
    }
  };

  const getDifficultyLabel = (level: string) => {
    switch (level) {
      case 'beginner': return 'Débutant';
      case 'intermediate': return 'Intermédiaire';
      case 'advanced': return 'Avancé';
      default: return level;
    }
  };

  if (!program) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: 'Chargement...' }} />
        <View style={styles.loadingContainer}>
          <ThemedText>Chargement...</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: program.name,
          headerStyle: { backgroundColor: Colors.dark.background },
          headerTintColor: Colors.dark.text,
          headerShadowVisible: false,
        }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.dark.primary}
          />
        }
      >
        {/* En-tête du programme */}
        <View style={styles.programHeader}>
          <View style={styles.badges}>
            <Badge label={program.type} variant="primary" />
            {program.difficulty_level && (
              <Badge
                label={getDifficultyLabel(program.difficulty_level)}
                variant={getDifficultyColor(program.difficulty_level) as any}
              />
            )}
          </View>

          <ThemedText type="title" style={styles.programTitle}>
            {program.name}
          </ThemedText>

          {program.description && (
            <ThemedText style={styles.programDescription}>
              {program.description}
            </ThemedText>
          )}

          {/* Statistiques du programme */}
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <IconSymbol name="calendar" size={24} color={Colors.dark.primary} />
              <ThemedText style={styles.statValue}>{program.duration_weeks}</ThemedText>
              <ThemedText style={styles.statLabel}>Semaines</ThemedText>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.stat}>
              <IconSymbol name="calendar.badge.clock" size={24} color={Colors.dark.primary} />
              <ThemedText style={styles.statValue}>{program.sessions_per_week}</ThemedText>
              <ThemedText style={styles.statLabel}>Séances/sem</ThemedText>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.stat}>
              <IconSymbol name="list.bullet" size={24} color={Colors.dark.primary} />
              <ThemedText style={styles.statValue}>{sessions.length}</ThemedText>
              <ThemedText style={styles.statLabel}>Total séances</ThemedText>
            </View>
          </View>
        </View>

        {/* Section des séances */}
        <View style={styles.sessionsSection}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Séances du programme
            </ThemedText>
            <TouchableOpacity onPress={handleAddSession}>
              <IconSymbol name="plus.circle.fill" size={28} color={Colors.dark.primary} />
            </TouchableOpacity>
          </View>

          {sessions.length === 0 ? (
            <View style={styles.emptyContainer}>
              <IconSymbol name="figure.walk" size={64} color={Colors.dark.textMuted} />
              <ThemedText style={styles.emptyText}>Aucune séance</ThemedText>
              <ThemedText style={styles.emptySubtext}>
                Ajoutez votre première séance à ce programme
              </ThemedText>
              <TouchableOpacity style={styles.addButton} onPress={handleAddSession}>
                <IconSymbol name="plus" size={20} color={Colors.dark.background} />
                <ThemedText style={styles.addButtonText}>Ajouter une séance</ThemedText>
              </TouchableOpacity>
            </View>
          ) : (
            sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                programType={program.type}
                onPress={() => handleSessionPress(session)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
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
  programHeader: {
    padding: 20,
    backgroundColor: Colors.dark.backgroundCard,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.divider,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  programTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  programDescription: {
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
  sessionsSection: {
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
    textAlign: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.dark.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 24,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.dark.background,
  },
});
