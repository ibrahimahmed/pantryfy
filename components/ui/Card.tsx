import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, CLAY_BORDER } from "@/constants/theme";

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevated?: boolean;
}

export function Card({ children, style, elevated }: CardProps) {
  return (
    <View
      style={[
        styles.card,
        elevated && styles.elevated,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    ...SHADOWS.md,
    ...CLAY_BORDER.medium,
  },
  elevated: {
    backgroundColor: COLORS.surfaceElevated,
    ...SHADOWS.lg,
  },
});
