import React from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS, CLAY_BORDER } from "@/constants/theme";

interface LoadingSpinnerProps {
  message?: string;
  size?: "small" | "large";
}

export function LoadingSpinner({
  message,
  size = "large",
}: LoadingSpinnerProps) {
  return (
    <View style={styles.container}>
      <View style={styles.spinnerContainer}>
        <ActivityIndicator size={size} color={COLORS.primary} />
      </View>
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.xl,
    backgroundColor: COLORS.background,
  },
  spinnerContainer: {
    width: 72,
    height: 72,
    borderRadius: BORDER_RADIUS.xl,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.md,
    ...CLAY_BORDER.medium,
  },
  message: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    textAlign: "center",
    fontWeight: "500",
  },
});
