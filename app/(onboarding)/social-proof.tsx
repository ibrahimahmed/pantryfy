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

export default function SocialProofScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: "12.5%" }]} />
          </View>
        </View>

        <View style={styles.topSpacer} />

        {/* Stars */}
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((s) => (
            <Ionicons key={s} name="star" size={28} color={COLORS.warning} />
          ))}
        </View>

        {/* Headline */}
        <Text style={styles.headline}>
          We've helped <Text style={styles.highlight}>100,000+</Text> cooks
        </Text>
        <Text style={styles.subheadline}>
          save and organize their favorite recipes
        </Text>

        {/* Testimonial card */}
        <View style={styles.testimonialCard}>
          <View style={styles.quoteIcon}>
            <Ionicons
              name="chatbubble-ellipses"
              size={24}
              color={COLORS.primary}
            />
          </View>
          <Text style={styles.quoteText}>
            "I used to screenshot recipes and lose them. Now everything is saved,
            organized, and I can plan my whole week in minutes. This app changed
            how I cook!"
          </Text>
          <View style={styles.quoteAuthor}>
            <View style={styles.authorAvatar}>
              <Text style={styles.authorInitial}>S</Text>
            </View>
            <View>
              <Text style={styles.authorName}>Sarah M.</Text>
              <View style={styles.miniStars}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Ionicons
                    key={s}
                    name="star"
                    size={12}
                    color={COLORS.warning}
                  />
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Stat row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>4.8</Text>
            <Text style={styles.statLabel}>App Store</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>500K+</Text>
            <Text style={styles.statLabel}>Recipes saved</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>50K+</Text>
            <Text style={styles.statLabel}>5-star reviews</Text>
          </View>
        </View>

        <View style={{ flex: 1 }} />

        {/* CTA */}
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => router.push("/(onboarding)/goals")}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryDark]}
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
  starsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
    marginBottom: SPACING.lg,
  },
  headline: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  highlight: {
    color: COLORS.primary,
  },
  subheadline: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: SPACING.xs,
  },
  testimonialCard: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginTop: SPACING.xl,
    ...SHADOWS.md,
    ...CLAY_BORDER.medium,
  },
  quoteIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primaryMuted,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  quoteText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    lineHeight: 24,
    fontStyle: "italic",
  },
  quoteAuthor: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: SPACING.md,
    gap: SPACING.sm,
  },
  authorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.secondaryMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  authorInitial: {
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    color: COLORS.secondaryDark,
  },
  authorName: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
    color: COLORS.text,
  },
  miniStars: {
    flexDirection: "row",
    gap: 1,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: SPACING.xl,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    ...SHADOWS.sm,
    ...CLAY_BORDER.subtle,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "800",
    color: COLORS.text,
  },
  statLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.border,
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
