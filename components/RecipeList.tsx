import React from "react";
import { View, Text, SectionList, StyleSheet } from "react-native";
import { RecipeMatch } from "@/types/recipe";
import { RecipeCard } from "./RecipeCard";
import { COLORS, SPACING, FONT_SIZE } from "@/constants/theme";

interface RecipeListProps {
  results: {
    canMakeNow: RecipeMatch[];
    almostThere: RecipeMatch[];
    needMore: RecipeMatch[];
  };
}

export function RecipeList({ results }: RecipeListProps) {
  const sections = [
    { title: "Ready to Cook", data: results.canMakeNow, emoji: "\u2705" },
    {
      title: "Almost There (1-2 missing)",
      data: results.almostThere,
      emoji: "\u{1F449}",
    },
    { title: "Need More Ingredients", data: results.needMore, emoji: "\u{1F6D2}" },
  ].filter((s) => s.data.length > 0);

  if (sections.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          No recipes found. Try adding more ingredients.
        </Text>
      </View>
    );
  }

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => String(item.id)}
      renderSectionHeader={({ section }) => (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {section.emoji} {section.title}
          </Text>
          <Text style={styles.sectionCount}>{section.data.length}</Text>
        </View>
      )}
      renderItem={({ item }) => <RecipeCard recipe={item} />}
      contentContainerStyle={styles.list}
      stickySectionHeadersEnabled={false}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.sm,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "700",
    color: COLORS.text,
  },
  sectionCount: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.xl,
  },
  emptyText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
});
