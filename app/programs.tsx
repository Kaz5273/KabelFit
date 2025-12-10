import { ProgramCard } from '@/components/program';
import { Colors } from '@/constants/theme';
import { deleteProgram, getAllPrograms } from '@/database';
import type { Program } from '@/database/types';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProgramsScreen() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadPrograms = useCallback(async () => {
    try {
      setIsLoading(true);
      const allPrograms = await getAllPrograms();
      setPrograms(allPrograms);
    } catch (error) {
      console.error('Erreur lors du chargement des programmes:', error);
      Alert.alert('Erreur', 'Impossible de charger les programmes');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadPrograms();
    }, [loadPrograms])
  );

  const handleBack = () => {
    router.back();
  };

  const handleAddProgram = () => {
    // Navigation vers la création de programme
    // router.push('/create-program');
    console.log('Navigate to create program');
  };

  const handleOpenProgram = (program: Program) => {
    // Navigation vers le détail du programme avec ses séances
    router.push(`/program/${program.id}` as any);
  };

  const handleDeleteProgram = (program: Program) => {
    Alert.alert(
      'Supprimer le programme',
      `Voulez-vous vraiment supprimer "${program.name}" et toutes ses séances ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteProgram(program.id!);
              await loadPrograms();
              Alert.alert('Succès', 'Programme supprimé');
            } catch (error) {
              console.error('Erreur lors de la suppression:', error);
              Alert.alert('Erreur', 'Impossible de supprimer le programme');
            }
          },
        },
      ]
    );
  };

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
            <Text style={styles.sectionLabel}>
              {programs.length} programme{programs.length > 1 ? 's' : ''}
            </Text>
            {programs.map((program) => (
              <ProgramCard
                key={program.id}
                program={program}
                onPress={handleOpenProgram}
                onDelete={handleDeleteProgram}
              />
            ))}
          </>
        )}
      </ScrollView>

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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  sectionLabel: {
    color: Colors.dark.textMuted,
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
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
