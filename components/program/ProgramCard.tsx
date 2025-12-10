import { Colors } from '@/constants/theme';
import type { Program } from '@/database';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ProgramCardProps {
  program: Program;
  sessionsCount: number;
  isActive: boolean;
  onPress: (program: Program) => void;
  onDelete?: (program: Program) => void;
}

export const ProgramCard: React.FC<ProgramCardProps> = ({
  program,
  sessionsCount,
  isActive,
  onPress,
  onDelete,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, !isActive && styles.containerInactive]}
      activeOpacity={0.7}
      onPress={() => onPress(program)}>
      <View style={styles.content}>
        <View style={[styles.iconContainer, !isActive && styles.iconContainerInactive]}>
          <Ionicons
            name="barbell"
            size={24}
            color={isActive ? Colors.dark.primary : Colors.dark.textMuted}
          />
        </View>

        <View style={styles.info}>
          <Text style={[styles.name, !isActive && styles.nameInactive]}>{program.name}</Text>
          <Text style={styles.details}>
            {sessionsCount} séance{sessionsCount > 1 ? 's' : ''} • {program.duration_weeks} sem.
          </Text>
          <View style={styles.badges}>
            <View style={[styles.badge, styles.badgeLevel]}>
              <Text style={styles.badgeText}>{program.difficulty_level}</Text>
            </View>
            {isActive ? (
              <View style={[styles.badge, styles.badgeActive]}>
                <Text style={[styles.badgeText, styles.badgeTextActive]}>En cours</Text>
              </View>
            ) : (
              <View style={[styles.badge, styles.badgeExpired]}>
                <Text style={styles.badgeText}>Terminé</Text>
              </View>
            )}
          </View>
        </View>

        {onDelete && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={(e) => {
              e.stopPropagation();
              onDelete(program);
            }}
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
  containerInactive: {
    opacity: 0.6,
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
  iconContainerInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
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
  nameInactive: {
    color: Colors.dark.textMuted,
  },
  details: {
    color: Colors.dark.textMuted,
    fontSize: 13,
    marginBottom: 8,
  },
  badges: {
    flexDirection: 'row',
    gap: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
  },
  badgeLevel: {
    borderColor: Colors.dark.border,
  },
  badgeActive: {
    borderColor: Colors.dark.primary,
    backgroundColor: 'rgba(220, 20, 60, 0.1)',
  },
  badgeExpired: {
    borderColor: Colors.dark.border,
  },
  badgeText: {
    color: Colors.dark.textMuted,
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase' as const,
  },
  badgeTextActive: {
    color: Colors.dark.primary,
  },
  deleteButton: {
    padding: 8,
  },
});
