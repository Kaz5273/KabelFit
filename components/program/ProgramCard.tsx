import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

export interface Program {
  id: string;
  name: string;
  sessionsCount: number;
  completedSessions: number;
  description?: string;
}

interface ProgramCardProps {
  program: Program;
  onPress: (program: Program) => void;
  onDelete?: (program: Program) => void;
}

export const ProgramCard: React.FC<ProgramCardProps> = ({ program, onPress, onDelete }) => {
  const progress = program.sessionsCount > 0
    ? Math.round((program.completedSessions / program.sessionsCount) * 100)
    : 0;

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
          <Text style={styles.sessions}>
            {program.sessionsCount} séance{program.sessionsCount > 1 ? 's' : ''}
          </Text>
        </View>

        <View style={styles.rightSection}>
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>{progress}%</Text>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
            </View>
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
    marginBottom: 4,
  },
  sessions: {
    color: Colors.dark.textMuted,
    fontSize: 13,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressContainer: {
    alignItems: 'flex-end',
  },
  progressText: {
    color: Colors.dark.primary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  progressBarBackground: {
    width: 60,
    height: 4,
    backgroundColor: Colors.dark.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.dark.primary,
    borderRadius: 2,
  },
  deleteButton: {
    padding: 8,
  },
});
