import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  COLORS,
  SPACING,
  FONT_SIZE,
  BORDER_RADIUS,
  SHADOWS,
  CLAY_BORDER,
} from "@/constants/theme";

const TUTORIAL_STEPS = [
  { platform: "Instagram", icon: "logo-instagram", color: "#C13584" },
  { platform: "TikTok", icon: "logo-tiktok", color: "#000" },
  { platform: "Safari", icon: "compass-outline", color: "#007AFF" },
  { platform: "Google Chrome", icon: "logo-chrome", color: "#4285F4" },
];

interface ImportTutorialProps {
  visible: boolean;
  onDismiss: () => void;
}

export function ImportTutorial({ visible, onDismiss }: ImportTutorialProps) {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Import recipes faster</Text>
        <TouchableOpacity onPress={onDismiss} hitSlop={8}>
          <Ionicons name="close" size={20} color={COLORS.textLight} />
        </TouchableOpacity>
      </View>
      <Text style={styles.subtitle}>Follow these steps on:</Text>

      <View style={styles.stepList}>
        {TUTORIAL_STEPS.map((step) => (
          <TouchableOpacity
            key={step.platform}
            style={styles.stepRow}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.stepIcon,
                { backgroundColor: step.color + "15" },
              ]}
            >
              <Ionicons
                name={step.icon as any}
                size={22}
                color={step.color}
              />
            </View>
            <Text style={styles.stepLabel}>{step.platform}</Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={COLORS.textLight}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    ...SHADOWS.md,
    ...CLAY_BORDER.medium,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.xs,
  },
  title: {
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    color: COLORS.text,
  },
  subtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  stepList: {
    gap: SPACING.sm,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm + 2,
    ...CLAY_BORDER.subtle,
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  stepLabel: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
    color: COLORS.text,
    marginLeft: SPACING.md,
  },
});
