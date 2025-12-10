import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import type { Exercise } from '@/database/types';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';

interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
  onEdit?: (exercise: Exercise) => void;
  onDelete?: (exercise: Exercise) => void;
  showActions?: boolean;
}

/**
 * Carte d'affichage d'un exercice dans une séance
 * Montre les séries, répétitions, temps de repos et groupe musculaire
 */
export function ExerciseCard({ 
  exercise, 
  index, 
  onEdit, 
  onDelete,
  showActions = false 
}: ExerciseCardProps) {
  const formatRestTime = (minutes: number | null) => {
    if (!minutes) return 'Repos non défini';
    if (minutes < 1) return `${Math.round(minutes * 60)}s`;
    return `${minutes}min`;
  };

  const handleDelete = () => {
    Alert.alert(
      'Supprimer l\'exercice',
      `Voulez-vous vraiment supprimer "${exercise.name}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => onDelete?.(exercise),
        },
      ]
    );
  };

  return (
    <View style={styles.card}>
      {/* Numéro et nom de l'exercice */}
      <View style={styles.header}>
        <View style={styles.numberBadge}>
          <ThemedText style={styles.numberText}>{index + 1}</ThemedText>
        </View>
        <View style={styles.headerContent}>
          <ThemedText type="subtitle" style={styles.name}>
            {exercise.name}
          </ThemedText>
          {exercise.muscle_group && (
            <View style={styles.muscleGroup}>
              <IconSymbol name="figure.strengthtraining.traditional" size={14} color={Colors.dark.textSecondary} />
              <ThemedText style={styles.muscleGroupText}>
                {exercise.muscle_group}
              </ThemedText>
            </View>
          )}
        </View>

        {/* Actions */}
        {showActions && (
          <View style={styles.actions}>
            {onEdit && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => onEdit(exercise)}
              >
                <IconSymbol name="pencil" size={18} color={Colors.dark.text} />
              </TouchableOpacity>
            )}
            {onDelete && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleDelete}
              >
                <IconSymbol name="trash" size={18} color={Colors.dark.error} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* Paramètres de l'exercice */}
      <View style={styles.parameters}>
        {exercise.sets && (
          <View style={styles.parameter}>
            <IconSymbol name="square.stack.3d.up" size={18} color={Colors.dark.primary} />
            <View style={styles.parameterText}>
              <ThemedText style={styles.parameterValue}>{exercise.sets}</ThemedText>
              <ThemedText style={styles.parameterLabel}>Séries</ThemedText>
            </View>
          </View>
        )}

        {exercise.reps && (
          <View style={styles.parameter}>
            <IconSymbol name="arrow.clockwise" size={18} color={Colors.dark.primary} />
            <View style={styles.parameterText}>
              <ThemedText style={styles.parameterValue}>{exercise.reps}</ThemedText>
              <ThemedText style={styles.parameterLabel}>Reps</ThemedText>
            </View>
          </View>
        )}

        <View style={styles.parameter}>
          <IconSymbol name="clock" size={18} color={Colors.dark.primary} />
          <View style={styles.parameterText}>
            <ThemedText style={styles.parameterValue}>
              {formatRestTime(exercise.rest_minutes)}
            </ThemedText>
            <ThemedText style={styles.parameterLabel}>Repos</ThemedText>
          </View>
        </View>
      </View>

      {/* Description si présente */}
      {exercise.description && (
        <View style={styles.description}>
          <ThemedText style={styles.descriptionText}>
            {exercise.description}
          </ThemedText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.dark.backgroundCard,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  numberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.dark.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  numberText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.dark.background,
  },
  headerContent: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: 4,
  },
  muscleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  muscleGroupText: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
  },
  parameters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.divider,
  },
  parameter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  parameterText: {
    flexDirection: 'column',
  },
  parameterValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.dark.text,
  },
  parameterLabel: {
    fontSize: 11,
    color: Colors.dark.textSecondary,
    textTransform: 'uppercase',
  },
  description: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.divider,
  },
  descriptionText: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
    lineHeight: 18,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginLeft: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.dark.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
});
