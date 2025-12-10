import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { getGlobalStats, getSessionLogsWithStats } from '@/database';
import type { SessionLogWithStats } from '@/database/types';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

const crimson = Colors.dark.primary;

export default function HistoryScreen() {
  const router = useRouter();
  const [sessionLogs, setSessionLogs] = useState<SessionLogWithStats[]>([]);
  const [globalStats, setGlobalStats] = useState<{
    total_sessions: number;
    completed_sessions: number;
    total_time: number;
    total_reps: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'completed' | 'abandoned'>('all');

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [logs, stats] = await Promise.all([
        getSessionLogsWithStats(100),
        getGlobalStats(),
      ]);
      setSessionLogs(logs);
      setGlobalStats(stats);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const filteredLogs = sessionLogs.filter((log) => {
    if (filter === 'all') return true;
    return log.status === filter;
  });

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return 'N/A';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;

    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <ThemedText style={styles.title}>Historique</ThemedText>

      {/* Statistiques globales */}
      {globalStats && (
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="fitness" size={24} color={crimson} />
            <ThemedText style={styles.statValue}>{globalStats.completed_sessions}</ThemedText>
            <ThemedText style={styles.statLabel}>Séances</ThemedText>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="time" size={24} color={crimson} />
            <ThemedText style={styles.statValue}>
              {formatDuration(globalStats.total_time)}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Temps total</ThemedText>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="barbell" size={24} color={crimson} />
            <ThemedText style={styles.statValue}>{globalStats.total_reps || 0}</ThemedText>
            <ThemedText style={styles.statLabel}>Répétitions</ThemedText>
          </View>
        </View>
      )}

      {/* Filtres */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
          onPress={() => setFilter('all')}
        >
          <ThemedText
            style={[styles.filterText, filter === 'all' && styles.filterTextActive]}
          >
            Toutes
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, filter === 'completed' && styles.filterButtonActive]}
          onPress={() => setFilter('completed')}
        >
          <ThemedText
            style={[styles.filterText, filter === 'completed' && styles.filterTextActive]}
          >
            Terminées
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, filter === 'abandoned' && styles.filterButtonActive]}
          onPress={() => setFilter('abandoned')}
        >
          <ThemedText
            style={[styles.filterText, filter === 'abandoned' && styles.filterTextActive]}
          >
            Abandonnées
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSessionLog = ({ item }: { item: SessionLogWithStats }) => {
    const isCompleted = item.status === 'completed';
    const statusIcon = isCompleted ? 'checkmark-circle' : 'close-circle';
    const statusColor = isCompleted ? '#4CAF50' : '#FF9800';

    return (
      <TouchableOpacity
        style={styles.sessionCard}
        onPress={() => router.push(`/history/${item.id}` as any)}
      >
        <View style={styles.sessionCardHeader}>
          <View style={styles.sessionCardLeft}>
            <Ionicons
              name={statusIcon}
              size={24}
              color={statusColor}
              style={styles.statusIcon}
            />
            <View>
              <ThemedText style={styles.sessionName}>{item.session.name}</ThemedText>
              <ThemedText style={styles.sessionDate}>
                {formatDate(item.start_time)}
              </ThemedText>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </View>

        <View style={styles.sessionStats}>
          <View style={styles.sessionStatItem}>
            <Ionicons name="time-outline" size={16} color="#888" />
            <ThemedText style={styles.sessionStatText}>
              {formatDuration(item.total_time)}
            </ThemedText>
          </View>

          <View style={styles.sessionStatItem}>
            <Ionicons name="barbell-outline" size={16} color="#888" />
            <ThemedText style={styles.sessionStatText}>
              {item.exercises_count} exercices
            </ThemedText>
          </View>

          <View style={styles.sessionStatItem}>
            <Ionicons name="fitness-outline" size={16} color="#888" />
            <ThemedText style={styles.sessionStatText}>
              {item.total_sets} séries
            </ThemedText>
          </View>

          <View style={styles.sessionStatItem}>
            <Ionicons name="repeat-outline" size={16} color="#888" />
            <ThemedText style={styles.sessionStatText}>
              {item.total_reps} reps
            </ThemedText>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={crimson} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredLogs}
        renderItem={renderSessionLog}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={64} color="#666" />
            <ThemedText style={styles.emptyText}>Aucune séance enregistrée</ThemedText>
            <ThemedText style={styles.emptySubtext}>
              Vos séances d'entraînement apparaîtront ici
            </ThemedText>
          </View>
        }
      />
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
  listContent: {
    paddingBottom: 20,
  },
  header: {
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: crimson,
    borderColor: crimson,
  },
  filterText: {
    fontSize: 14,
    color: '#888',
  },
  filterTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  sessionCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  sessionCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sessionCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusIcon: {
    marginRight: 12,
  },
  sessionName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  sessionDate: {
    fontSize: 12,
    color: '#888',
  },
  sessionStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  sessionStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sessionStatText: {
    fontSize: 12,
    color: '#888',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888',
  },
});
