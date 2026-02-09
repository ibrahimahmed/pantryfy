import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS, CLAY_BORDER } from "@/constants/theme";

interface BadgeProps {
  children: React.ReactNode;
  color?: "success" | "warning" | "error" | "primary" | "secondary";
  small?: boolean;
}

const BADGE_COLORS = {
  success: { bg: COLORS.successMuted, text: "#2E7D4A" },
  warning: { bg: COLORS.warningMuted, text: "#B8860B" },
  error: { bg: COLORS.errorMuted, text: "#C62828" },
  primary: { bg: COLORS.primaryMuted, text: COLORS.primaryDark },
  secondary: { bg: COLORS.secondaryMuted, text: COLORS.secondaryDark },
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
    paddingHorizontal: SPACING.sm + 4,
    paddingVertical: SPACING.xs + 2,
    borderRadius: BORDER_RADIUS.full,
    alignSelf: "flex-start",
    ...SHADOWS.sm,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
    borderTopColor: "rgba(255,255,255,0.8)",
  },
  small: {
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: SPACING.xs,
  },
  text: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "700",
  },
  smallText: {
    fontSize: FONT_SIZE.xs,
  },
});
