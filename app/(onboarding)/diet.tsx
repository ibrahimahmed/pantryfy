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
import { useOnboardingStore, DietType } from "@/store/onboardingStore";

const DIET_OPTIONS: { id: DietType; label: string; icon: string; desc: string }[] = [
  { id: "vegetarian", label: "Vegetarian", icon: "leaf", desc: "Plant-based meals" },
  { id: "high_protein", label: "High-protein", icon: "barbell", desc: "Protein-rich recipes" },
  { id: "low_carb", label: "Low-carb", icon: "trending-down", desc: "Reduced carbohydrates" },
  { id: "no_specific", label: "No specific diet", icon: "restaurant", desc: "Show me everything" },
];

export default function DietScreen() {
  const router = useRouter();
  const { diet, setDiet } = useOnboardingStore();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: "50%" }]} />
          </View>
        </View>

        <View style={styles.topSpacer} />

        <Text style={styles.title}>Do you follow a{"\n"}specific diet?</Text>
        <Text style={styles.subtitle}>
          We'll prioritize recipes that match your preferences
        </Text>

        <View style={styles.options}>
          {DIET_OPTIONS.map((option) => {
            const isSelected = diet === option.id;
            return (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionCard,
                  isSelected && styles.optionCardSelected,
                ]}
                onPress={() => setDiet(option.id)}
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
                <View style={styles.optionTextCol}>
                  <Text
                    style={[
                      styles.optionLabel,
                      isSelected && styles.optionLabelSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                  <Text style={styles.optionDesc}>{option.desc}</Text>
                </View>
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

        <View style={{ flex: 1 }} />

        {/* CTA */}
        <TouchableOpacity
          style={[styles.ctaButton, !diet && styles.ctaDisabled]}
          onPress={() => router.push("/(onboarding)/sources")}
          disabled={!diet}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={
              diet
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
  optionTextCol: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  optionLabel: {
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
    color: COLORS.text,
  },
  optionLabelSelected: {
    color: COLORS.primaryDark,
  },
  optionDesc: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
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
