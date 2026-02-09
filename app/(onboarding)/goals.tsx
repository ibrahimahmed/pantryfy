import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
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
import {
  useOnboardingStore,
  CookingGoal,
} from "@/store/onboardingStore";

const GOAL_OPTIONS: { id: CookingGoal; label: string; icon: string }[] = [
  { id: "eat_healthier", label: "Eat healthier", icon: "leaf" },
  { id: "save_money", label: "Save money", icon: "wallet" },
  { id: "improve_skills", label: "Improve cooking skills", icon: "flame" },
  { id: "organize_recipes", label: "Organize recipes", icon: "folder-open" },
  { id: "plan_meals", label: "Plan out meals", icon: "calendar" },
  { id: "try_cuisines", label: "Try new cuisines", icon: "earth" },
];

export default function GoalsScreen() {
  const router = useRouter();
  const { goals, toggleGoal } = useOnboardingStore();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: "17%" }]} />
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.title}>What are your goals?</Text>
          <Text style={styles.subtitle}>
            Select all that apply to personalize your experience
          </Text>

          <View style={styles.optionsGrid}>
            {GOAL_OPTIONS.map((option) => {
              const isSelected = goals.includes(option.id);
              return (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.optionCard,
                    isSelected && styles.optionCardSelected,
                  ]}
                  onPress={() => toggleGoal(option.id)}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.optionIcon,
                      isSelected && styles.optionIconSelected,
                    ]}
                  >
                    <Ionicons
                      name={option.icon as any}
                      size={24}
                      color={isSelected ? COLORS.primary : COLORS.textSecondary}
                    />
                  </View>
                  <Text
                    style={[
                      styles.optionLabel,
                      isSelected && styles.optionLabelSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {isSelected && (
                    <View style={styles.checkmark}>
                      <Ionicons
                        name="checkmark-circle"
                        size={22}
                        color={COLORS.primary}
                      />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* CTA */}
        <TouchableOpacity
          style={[styles.ctaButton, goals.length === 0 && styles.ctaDisabled]}
          onPress={() => router.push("/(onboarding)/frequency")}
          disabled={goals.length === 0}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={
              goals.length > 0
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
  scrollContent: {
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  optionsGrid: {
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
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.sm,
  },
  optionIconSelected: {
    backgroundColor: COLORS.surfaceElevated,
  },
  optionLabel: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
    color: COLORS.text,
    marginLeft: SPACING.md,
  },
  optionLabelSelected: {
    color: COLORS.primaryDark,
  },
  checkmark: {
    marginLeft: SPACING.sm,
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
