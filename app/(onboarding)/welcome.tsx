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
import {
  COLORS,
  SPACING,
  FONT_SIZE,
  BORDER_RADIUS,
  SHADOWS,
  CLAY_BORDER,
} from "@/constants/theme";


export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Center section: mockup + text */}
        <View style={styles.centerSection}>
          <View style={styles.mockupContainer}>
            <View style={styles.mockupCard}>
              <LinearGradient
                colors={[COLORS.primaryMuted, COLORS.surface]}
                style={styles.mockupGradient}
              >
                <View style={styles.mockupIconRow}>
                  <Text style={styles.mockupEmoji}>{"\u{1F373}"}</Text>
                  <Text style={styles.mockupEmoji}>{"\u{1F952}"}</Text>
                  <Text style={styles.mockupEmoji}>{"\u{1F96A}"}</Text>
                </View>
                <View style={styles.mockupLines}>
                  <View style={[styles.mockupLine, { width: "80%" }]} />
                  <View style={[styles.mockupLine, { width: "60%" }]} />
                  <View style={[styles.mockupLine, { width: "70%" }]} />
                </View>
              </LinearGradient>
            </View>
          </View>

          <Text style={styles.title}>Save recipes from{"\n"}anywhere</Text>
          <Text style={styles.subtitle}>
            Import recipes from TikTok, YouTube, Instagram, and any website.
            Plan meals and build grocery lists effortlessly.
          </Text>
        </View>

        {/* Bottom section: CTA + login link anchored to bottom */}
        <View style={styles.bottomSection}>
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
              <Text style={styles.ctaText}>Get Started</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => router.replace("/(auth)/signin")}
          >
            <Text style={styles.loginText}>
              Already have an account?{" "}
              <Text style={styles.loginBold}>Log in</Text>
            </Text>
          </TouchableOpacity>
        </View>
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
    justifyContent: "space-between",
  },
  centerSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: SPACING.xl,
  },
  mockupContainer: {
    width: 260,
    height: 260,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.xl,
  },
  mockupCard: {
    width: 200,
    height: 220,
    borderRadius: BORDER_RADIUS.xl,
    overflow: "hidden",
    ...SHADOWS.lg,
    ...CLAY_BORDER.medium,
  },
  mockupGradient: {
    flex: 1,
    padding: SPACING.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  mockupIconRow: {
    flexDirection: "row",
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  mockupEmoji: {
    fontSize: 36,
  },
  mockupLines: {
    width: "100%",
    gap: SPACING.sm,
  },
  mockupLine: {
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.clayHighlight,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "center",
    letterSpacing: -0.5,
    lineHeight: 38,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: SPACING.md,
    lineHeight: 22,
    paddingHorizontal: SPACING.md,
  },
  bottomSection: {
    alignItems: "center",
    paddingBottom: SPACING.lg,
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
    letterSpacing: 0.3,
  },
  loginLink: {
    marginTop: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  loginText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  loginBold: {
    color: COLORS.primary,
    fontWeight: "700",
  },
});
