import { Colors } from '@/constants/theme';
import { StyleSheet, Text, View, type TextStyle, type ViewStyle } from 'react-native';

type BadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'neutral';
type BadgeSize = 'small' | 'medium' | 'large';

export type BadgeProps = {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

export function Badge({
  label,
  variant = 'neutral',
  size = 'medium',
  style,
  textStyle,
}: BadgeProps) {
  const variantContainerKey = `${variant}Container` as const;
  const variantTextKey = `${variant}Text` as const;
  const sizeTextKey = `${size}Text` as const;

  return (
    <View style={[styles.container, styles[size], styles[variantContainerKey], style]}>
      <Text style={[styles.text, styles[sizeTextKey], styles[variantTextKey], textStyle]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Sizes
  small: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  medium: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  large: {
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderRadius: 4,
  },

  // Text base
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  smallText: {
    fontSize: 11,
    lineHeight: 16,
  },
  mediumText: {
    fontSize: 13,
    lineHeight: 18,
  },
  largeText: {
    fontSize: 15,
    lineHeight: 20,
  },

  // Primary variant
  primaryContainer: {
    backgroundColor: Colors.dark.primary,
  },
  primaryText: {
    color: Colors.dark.text,
  },

  // Success variant
  successContainer: {
    backgroundColor: Colors.dark.success,
  },
  successText: {
    color: Colors.dark.text,
  },

  // Warning variant
  warningContainer: {
    backgroundColor: Colors.dark.warning,
  },
  warningText: {
    color: Colors.dark.background,
  },

  // Error variant
  errorContainer: {
    backgroundColor: Colors.dark.error,
  },
  errorText: {
    color: Colors.dark.text,
  },

  // Neutral variant
  neutralContainer: {
    backgroundColor: Colors.dark.backgroundLight,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  neutralText: {
    color: Colors.dark.textSecondary,
  },
});
