import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS, CLAY_BORDER } from "@/constants/theme";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="alert-circle-outline" size={40} color={COLORS.error} />
      </View>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry} activeOpacity={0.8}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.retryGradient}
          >
            <Ionicons name="refresh" size={18} color={COLORS.textOnPrimary} />
            <Text style={styles.retryText}>Try Again</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
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
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.xl,
    backgroundColor: COLORS.errorMuted,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.md,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.5)",
    borderTopColor: "rgba(255,255,255,0.7)",
  },
  message: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
    textAlign: "center",
    lineHeight: 22,
  },
  retryButton: {
    marginTop: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    overflow: "hidden",
    ...SHADOWS.sm,
    ...CLAY_BORDER.light,
  },
  retryGradient: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm + 4,
    borderRadius: BORDER_RADIUS.md,
  },
  retryText: {
    color: COLORS.textOnPrimary,
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
  },
});
