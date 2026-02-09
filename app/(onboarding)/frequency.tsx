import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import {
  COLORS,
  SPACING,
  FONT_SIZE,
  BORDER_RADIUS,
  SHADOWS,
  CLAY_BORDER,
} from "@/constants/theme";
import { useOnboardingStore } from "@/store/onboardingStore";

const FREQUENCY_OPTIONS = [
  { value: 1, label: "1-2 days", emoji: "\u{1F923}" },
  { value: 3, label: "3-4 days", emoji: "\u{1F44D}" },
  { value: 5, label: "5-6 days", emoji: "\u{1F525}" },
  { value: 7, label: "Every day", emoji: "\u{1F468}\u200D\u{1F373}" },
];

export default function FrequencyScreen() {
  const router = useRouter();
  const { cookingFrequency, setCookingFrequency } = useOnboardingStore();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: "33%" }]} />
          </View>
        </View>

        <View style={styles.topSpacer} />

        <Text style={styles.title}>
          How many days do you{"\n"}cook per week?
        </Text>
        <Text style={styles.subtitle}>
          This helps us tailor your meal planning
        </Text>

        <View style={styles.options}>
          {FREQUENCY_OPTIONS.map((option) => {
            const isSelected = cookingFrequency === option.value;
            return (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionCard,
                  isSelected && styles.optionCardSelected,
                ]}
                onPress={() => setCookingFrequency(option.value)}
                activeOpacity={0.8}
              >
                <Text style={styles.optionEmoji}>{option.emoji}</Text>
                <Text
                  style={[
                    styles.optionLabel,
                    isSelected && styles.optionLabelSelected,
                  ]}
                >
                  {option.label}
                </Text>
                {isSelected && (
                  <Ionicons
                    name="checkmark-circle"
                    size={22}
                    color={COLORS.primary}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Motivational tip */}
        {cookingFrequency !== null && (
          <View style={styles.tipCard}>
            <Ionicons name="sparkles" size={20} color={COLORS.warning} />
            <Text style={styles.tipText}>
              {cookingFrequency >= 5
                ? "Amazing! You're a dedicated cook. We'll help you discover new recipes every day."
                : cookingFrequency >= 3
                  ? "Great start! Meal planning will save you hours each week."
                  : "No worries! Even cooking once a week is a great habit to build."}
            </Text>
          </View>
        )}

        <View style={{ flex: 1 }} />

        {/* CTA */}
        <TouchableOpacity
          style={[
            styles.ctaButton,
            cookingFrequency === null && styles.ctaDisabled,
          ]}
          onPress={() => router.push("/(onboarding)/diet")}
          disabled={cookingFrequency === null}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={
              cookingFrequency !== null
                ? [COLORS.primary, COLORS.primaryDark]
                : [COLORS.border, COLORS.border]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaGradient}
          >
            <Text style={styles.ctaText}>Continue</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  progressContainer: {
    paddingTop: SPACING.md,
    paddingHorizontal: SPACING.sm,
  },
  progressTrack: {
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  topSpacer: {
    height: SPACING.xxl,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "center",
    letterSpacing: -0.5,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  options: {
    gap: SPACING.md,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    ...SHADOWS.sm,
    ...CLAY_BORDER.subtle,
  },
  optionCardSelected: {
    backgroundColor: COLORS.primaryMuted,
    borderColor: COLORS.primaryLight,
    borderTopColor: COLORS.primaryLight,
    borderLeftColor: COLORS.primaryLight,
  },
  optionEmoji: {
    fontSize: 28,
    marginRight: SPACING.md,
  },
  optionLabel: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
    color: COLORS.text,
  },
  optionLabelSelected: {
    color: COLORS.primaryDark,
  },
  tipCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: SPACING.sm,
    backgroundColor: COLORS.warningMuted,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginTop: SPACING.lg,
    ...CLAY_BORDER.subtle,
  },
  tipText: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
    lineHeight: 20,
  },
  ctaButton: {
    width: "100%",
    borderRadius: BORDER_RADIUS.lg,
    overflow: "hidden",
    ...SHADOWS.md,
    ...CLAY_BORDER.light,
  },
  ctaDisabled: {
    opacity: 0.5,
  },
  ctaGradient: {
    paddingVertical: SPACING.md + 4,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: BORDER_RADIUS.lg,
  },
  ctaText: {
    color: COLORS.textOnPrimary,
    fontSize: FONT_SIZE.lg,
    fontWeight: "700",
  },
  bottomSpacer: {
    height: SPACING.xl,
  },
});
