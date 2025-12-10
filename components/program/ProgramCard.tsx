import { Colors } from '@/constants/theme';
import type { Program } from '@/database/types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ProgramCardProps {
  program: Program;
  onPress: (program: Program) => void;
  onDelete?: (program: Program) => void;
}

export const ProgramCard: React.FC<ProgramCardProps> = ({ program, onPress, onDelete }) => {
  // Pour l'instant, on affiche juste le type et la durée
  // Le pourcentage de complétion sera calculé plus tard avec les sessions terminées
  
  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return '#4CAF50';
      case 'intermediate': return '#FF9800';
      case 'advanced': return '#F44336';
      default: return Colors.dark.textMuted;
    }
  };

  const getDifficultyLabel = (level: string) => {
    switch (level) {
      case 'beginner': return 'Débutant';
      case 'intermediate': return 'Intermédiaire';
      case 'advanced': return 'Avancé';
      default: return level;
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.7}
      onPress={() => onPress(program)}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="barbell" size={24} color={Colors.dark.primary} />
        </View>

        <View style={styles.info}>
          <Text style={styles.name}>{program.name}</Text>
          <View style={styles.detailsRow}>
            <Text style={styles.detail}>{program.type}</Text>
            <Text style={styles.separator}>•</Text>
            <Text style={styles.detail}>{program.duration_weeks} semaines</Text>
            <Text style={styles.separator}>•</Text>
            <Text style={styles.detail}>{program.sessions_per_week}x/sem</Text>
          </View>
          {program.difficulty_level && (
            <Text style={[styles.difficulty, { color: getDifficultyColor(program.difficulty_level) }]}>
              {getDifficultyLabel(program.difficulty_level)}
            </Text>
          )}
        </View>

        {onDelete && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => onDelete(program)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="trash-outline" size={18} color={Colors.dark.textMuted} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark.backgroundCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    marginBottom: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    backgroundColor: 'rgba(220, 20, 60, 0.1)',
    width: 48,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  info: {
    flex: 1,
  },
  name: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  detail: {
    color: Colors.dark.textMuted,
    fontSize: 12,
  },
  separator: {
    color: Colors.dark.textMuted,
    fontSize: 12,
  },
  difficulty: {
    fontSize: 12,
    fontWeight: '600',
  },
  deleteButton: {
    padding: 8,
  },
});
