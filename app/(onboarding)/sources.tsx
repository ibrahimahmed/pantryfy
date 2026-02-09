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
  RecipeSource,
} from "@/store/onboardingStore";

const SOURCE_OPTIONS: {
  id: RecipeSource;
  label: string;
  icon: string;
  color: string;
  bg: string;
}[] = [
  { id: "instagram", label: "Instagram", icon: "logo-instagram", color: "#C13584", bg: "#FCE4F0" },
  { id: "tiktok", label: "TikTok", icon: "logo-tiktok", color: "#000", bg: "#F0F0F0" },
  { id: "facebook", label: "Facebook", icon: "logo-facebook", color: "#1877F2", bg: "#E3F0FF" },
  { id: "pinterest", label: "Pinterest", icon: "logo-pinterest", color: "#E60023", bg: "#FFE0E6" },
  { id: "cookbooks", label: "Cookbooks", icon: "book", color: COLORS.secondary, bg: COLORS.secondaryMuted },
  { id: "websites", label: "Cooking websites", icon: "globe", color: COLORS.primary, bg: COLORS.primaryMuted },
];

export default function SourcesScreen() {
  const router = useRouter();
  const { recipeSources, toggleRecipeSource } = useOnboardingStore();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: "67%" }]} />
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.title}>Where do you get{"\n"}your recipes from?</Text>
          <Text style={styles.subtitle}>Select all that apply</Text>

          <View style={styles.grid}>
            {SOURCE_OPTIONS.map((option) => {
              const isSelected = recipeSources.includes(option.id);
              return (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.sourceCard,
                    isSelected && styles.sourceCardSelected,
                  ]}
                  onPress={() => toggleRecipeSource(option.id)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.sourceIcon, { backgroundColor: option.bg }]}>
                    <Ionicons
                      name={option.icon as any}
                      size={28}
                      color={option.color}
                    />
                  </View>
                  <Text
                    style={[
                      styles.sourceLabel,
                      isSelected && styles.sourceLabelSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {isSelected && (
                    <View style={styles.checkBadge}>
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
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
          style={[
            styles.ctaButton,
            recipeSources.length === 0 && styles.ctaDisabled,
          ]}
          onPress={() => router.push("/(onboarding)/import-highlight")}
          disabled={recipeSources.length === 0}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={
              recipeSources.length > 0
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
    lineHeight: 36,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.md,
    justifyContent: "center",
  },
  sourceCard: {
    width: "46%",
    alignItems: "center",
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.md,
    ...SHADOWS.sm,
    ...CLAY_BORDER.subtle,
  },
  sourceCardSelected: {
    backgroundColor: COLORS.primaryMuted,
    borderColor: COLORS.primaryLight,
    borderTopColor: COLORS.primaryLight,
    borderLeftColor: COLORS.primaryLight,
  },
  sourceIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.sm,
    ...SHADOWS.sm,
  },
  sourceLabel: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
    color: COLORS.text,
    textAlign: "center",
  },
  sourceLabelSelected: {
    color: COLORS.primaryDark,
  },
  checkBadge: {
    position: "absolute",
    top: SPACING.sm,
    right: SPACING.sm,
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
