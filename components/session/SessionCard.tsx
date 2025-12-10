import { ThemedText } from '@/components/themed-text';
import { Badge } from '@/components/ui/badge';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import type { Session } from '@/database/types';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface SessionCardProps {
  session: Session;
  programType?: string;
  onPress: (session: Session) => void;
}

/**
 * Carte d'affichage d'une séance d'entraînement
 * Inspiré du design ProgramSelector avec adaptation React Native
 */
export function SessionCard({ session, programType, onPress }: SessionCardProps) {
  const formatDay = (dayOfWeek: string | null) => {
    if (!dayOfWeek) return 'Jour non défini';
    const days: { [key: string]: string } = {
      Monday: 'Lundi',
      Tuesday: 'Mardi',
      Wednesday: 'Mercredi',
      Thursday: 'Jeudi',
      Friday: 'Vendredi',
      Saturday: 'Samedi',
      Sunday: 'Dimanche',
    };
    return days[dayOfWeek] || dayOfWeek;
  };

  const formatDuration = (minutes: number) => {
    return `${minutes} min`;
  };

  const getTypeColor = (type: string) => {
    switch (type?.toUpperCase()) {
      case 'HIIT':
        return 'primary';
      case 'STRENGTH':
        return 'success';
      case 'CARDIO':
        return 'warning';
      case 'YOGA':
        return 'neutral';
      default:
        return 'neutral';
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(session)}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={[Colors.dark.backgroundCard, Colors.dark.background]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Header avec badges */}
          <View style={styles.header}>
            {programType && (
              <Badge label={programType} variant={getTypeColor(programType) as any} />
            )}
            <View style={styles.durationContainer}>
              <IconSymbol name="clock" size={14} color={Colors.dark.textSecondary} />
              <ThemedText style={styles.duration}>
                {formatDuration(session.duration_minutes)}
              </ThemedText>
            </View>
          </View>

          {/* Titre */}
          <ThemedText type="subtitle" style={styles.title}>
            {session.name}
          </ThemedText>

          {/* Date */}
          {session.day_of_week && (
            <View style={styles.dateContainer}>
              <IconSymbol name="calendar" size={14} color={Colors.dark.textSecondary} />
              <ThemedText style={styles.date}>
                {formatDay(session.day_of_week)}
              </ThemedText>
            </View>
          )}

          {/* Footer avec bouton */}
          <View style={styles.footer}>
            <View style={styles.startButton}>
              <ThemedText style={styles.startButtonText}>COMMENCER</ThemedText>
              <IconSymbol name="arrow.right" size={16} color={Colors.dark.primary} />
            </View>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  gradient: {
    minHeight: 200,
  },
  content: {
    padding: 20,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  duration: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
  },
  title: {
    fontSize: 22,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
  },
  date: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: Colors.dark.divider,
    paddingTop: 16,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  startButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.dark.primary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});
