import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { router, useFocusEffect } from 'expo-router';
import { ProgramCard } from '@/components/program';
import {
  getAllPrograms,
  deleteProgram,
  countProgramSessions,
  type Program,
} from '@/database';

interface ProgramWithMeta {
  program: Program;
  sessionsCount: number;
  isActive: boolean;
}

// Vérifie si un programme est encore actif (dans sa durée)
const isProgramActive = (program: Program): boolean => {
  const createdAt = new Date(program.created_at);
  const endDate = new Date(createdAt);
  endDate.setDate(endDate.getDate() + program.duration_weeks * 7);
  return new Date() <= endDate;
};

export default function ProgramsScreen() {
  const [programs, setPrograms] = useState<ProgramWithMeta[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPrograms = async () => {
    try {
      setLoading(true);
      const allPrograms = await getAllPrograms();

      // Charger le nombre de séances pour chaque programme
      const programsWithMeta: ProgramWithMeta[] = await Promise.all(
        allPrograms.map(async (program) => {
          const sessionsCount = await countProgramSessions(program.id);
          const isActive = isProgramActive(program);
          return { program, sessionsCount, isActive };
        })
      );

      // Trier: actifs d'abord, puis par date de création
      programsWithMeta.sort((a, b) => {
        if (a.isActive && !b.isActive) return -1;
        if (!a.isActive && b.isActive) return 1;
        return new Date(b.program.created_at).getTime() - new Date(a.program.created_at).getTime();
      });

      setPrograms(programsWithMeta);
    } catch (error) {
      console.error('Erreur lors du chargement des programmes:', error);
      Alert.alert('Erreur', 'Impossible de charger les programmes');
    } finally {
      setLoading(false);
    }
  };

  // Recharger les programmes à chaque fois que la page est affichée
  useFocusEffect(
    useCallback(() => {
      loadPrograms();
    }, [])
  );

  const handleBack = () => {
    router.back();
  };

  const handleAddProgram = () => {
    router.push('/create-program');
  };

  const handleOpenProgram = (program: Program) => {
    // Navigation vers le détail du programme
    // router.push(`/program/${program.id}`);
    console.log('Open program:', program.name);
  };

  const handleDeleteProgram = (program: Program) => {
    Alert.alert(
      'Supprimer le programme',
      `Voulez-vous vraiment supprimer "${program.name}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteProgram(program.id);
              setPrograms((prev) => prev.filter((p) => p.program.id !== program.id));
            } catch (error) {
              console.error('Erreur lors de la suppression:', error);
              Alert.alert('Erreur', 'Impossible de supprimer le programme');
            }
          },
        },
      ]
    );
  };

  const activePrograms = programs.filter((p) => p.isActive);
  const expiredPrograms = programs.filter((p) => !p.isActive);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.dark.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={Colors.dark.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Mes Programmes</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddProgram}>
          <Ionicons name="add" size={28} color={Colors.dark.primary} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.dark.primary} />
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {programs.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="fitness-outline" size={64} color={Colors.dark.textMuted} />
              <Text style={styles.emptyTitle}>Aucun programme</Text>
              <Text style={styles.emptySubtitle}>
                Créez votre premier programme d'entraînement
              </Text>
              <TouchableOpacity style={styles.emptyButton} onPress={handleAddProgram}>
                <Ionicons name="add" size={20} color={Colors.dark.background} />
                <Text style={styles.emptyButtonText}>Créer un programme</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {/* Programmes actifs */}
              {activePrograms.length > 0 && (
                <>
                  <Text style={styles.sectionLabel}>
                    {activePrograms.length} programme{activePrograms.length > 1 ? 's' : ''} en cours
                  </Text>
                  {activePrograms.map((item) => (
                    <ProgramCard
                      key={item.program.id}
                      program={item.program}
                      sessionsCount={item.sessionsCount}
                      isActive={item.isActive}
                      onPress={handleOpenProgram}
                      onDelete={handleDeleteProgram}
                    />
                  ))}
                </>
              )}

              {/* Message si aucun programme actif */}
              {activePrograms.length === 0 && (
                <View style={styles.noActiveContainer}>
                  <Ionicons name="calendar-outline" size={32} color={Colors.dark.textMuted} />
                  <Text style={styles.noActiveText}>Aucun programme en cours</Text>
                  <TouchableOpacity style={styles.noActiveButton} onPress={handleAddProgram}>
                    <Text style={styles.noActiveButtonText}>Créer un programme</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Programmes terminés */}
              {expiredPrograms.length > 0 && (
                <>
                  <Text style={[styles.sectionLabel, styles.sectionLabelExpired]}>
                    Programmes terminés
                  </Text>
                  {expiredPrograms.map((item) => (
                    <ProgramCard
                      key={item.program.id}
                      program={item.program}
                      sessionsCount={item.sessionsCount}
                      isActive={item.isActive}
                      onPress={handleOpenProgram}
                      onDelete={handleDeleteProgram}
                    />
                  ))}
                </>
              )}
            </>
          )}
        </ScrollView>
      )}

      {/* Floating Add Button */}
      {programs.length > 0 && (
        <TouchableOpacity style={styles.fab} onPress={handleAddProgram} activeOpacity={0.8}>
          <Ionicons name="add" size={28} color={Colors.dark.text} />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  backButton: {
    padding: 8,
  },
  title: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  addButton: {
    padding: 8,
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
    padding: 20,
    paddingBottom: 100,
  },
  sectionLabel: {
    color: Colors.dark.text,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionLabelExpired: {
    color: Colors.dark.textMuted,
    marginTop: 24,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyTitle: {
    color: Colors.dark.text,
    fontSize: 20,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    color: Colors.dark.textMuted,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.dark.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: Colors.dark.background,
    fontSize: 14,
    fontWeight: '600',
  },
  noActiveContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 16,
    backgroundColor: Colors.dark.backgroundCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  noActiveText: {
    color: Colors.dark.textMuted,
    fontSize: 14,
    marginTop: 12,
    marginBottom: 16,
  },
  noActiveButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.dark.primary,
  },
  noActiveButtonText: {
    color: Colors.dark.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.dark.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.dark.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
