import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Badge } from '@/components/ui/badge';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

/**
 * Écran de démonstration du composant Badge
 * Affiche tous les variants et tailles disponibles
 */
export default function BadgeExample() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          <ThemedText type="title" style={styles.title}>
            Badge Component
          </ThemedText>

          {/* Variants */}
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Variants
            </ThemedText>
            <View style={styles.row}>
              <Badge label="Primary" variant="primary" />
              <Badge label="Success" variant="success" />
              <Badge label="Warning" variant="warning" />
              <Badge label="Error" variant="error" />
              <Badge label="Neutral" variant="neutral" />
            </View>
          </View>

          {/* Sizes */}
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Sizes
            </ThemedText>
            <View style={styles.row}>
              <Badge label="Small" size="small" />
              <Badge label="Medium" size="medium" />
              <Badge label="Large" size="large" />
            </View>
          </View>

          {/* Use cases */}
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Cas d'usage
            </ThemedText>
            <View style={styles.column}>
              <View style={styles.useCase}>
                <ThemedText style={styles.label}>Types de séance:</ThemedText>
                <View style={styles.row}>
                  <Badge label="AMRAP" variant="primary" />
                  <Badge label="HIIT" variant="primary" />
                  <Badge label="EMOM" variant="primary" />
                </View>
              </View>

              <View style={styles.useCase}>
                <ThemedText style={styles.label}>Statuts:</ThemedText>
                <View style={styles.row}>
                  <Badge label="Terminé" variant="success" />
                  <Badge label="En cours" variant="warning" />
                  <Badge label="Abandonné" variant="error" />
                </View>
              </View>

              <View style={styles.useCase}>
                <ThemedText style={styles.label}>Catégories:</ThemedText>
                <View style={styles.row}>
                  <Badge label="Force" variant="neutral" />
                  <Badge label="Cardio" variant="neutral" />
                  <Badge label="Core" variant="neutral" />
                </View>
              </View>
            </View>
          </View>
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
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    marginBottom: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  column: {
    gap: 16,
  },
  useCase: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    opacity: 0.7,
  },
});
