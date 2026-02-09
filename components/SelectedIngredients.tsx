import React from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { IngredientChip } from "./IngredientChip";
import { SelectedIngredient } from "@/types";
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS, CLAY_BORDER } from "@/constants/theme";

interface SelectedIngredientsProps {
  ingredients: SelectedIngredient[];
  onRemove: (id: string) => void;
  onClearAll: () => void;
}

export function SelectedIngredients({
  ingredients,
  onRemove,
  onClearAll,
}: SelectedIngredientsProps) {
  if (ingredients.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          Add ingredients from your fridge above
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.countPill}>
          <Text style={styles.count}>
            {ingredients.length} ingredient
            {ingredients.length !== 1 ? "s" : ""}
          </Text>
        </View>
        <TouchableOpacity onPress={onClearAll} style={styles.clearButton}>
          <Text style={styles.clearText}>Clear all</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipScroll}
      >
        {ingredients.map((ing) => (
          <IngredientChip
            key={ing.id}
            name={ing.name}
            onRemove={() => onRemove(ing.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: SPACING.md + 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.sm + 2,
  },
  countPill: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    ...SHADOWS.sm,
    ...CLAY_BORDER.subtle,
  },
  count: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  clearButton: {
    backgroundColor: COLORS.errorMuted,
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    ...SHADOWS.sm,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
  },
  clearText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.error,
    fontWeight: "600",
  },
  chipScroll: {
    flexDirection: "row",
    gap: SPACING.sm,
    paddingBottom: SPACING.xs,
  },
  emptyContainer: {
    marginTop: SPACING.md,
    padding: SPACING.lg,
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.inset,
    ...CLAY_BORDER.subtle,
  },
  emptyText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    fontWeight: "500",
  },
});
