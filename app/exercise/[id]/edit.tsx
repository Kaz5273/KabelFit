import { ExerciseForm } from '@/components/forms/ExerciseForm';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { getExerciseById, updateExercise } from '@/database';
import type { Exercise } from '@/database/types';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, View } from 'react-native';

/**
 * Page d'édition d'un exercice
 */
export default function EditExerciseScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadExercise();
  }, [id]);

  const loadExercise = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      const data = await getExerciseById(Number(id));
      setExercise(data);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      Alert.alert('Erreur', 'Impossible de charger l\'exercice');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData: any) => {
    if (!id) return;

    try {
      await updateExercise(Number(id), {
        name: formData.name,
        muscle_group: formData.muscle_group || undefined,
        sets: formData.sets ? Number(formData.sets) : undefined,
        reps: formData.reps ? Number(formData.reps) : undefined,
        rest_minutes: formData.rest_minutes ? Number(formData.rest_minutes) : undefined,
        description: formData.description || undefined,
      });

      Alert.alert('Succès', 'Exercice modifié avec succès', [
        {
          text: 'OK',
          onPress: () => {
            // Retour avec rafraîchissement
            router.back();
          },
        },
      ]);
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      Alert.alert('Erreur', 'Impossible de modifier l\'exercice');
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (isLoading || !exercise) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Stack.Screen
          options={{
            title: 'Modifier l\'exercice',
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
          title: 'Modifier l\'exercice',
          headerShown: true,
          headerStyle: { backgroundColor: Colors.dark.background },
          headerTintColor: Colors.dark.text,
          headerTitleStyle: { fontWeight: '700' },
        }}
      />
      <ThemedView style={styles.container}>
        <ExerciseForm
          initialData={{
            name: exercise.name,
            muscle_group: exercise.muscle_group || '',
            sets: exercise.sets?.toString() || '',
            reps: exercise.reps?.toString() || '',
            rest_minutes: exercise.rest_minutes?.toString() || '',
            description: exercise.description || '',
          }}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitLabel="Enregistrer"
        />
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
});
