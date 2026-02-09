import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS, CLAY_BORDER } from "@/constants/theme";

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title?: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon = "document-text-outline",
  title,
  message,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={48} color={COLORS.textLight} />
      </View>
      {title && <Text style={styles.title}>{title}</Text>}
      <Text style={styles.message}>{message}</Text>
      {actionLabel && onAction && (
        <TouchableOpacity style={styles.button} onPress={onAction} activeOpacity={0.8}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>{actionLabel}</Text>
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
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: BORDER_RADIUS.xl,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.md,
    ...CLAY_BORDER.medium,
  },
  title: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "700",
    color: COLORS.text,
    marginTop: SPACING.lg,
    textAlign: "center",
  },
  message: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: SPACING.md,
  },
  button: {
    marginTop: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    overflow: "hidden",
    ...SHADOWS.sm,
    ...CLAY_BORDER.light,
  },
  buttonGradient: {
    paddingHorizontal: SPACING.lg + 4,
    paddingVertical: SPACING.sm + 4,
    borderRadius: BORDER_RADIUS.md,
  },
  buttonText: {
    color: COLORS.textOnPrimary,
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
  },
});
