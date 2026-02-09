import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS, CLAY_BORDER } from "@/constants/theme";

interface SmartSuggestionProps {
  loading: boolean;
  suggestion: {
    dish: string;
    reason: string;
    tip: string;
  } | null;
  error?: string | null;
}

export function SmartSuggestion({
  loading,
  suggestion,
  error,
}: SmartSuggestionProps) {
  if (error) return null;

  if (loading) {
    return (
      <View style={styles.outerWrapper}>
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.container}
        >
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color="#fff" />
            <Text style={styles.loadingText}>Chef AI is thinking...</Text>
          </View>
        </LinearGradient>
      </View>
    );
  }

  if (!suggestion) return null;

  return (
    <View style={styles.outerWrapper}>
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <View style={styles.header}>
          <View style={styles.sparkleContainer}>
            <Ionicons name="sparkles" size={16} color={COLORS.accent} />
          </View>
          <Text style={styles.headerText}>AI Suggestion</Text>
        </View>
        <Text style={styles.dishName}>{suggestion.dish}</Text>
        <Text style={styles.reason}>{suggestion.reason}</Text>
        <View style={styles.tipContainer}>
          <View style={styles.tipRow}>
            <Ionicons
              name="bulb-outline"
              size={14}
              color="rgba(255,255,255,0.85)"
            />
            <Text style={styles.tip}>{suggestion.tip}</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  outerWrapper: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    borderRadius: BORDER_RADIUS.xl,
    ...SHADOWS.lg,
    ...CLAY_BORDER.medium,
  },
  container: {
    padding: SPACING.md + 2,
    borderRadius: BORDER_RADIUS.xl,
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  loadingText: {
    color: "#fff",
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  sparkleContainer: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: FONT_SIZE.xs,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  dishName: {
    color: "#fff",
    fontSize: FONT_SIZE.xl,
    fontWeight: "800",
    marginBottom: SPACING.xs,
  },
  reason: {
    color: "rgba(255,255,255,0.9)",
    fontSize: FONT_SIZE.sm,
    lineHeight: 20,
    marginBottom: SPACING.sm,
  },
  tipContainer: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.sm,
  },
  tipRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: SPACING.xs,
  },
  tip: {
    color: "rgba(255,255,255,0.85)",
    fontSize: FONT_SIZE.xs,
    flex: 1,
    fontStyle: "italic",
    lineHeight: 18,
  },
});
