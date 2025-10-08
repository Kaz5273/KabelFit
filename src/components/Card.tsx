import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { COLORS } from '../constants/colors';

interface CardProps extends ViewProps {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: number;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 16,
  style,
  ...props
}) => {
  return (
    <View
      style={[
        styles.card,
        styles[`card_${variant}`],
        { padding },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    backgroundColor: COLORS.backgroundCard,
  },
  card_default: {
    backgroundColor: COLORS.backgroundCard,
  },
  card_elevated: {
    backgroundColor: COLORS.backgroundCard,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  card_outlined: {
    backgroundColor: COLORS.backgroundCard,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
});
