import React from "react";
import { View, Text, SectionList, StyleSheet } from "react-native";
import { RecipeMatch } from "@/types/recipe";
import { RecipeCard } from "./RecipeCard";
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS, CLAY_BORDER } from "@/constants/theme";

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
    {
      title: "Need More Ingredients",
      data: results.needMore,
      emoji: "\u{1F6D2}",
    },
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
          <View style={styles.sectionLeft}>
            <Text style={styles.sectionEmoji}>{section.emoji}</Text>
            <Text style={styles.sectionTitle}>{section.title}</Text>
          </View>
          <View style={styles.sectionCountPill}>
            <Text style={styles.sectionCount}>{section.data.length}</Text>
          </View>
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
    paddingBottom: SPACING.xl * 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.sm + 2,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs + 2,
  },
  sectionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  sectionEmoji: {
    fontSize: 20,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "800",
    color: COLORS.text,
  },
  sectionCountPill: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    ...SHADOWS.sm,
    ...CLAY_BORDER.subtle,
  },
  sectionCount: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontWeight: "700",
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
