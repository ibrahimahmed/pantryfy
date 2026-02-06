import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from "@/constants/theme";

interface BadgeProps {
  children: React.ReactNode;
  color?: "success" | "warning" | "error" | "primary" | "secondary";
  small?: boolean;
}

const BADGE_COLORS = {
  success: { bg: "#E8F5E9", text: "#2E7D32" },
  warning: { bg: "#FFF3E0", text: "#E65100" },
  error: { bg: "#FFEBEE", text: "#C62828" },
  primary: { bg: "#E8F5E9", text: COLORS.primary },
  secondary: { bg: "#FFF3E0", text: COLORS.secondary },
};

export function Badge({ children, color = "primary", small }: BadgeProps) {
  const colors = BADGE_COLORS[color];

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: colors.bg },
        small && styles.small,
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: colors.text },
          small && styles.smallText,
        ]}
      >
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    alignSelf: "flex-start",
  },
  small: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
  },
  text: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
  },
  smallText: {
    fontSize: FONT_SIZE.xs,
  },
});
