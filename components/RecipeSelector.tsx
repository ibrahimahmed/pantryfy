import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from "@/constants/theme";

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
          >
            <Text style={styles.actionText}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClear}>
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
      >
        <Ionicons name="list" size={18} color="#fff" />
        <Text style={styles.generateText}>
          Generate List ({selected.length})
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    color: COLORS.text,
  },
  actions: {
    flexDirection: "row",
    gap: SPACING.md,
  },
  actionText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
    color: COLORS.primary,
  },
  chipScroll: {
    gap: SPACING.sm,
    paddingBottom: SPACING.sm,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: SPACING.sm - 1,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    maxWidth: 180,
  },
  chipSelected: {
    borderColor: COLORS.primary,
    backgroundColor: "#E8F5E9",
  },
  chipText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  chipTextSelected: {
    color: COLORS.primaryDark,
    fontWeight: "500",
  },
  generateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm + 2,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.xs,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  generateText: {
    color: "#fff",
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
  },
});
