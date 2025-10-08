import React from 'react';
import { View, Text, StyleSheet, ViewProps } from 'react-native';
import { COLORS } from '../constants/colors';

interface ProgressBarProps extends ViewProps {
  progress: number; // 0 to 100
  height?: number;
  showLabel?: boolean;
  label?: string;
  variant?: 'default' | 'gradient';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 8,
  showLabel = false,
  label,
  variant = 'default',
  style,
  ...props
}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <View style={[styles.container, style]} {...props}>
      {(showLabel || label) && (
        <View style={styles.labelContainer}>
          {label && <Text style={styles.label}>{label}</Text>}
          {showLabel && <Text style={styles.percentage}>{Math.round(clampedProgress)}%</Text>}
        </View>
      )}
      <View style={[styles.track, { height }]}>
        <View
          style={[
            styles.fill,
            variant === 'gradient' && styles.fillGradient,
            {
              width: `${clampedProgress}%`,
              height,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  percentage: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  track: {
    width: '100%',
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 999,
    overflow: 'hidden',
  },
  fill: {
    backgroundColor: COLORS.primary,
    borderRadius: 999,
  },
  fillGradient: {
    backgroundColor: COLORS.primary,
  },
});
