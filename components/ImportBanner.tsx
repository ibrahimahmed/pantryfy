import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  COLORS,
  SPACING,
  FONT_SIZE,
  BORDER_RADIUS,
  SHADOWS,
  CLAY_BORDER,
} from "@/constants/theme";

const PLATFORM_ICONS = [
  { name: "logo-instagram", color: "#C13584" },
  { name: "logo-tiktok", color: "#000" },
  { name: "logo-youtube", color: "#FF0000" },
  { name: "globe-outline", color: COLORS.primary },
];

interface ImportBannerProps {
  onPress: () => void;
}

export function ImportBanner({ onPress }: ImportBannerProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <LinearGradient
        colors={[COLORS.primaryMuted, COLORS.backgroundWarm]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.textContent}>
          <Text style={styles.title}>Import recipes{"\n"}anywhere</Text>
          <Text style={styles.subtitle}>
            Paste a link from any site or social platform
          </Text>
        </View>
        <View style={styles.iconsColumn}>
          {PLATFORM_ICONS.map((icon) => (
            <View key={icon.name} style={styles.iconBubble}>
              <Ionicons name={icon.name as any} size={18} color={icon.color} />
            </View>
          ))}
        </View>
        <View style={styles.arrowCircle}>
          <Ionicons
            name="arrow-forward"
            size={18}
            color={COLORS.primary}
          />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BORDER_RADIUS.xl,
    overflow: "hidden",
    ...SHADOWS.md,
    ...CLAY_BORDER.medium,
  },
  gradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
  },
  textContent: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "800",
    color: COLORS.text,
    lineHeight: 26,
  },
  subtitle: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    lineHeight: 18,
  },
  iconsColumn: {
    flexDirection: "column",
    gap: 6,
    marginRight: SPACING.sm,
  },
  iconBubble: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceElevated,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.sm,
  },
  arrowCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surfaceElevated,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.sm,
  },
});
