import { SessionForm } from '@/components/forms/SessionForm';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { getSessionById, updateSession } from '@/database';
import type { Session } from '@/database/types';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, View } from 'react-native';

/**
 * Page d'édition d'une séance
 */
export default function EditSessionScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSession();
  }, [id]);

  const loadSession = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      const data = await getSessionById(Number(id));
      setSession(data);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      Alert.alert('Erreur', 'Impossible de charger la séance');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData: any) => {
    if (!id) return;

    try {
      await updateSession(Number(id), {
        name: formData.name,
        day_of_week: formData.day_of_week || undefined,
        duration_minutes: Number(formData.duration_minutes),
        description: formData.description || undefined,
        order: Number(formData.order),
      });

      Alert.alert('Succès', 'Séance modifiée avec succès', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      Alert.alert('Erreur', 'Impossible de modifier la séance');
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (isLoading || !session) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Stack.Screen
          options={{
            title: 'Modifier la séance',
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
          title: 'Modifier la séance',
          headerShown: true,
          headerStyle: { backgroundColor: Colors.dark.background },
          headerTintColor: Colors.dark.text,
          headerTitleStyle: { fontWeight: '700' },
        }}
      />
      <ThemedView style={styles.container}>
        <SessionForm
          programId={session.program_id}
          initialData={{
            name: session.name,
            day_of_week: session.day_of_week || '',
            duration_minutes: session.duration_minutes.toString(),
            description: session.description || '',
            order: session.order.toString(),
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
