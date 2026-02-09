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

const PLATFORM_ICONS = [
  { name: "logo-instagram", color: "#C13584", bg: "#FCE4F0" },
  { name: "logo-tiktok", color: "#000", bg: "#F0F0F0" },
  { name: "logo-youtube", color: "#FF0000", bg: "#FFE8E8" },
  { name: "logo-pinterest", color: "#E60023", bg: "#FFE0E6" },
  { name: "globe-outline", color: COLORS.primary, bg: COLORS.primaryMuted },
];

export default function ImportHighlightScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: "83%" }]} />
          </View>
        </View>

        <View style={styles.topSpacer} />

        {/* Floating platform icons */}
        <View style={styles.iconCluster}>
          {PLATFORM_ICONS.map((icon, idx) => {
            const positions = [
              { top: 0, left: "20%" },
              { top: 10, right: "15%" },
              { top: 70, left: "5%" },
              { top: 80, right: "5%" },
              { top: 40, left: "38%" },
            ];
            const pos = positions[idx];
            return (
              <View
                key={icon.name}
                style={[styles.platformBubble, { backgroundColor: icon.bg }, pos as any]}
              >
                <Ionicons name={icon.name as any} size={26} color={icon.color} />
              </View>
            );
          })}
        </View>

        {/* Recipe card preview */}
        <View style={styles.recipePreview}>
          <View style={styles.previewImagePlaceholder}>
            <Text style={styles.previewEmoji}>{"\u{1F96A}"}</Text>
          </View>
          <View style={styles.previewContent}>
            <View style={[styles.previewLine, { width: "85%" }]} />
            <View style={[styles.previewLine, { width: "60%" }]} />
            <View style={styles.previewMeta}>
              <Ionicons name="time-outline" size={12} color={COLORS.textLight} />
              <View style={[styles.previewLineSm, { width: 40 }]} />
              <Ionicons
                name="people-outline"
                size={12}
                color={COLORS.textLight}
              />
              <View style={[styles.previewLineSm, { width: 30 }]} />
            </View>
          </View>
        </View>

        <Text style={styles.title}>
          Awesome!{"\n"}PantryFy supports{"\n"}recipe importing
        </Text>
        <Text style={styles.subtitle}>
          From <Text style={styles.bold}>95% of recipe sites</Text> and all
          major social platforms. Just paste a link and we'll do the rest.
        </Text>

        <View style={{ flex: 1 }} />

        {/* CTA */}
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => router.push("/(onboarding)/ready")}
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
    height: SPACING.lg,
  },
  iconCluster: {
    width: "100%",
    height: 130,
    position: "relative",
    marginBottom: SPACING.md,
  },
  platformBubble: {
    position: "absolute",
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.sm,
    ...CLAY_BORDER.subtle,
  },
  recipePreview: {
    flexDirection: "row",
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.sm,
    marginBottom: SPACING.xl,
    ...SHADOWS.md,
    ...CLAY_BORDER.medium,
  },
  previewImagePlaceholder: {
    width: 72,
    height: 72,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.secondaryMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  previewEmoji: {
    fontSize: 32,
  },
  previewContent: {
    flex: 1,
    marginLeft: SPACING.sm,
    justifyContent: "center",
    gap: 6,
  },
  previewLine: {
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.border,
  },
  previewMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  previewLineSm: {
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.borderLight,
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
    marginTop: SPACING.md,
    lineHeight: 22,
    paddingHorizontal: SPACING.sm,
  },
  bold: {
    fontWeight: "700",
    color: COLORS.text,
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
