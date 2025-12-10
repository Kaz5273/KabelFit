import { SessionCard } from '@/components/session/SessionCard';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { getAllPrograms, getAllSessions } from '@/database';
import type { Session } from '@/database/types';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

type SessionWithProgram = Session & { programType?: string };

/**
 * Page principale des séances d'entraînement
 * Inspiré du design ProgramSelector, adapté pour React Native
 * Affiche toutes les séances avec possibilité de filtrer
 */
export default function SessionsScreen() {
  const router = useRouter();
  const [sessions, setSessions] = useState<SessionWithProgram[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<SessionWithProgram[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday'>('all');

  const loadSessions = useCallback(async () => {
    try {
      setIsLoading(true);
      const allSessions = await getAllSessions();
      const allPrograms = await getAllPrograms();
      
      // Enrichir les sessions avec le type du programme
      const sessionsWithProgram: SessionWithProgram[] = allSessions.map(session => {
        const program = allPrograms.find(p => p.id === session.program_id);
        return {
          ...session,
          programType: program?.type || 'Other'
        };
      });
      
      setSessions(sessionsWithProgram);
      applyFilter(sessionsWithProgram, filter);
    } catch (error) {
      console.error('Erreur lors du chargement des séances:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadSessions();
    setRefreshing(false);
  }, [loadSessions]);

  const applyFilter = (sessionsList: SessionWithProgram[], filterType: typeof filter) => {
    let filtered = [...sessionsList];

    if (filterType !== 'all') {
      // Filtrer par jour de la semaine
      const dayMap: { [key: string]: string } = {
        'monday': 'Monday',
        'tuesday': 'Tuesday', 
        'wednesday': 'Wednesday',
        'thursday': 'Thursday',
        'friday': 'Friday'
      };
      
      filtered = filtered.filter(
        (s) => s.day_of_week?.toLowerCase() === dayMap[filterType]?.toLowerCase()
      );
    }

    setFilteredSessions(filtered);
  };

  const handleFilterChange = (newFilter: typeof filter) => {
    setFilter(newFilter);
    applyFilter(sessions, newFilter);
  };

  const handleSessionPress = (session: Session) => {
    // Navigation vers le détail de la séance
    router.push(`/session/${session.id}` as any);
  };

  const handleCreateSession = () => {
    // Navigation vers la page de création de séance
    router.push('/session/create' as any);
  };

  useEffect(() => {
    loadSessions();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <ThemedText type="title" style={styles.title}>
              SÉANCES
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Sélectionnez votre entraînement
            </ThemedText>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleCreateSession}
          >
            <IconSymbol name="plus" size={24} color={Colors.dark.text} />
          </TouchableOpacity>
        </View>

        {/* Filtres */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersContent}
        >
          <TouchableOpacity
            style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
            onPress={() => handleFilterChange('all')}
          >
            <ThemedText
              style={[
                styles.filterText,
                filter === 'all' && styles.filterTextActive,
              ]}
            >
              Toutes
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterButton, filter === 'monday' && styles.filterButtonActive]}
            onPress={() => handleFilterChange('monday')}
          >
            <ThemedText
              style={[
                styles.filterText,
                filter === 'monday' && styles.filterTextActive,
              ]}
            >
              Lundi
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterButton, filter === 'tuesday' && styles.filterButtonActive]}
            onPress={() => handleFilterChange('tuesday')}
          >
            <ThemedText
              style={[
                styles.filterText,
                filter === 'tuesday' && styles.filterTextActive,
              ]}
            >
              Mardi
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterButton, filter === 'wednesday' && styles.filterButtonActive]}
            onPress={() => handleFilterChange('wednesday')}
          >
            <ThemedText
              style={[
                styles.filterText,
                filter === 'wednesday' && styles.filterTextActive,
              ]}
            >
              Mercredi
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterButton, filter === 'thursday' && styles.filterButtonActive]}
            onPress={() => handleFilterChange('thursday')}
          >
            <ThemedText
              style={[
                styles.filterText,
                filter === 'thursday' && styles.filterTextActive,
              ]}
            >
              Jeudi
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterButton, filter === 'friday' && styles.filterButtonActive]}
            onPress={() => handleFilterChange('friday')}
          >
            <ThemedText
              style={[
                styles.filterText,
                filter === 'friday' && styles.filterTextActive,
              ]}
            >
              Vendredi
            </ThemedText>
          </TouchableOpacity>
        </ScrollView>

        {/* Liste des séances */}
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
          {isLoading ? (
            <View style={styles.emptyContainer}>
              <ThemedText style={styles.emptyText}>Chargement...</ThemedText>
            </View>
          ) : filteredSessions.length === 0 ? (
            <View style={styles.emptyContainer}>
              <IconSymbol name="calendar" size={64} color={Colors.dark.textMuted} />
              <ThemedText style={styles.emptyText}>Aucune séance</ThemedText>
              <ThemedText style={styles.emptySubtext}>
                Créez votre première séance d'entraînement
              </ThemedText>
              <TouchableOpacity
                style={styles.createButton}
                onPress={handleCreateSession}
              >
                <ThemedText style={styles.createButtonText}>
                  Créer une séance
                </ThemedText>
              </TouchableOpacity>
            </View>
          ) : (
            filteredSessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                programType={session.programType}
                onPress={handleSessionPress}
              />
            ))
          )}
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.divider,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    letterSpacing: 2,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.dark.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtersContainer: {
    maxHeight: 60,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.divider,
  },
  filtersContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    backgroundColor: Colors.dark.backgroundCard,
  },
  filterButtonActive: {
    backgroundColor: Colors.dark.primary,
    borderColor: Colors.dark.primary,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.dark.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  filterTextActive: {
    color: Colors.dark.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
    gap: 12,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark.textSecondary,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.dark.textMuted,
    textAlign: 'center',
  },
  createButton: {
    marginTop: 20,
    backgroundColor: Colors.dark.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  createButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.dark.text,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
