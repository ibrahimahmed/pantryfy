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

const FEATURES = [
  { icon: "cloud-download-outline", label: "Import from anywhere", color: COLORS.primary },
  { icon: "book-outline", label: "Organize cookbooks", color: COLORS.secondary },
  { icon: "calendar-outline", label: "Plan your meals", color: COLORS.success },
  { icon: "cart-outline", label: "Smart grocery lists", color: COLORS.warning },
];

export default function ReadyScreen() {
  const router = useRouter();
  const { completeOnboarding } = useOnboardingStore();

  const handleReady = () => {
    completeOnboarding();
    router.replace("/paywall");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: "100%" }]} />
          </View>
        </View>

        <View style={styles.topSpacer} />

        {/* Celebration icon */}
        <View style={styles.celebrationIcon}>
          <LinearGradient
            colors={[COLORS.primaryLight, COLORS.primary]}
            style={styles.celebrationGradient}
          >
            <Ionicons name="sparkles" size={40} color={COLORS.textOnPrimary} />
          </LinearGradient>
        </View>

        <Text style={styles.title}>Become a better cook</Text>
        <Text style={styles.subtitle}>
          Your personalized PantryFy experience is ready
        </Text>

        {/* Feature list */}
        <View style={styles.featureList}>
          {FEATURES.map((feature, idx) => (
            <View key={idx} style={styles.featureRow}>
              <View
                style={[
                  styles.featureIcon,
                  { backgroundColor: feature.color + "18" },
                ]}
              >
                <Ionicons
                  name={feature.icon as any}
                  size={22}
                  color={feature.color}
                />
              </View>
              <Text style={styles.featureLabel}>{feature.label}</Text>
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={COLORS.success}
              />
            </View>
          ))}
        </View>

        {/* Progress visualization */}
        <View style={styles.progressCard}>
          <Text style={styles.progressCardTitle}>Your cooking journey</Text>
          <View style={styles.journeyBar}>
            <LinearGradient
              colors={[COLORS.primary, COLORS.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.journeyFill}
            />
          </View>
          <View style={styles.journeyLabels}>
            <Text style={styles.journeyLabel}>Beginner</Text>
            <Text style={[styles.journeyLabel, { color: COLORS.primary }]}>
              Home Chef
            </Text>
          </View>
        </View>

        <View style={{ flex: 1 }} />

        {/* CTA */}
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={handleReady}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaGradient}
          >
            <Text style={styles.ctaText}>I'm Ready!</Text>
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
  celebrationIcon: {
    alignSelf: "center",
    borderRadius: 36,
    overflow: "hidden",
    marginBottom: SPACING.lg,
    ...SHADOWS.lg,
    ...CLAY_BORDER.light,
  },
  celebrationGradient: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
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
  },
  featureList: {
    marginTop: SPACING.xl,
    gap: SPACING.md,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    ...SHADOWS.sm,
    ...CLAY_BORDER.subtle,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  featureLabel: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
    color: COLORS.text,
    marginLeft: SPACING.md,
  },
  progressCard: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginTop: SPACING.xl,
    ...SHADOWS.md,
    ...CLAY_BORDER.medium,
  },
  progressCardTitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  journeyBar: {
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.border,
    overflow: "hidden",
  },
  journeyFill: {
    width: "15%",
    height: "100%",
    borderRadius: 5,
  },
  journeyLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: SPACING.xs,
  },
  journeyLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
  },
  ctaButton: {
    width: "100%",
    borderRadius: BORDER_RADIUS.lg,
    overflow: "hidden",
    ...SHADOWS.md,
    ...CLAY_BORDER.light,
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
