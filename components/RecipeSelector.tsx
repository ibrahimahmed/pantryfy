import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
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

interface RecipeSelectorProps {
  recipes: any[];
  selected: string[];
  onToggle: (id: string) => void;
  onSelectAll: (ids: string[]) => void;
  onClear: () => void;
  onGenerate: () => void;
}

export function RecipeSelector({
  recipes,
  selected,
  onToggle,
  onSelectAll,
  onClear,
  onGenerate,
}: RecipeSelectorProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Select Recipes</Text>
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => onSelectAll(recipes.map((r) => r._id))}
            style={styles.actionPill}
          >
            <Text style={styles.actionText}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClear} style={styles.actionPillDanger}>
            <Text style={[styles.actionText, { color: COLORS.error }]}>
              Clear
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipScroll}
      >
        {recipes.map((recipe) => {
          const isSelected = selected.includes(recipe._id);
          return (
            <TouchableOpacity
              key={recipe._id}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => onToggle(recipe._id)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isSelected ? "checkmark-circle" : "ellipse-outline"}
                size={16}
                color={isSelected ? COLORS.primary : COLORS.textLight}
              />
              <Text
                style={[
                  styles.chipText,
                  isSelected && styles.chipTextSelected,
                ]}
                numberOfLines={1}
              >
                {recipe.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <TouchableOpacity
        style={[
          styles.generateButton,
          selected.length === 0 && styles.buttonDisabled,
        ]}
        onPress={onGenerate}
        disabled={selected.length === 0}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={
            selected.length > 0
              ? [COLORS.primary, COLORS.primaryDark]
              : [COLORS.border, COLORS.border]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.generateGradient}
        >
          <Ionicons name="list" size={18} color={COLORS.textOnPrimary} />
          <Text style={styles.generateText}>
            Generate List ({selected.length})
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.md,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    ...SHADOWS.md,
    ...CLAY_BORDER.medium,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.sm + 2,
  },
  title: {
    fontSize: FONT_SIZE.md,
    fontWeight: "800",
    color: COLORS.text,
  },
  actions: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  actionPill: {
    backgroundColor: COLORS.primaryMuted,
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    ...SHADOWS.sm,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
  },
  actionPillDanger: {
    backgroundColor: COLORS.errorMuted,
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    ...SHADOWS.sm,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
  },
  actionText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: "700",
    color: COLORS.primary,
  },
  chipScroll: {
    gap: SPACING.sm,
    paddingBottom: SPACING.sm,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs + 1,
    paddingHorizontal: SPACING.sm + 4,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.background,
    maxWidth: 180,
    ...SHADOWS.sm,
    ...CLAY_BORDER.subtle,
  },
  chipSelected: {
    backgroundColor: COLORS.primaryMuted,
    borderColor: COLORS.primaryLight,
    borderTopColor: "rgba(255,255,255,0.7)",
    borderLeftColor: "rgba(255,255,255,0.6)",
  },
  chipText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  chipTextSelected: {
    color: COLORS.primaryDark,
    fontWeight: "700",
  },
  generateButton: {
    marginTop: SPACING.xs + 2,
    borderRadius: BORDER_RADIUS.md,
    overflow: "hidden",
    ...SHADOWS.sm,
    ...CLAY_BORDER.light,
  },
  generateGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    paddingVertical: SPACING.sm + 4,
    borderRadius: BORDER_RADIUS.md,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  generateText: {
    color: COLORS.textOnPrimary,
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
  },
});
