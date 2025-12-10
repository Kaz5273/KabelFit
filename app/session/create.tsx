import { SessionForm } from '@/components/forms/SessionForm';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { createSession } from '@/database';
import type { CreateSessionParams } from '@/database/types';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, SafeAreaView, StyleSheet } from 'react-native';

/**
 * Page de création d'une séance
 * Peut être appelée depuis n'importe où mais nécessite un program_id
 */
export default function CreateSessionScreen() {
  const router = useRouter();
  const { programId } = useLocalSearchParams<{ programId?: string }>();

  // Si pas de programId, on utilise 1 par défaut (ou on pourrait faire un sélecteur)
  const defaultProgramId = programId ? Number(programId) : 1;

  const handleSubmit = async (formData: any) => {
    try {
      const params: CreateSessionParams = {
        program_id: defaultProgramId,
        name: formData.name,
        day_of_week: formData.day_of_week || undefined,
        duration_minutes: Number(formData.duration_minutes),
        description: formData.description || undefined,
        order: Number(formData.order),
      };

      const sessionId = await createSession(params);
      Alert.alert('Succès', 'Séance créée avec succès', [
        {
          text: 'Voir la séance',
          onPress: () => router.replace(`/session/${sessionId}` as any),
        },
        {
          text: 'Retour',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      Alert.alert('Erreur', 'Impossible de créer la séance');
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen
        options={{
          title: 'Créer une séance',
          headerShown: true,
          headerStyle: { backgroundColor: Colors.dark.background },
          headerTintColor: Colors.dark.text,
          headerTitleStyle: { fontWeight: '700' },
        }}
      />
      <ThemedView style={styles.container}>
        <SessionForm
          programId={defaultProgramId}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitLabel="Créer"
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
