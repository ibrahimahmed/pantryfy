import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from "@/constants/theme";

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
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <View style={styles.loadingRow}>
          <ActivityIndicator size="small" color="#fff" />
          <Text style={styles.loadingText}>Chef AI is thinking...</Text>
        </View>
      </LinearGradient>
    );
  }

  if (!suggestion) return null;

  return (
    <LinearGradient
      colors={["#667eea", "#764ba2"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.header}>
        <Ionicons name="sparkles" size={18} color="#FFD700" />
        <Text style={styles.headerText}>AI Suggestion</Text>
      </View>
      <Text style={styles.dishName}>{suggestion.dish}</Text>
      <Text style={styles.reason}>{suggestion.reason}</Text>
      <View style={styles.tipRow}>
        <Ionicons name="bulb-outline" size={14} color="rgba(255,255,255,0.8)" />
        <Text style={styles.tip}>{suggestion.tip}</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  loadingText: {
    color: "#fff",
    fontSize: FONT_SIZE.sm,
    fontWeight: "500",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  headerText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: FONT_SIZE.xs,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
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
  tipRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: SPACING.xs,
  },
  tip: {
    color: "rgba(255,255,255,0.8)",
    fontSize: FONT_SIZE.xs,
    flex: 1,
    fontStyle: "italic",
    lineHeight: 18,
  },
});
