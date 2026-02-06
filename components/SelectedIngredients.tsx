import React from "react";
import { View, ScrollView, Text, TouchableOpacity, StyleSheet } from "react-native";
import { IngredientChip } from "./IngredientChip";
import { SelectedIngredient } from "@/types";
import { COLORS, SPACING, FONT_SIZE } from "@/constants/theme";

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
        <Text style={styles.count}>
          {ingredients.length} ingredient{ingredients.length !== 1 ? "s" : ""}
        </Text>
        <TouchableOpacity onPress={onClearAll}>
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
    marginTop: SPACING.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  count: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  clearText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.error,
    fontWeight: "500",
  },
  chipScroll: {
    flexDirection: "row",
    gap: SPACING.sm,
    paddingBottom: SPACING.xs,
  },
  emptyContainer: {
    marginTop: SPACING.md,
    padding: SPACING.md,
    alignItems: "center",
  },
  emptyText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
  },
});
