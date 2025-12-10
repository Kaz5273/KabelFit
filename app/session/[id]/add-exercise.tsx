import { ExerciseForm } from '@/components/forms/ExerciseForm';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { createExercise } from '@/database';
import type { CreateExerciseParams } from '@/database/types';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, SafeAreaView, StyleSheet } from 'react-native';

/**
 * Page d'ajout d'un exercice à une séance
 */
export default function AddExerciseScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const handleSubmit = async (formData: any) => {
    try {
      const params: CreateExerciseParams = {
        session_id: Number(id),
        name: formData.name,
        muscle_group: formData.muscle_group || undefined,
        sets: formData.sets ? Number(formData.sets) : undefined,
        reps: formData.reps ? Number(formData.reps) : undefined,
        rest_minutes: formData.rest_minutes ? Number(formData.rest_minutes) : undefined,
        description: formData.description || undefined,
      };

      await createExercise(params);
      Alert.alert('Succès', 'Exercice ajouté avec succès', [
        {
          text: 'OK',
          onPress: () => {
            // Utiliser replace pour forcer le rafraîchissement de la page parente
            router.replace(`/session/${id}` as any);
          },
        },
      ]);
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      Alert.alert('Erreur', 'Impossible de créer l\'exercice');
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen
        options={{
          title: 'Ajouter un exercice',
          headerShown: true,
          headerStyle: { backgroundColor: Colors.dark.background },
          headerTintColor: Colors.dark.text,
          headerTitleStyle: { fontWeight: '700' },
        }}
      />
      <ThemedView style={styles.container}>
        <ExerciseForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitLabel="Ajouter"
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
});
