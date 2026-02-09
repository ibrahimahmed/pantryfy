import React from "react";
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import * as Clipboard from "expo-clipboard";
import { useGroceryStore } from "@/store/groceryStore";
import {
  aggregateGroceryList,
  groupByCategory,
} from "@/lib/groceryAggregator";
import { RecipeSelector } from "@/components/RecipeSelector";
import { GroceryListItem } from "@/components/GroceryListItem";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { GROCERY_CATEGORIES } from "@/constants/categories";
import {
  COLORS,
  SPACING,
  FONT_SIZE,
  BORDER_RADIUS,
  SHADOWS,
  CLAY_BORDER,
} from "@/constants/theme";
import { api } from "@/convex/_generated/api";

export default function GroceryScreen() {
  const savedRecipes = useQuery(api.recipes.getSavedRecipes);
  const {
    selectedRecipeIds,
    groceryList,
    setGroceryList,
    toggleRecipe,
    selectAllRecipes,
    clearSelection,
    toggleChecked,
    toggleHaveAtHome,
    clearGroceryList,
  } = useGroceryStore();

  const handleGenerate = () => {
    if (!savedRecipes) return;
    const selected = savedRecipes.filter((r) =>
      selectedRecipeIds.includes(r._id)
    );
    const aggregated = aggregateGroceryList(selected as any);
    setGroceryList(aggregated);
  };

  const handleCopy = async () => {
    const text = groceryList
      .filter((i) => !i.haveAtHome && !i.checked)
      .map(
        (i) =>
          `${i.quantity > 0 ? i.quantity : ""} ${i.unit} ${i.displayName}`.trim()
      )
      .join("\n");
    await Clipboard.setStringAsync(text);
    Alert.alert("Copied!", "Grocery list copied to clipboard");
  };

  if (savedRecipes === undefined) return <LoadingSpinner />;

  const visibleItems = groceryList.filter((item) => !item.haveAtHome);
  const grouped = groupByCategory(visibleItems);
  const checkedCount = groceryList.filter((i) => i.checked).length;
  const totalCount = visibleItems.length;

  return (
    <View style={styles.container}>
      {savedRecipes.length === 0 ? (
        <EmptyState
          icon="cart-outline"
          title="No recipes saved"
          message="Save some recipes first, then generate a grocery list"
        />
      ) : (
        <>
          <RecipeSelector
            recipes={savedRecipes}
            selected={selectedRecipeIds}
            onToggle={toggleRecipe}
            onSelectAll={selectAllRecipes}
            onClear={clearSelection}
            onGenerate={handleGenerate}
          />

          {groceryList.length > 0 ? (
            <>
              <View style={styles.listHeader}>
                <View style={styles.progressPill}>
                  <Text style={styles.progressText}>
                    {checkedCount}/{totalCount} items
                  </Text>
                </View>
                <View style={styles.listActions}>
                  <TouchableOpacity onPress={handleCopy} style={styles.action}>
                    <Ionicons
                      name="copy-outline"
                      size={18}
                      color={COLORS.primary}
                    />
                    <Text style={styles.actionText}>Copy</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={clearGroceryList}
                    style={styles.action}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={18}
                      color={COLORS.error}
                    />
                    <Text style={[styles.actionText, { color: COLORS.error }]}>
                      Clear
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <SectionList
                sections={grouped.map((g) => ({
                  title: g.category,
                  data: g.items,
                }))}
                keyExtractor={(item) => item.id}
                renderSectionHeader={({ section }) => (
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionEmoji}>
                      {
                        GROCERY_CATEGORIES[
                          section.title as keyof typeof GROCERY_CATEGORIES
                        ]?.emoji
                      }
                    </Text>
                    <Text style={styles.sectionTitle}>
                      {
                        GROCERY_CATEGORIES[
                          section.title as keyof typeof GROCERY_CATEGORIES
                        ]?.label
                      }
                    </Text>
                    <View style={styles.sectionCountPill}>
                      <Text style={styles.sectionCount}>
                        {section.data.length}
                      </Text>
                    </View>
                  </View>
                )}
                renderItem={({ item }) => (
                  <GroceryListItem
                    item={item}
                    onToggleChecked={toggleChecked}
                    onToggleHaveAtHome={toggleHaveAtHome}
                  />
                )}
                contentContainerStyle={styles.list}
                stickySectionHeadersEnabled={false}
                showsVerticalScrollIndicator={false}
              />
            </>
          ) : (
            <View style={styles.emptyList}>
              <View style={styles.emptyIcon}>
                <Ionicons
                  name="list-outline"
                  size={40}
                  color={COLORS.textLight}
                />
              </View>
              <Text style={styles.emptyText}>
                Select recipes above and tap "Generate List"
              </Text>
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.sm,
    ...CLAY_BORDER.subtle,
  },
  progressPill: {
    backgroundColor: COLORS.primaryMuted,
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },
  progressText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "700",
    color: COLORS.primary,
  },
  listActions: {
    flexDirection: "row",
    gap: SPACING.md,
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
  },
  actionText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
    color: COLORS.primary,
  },
  list: {
    paddingBottom: SPACING.xl * 4,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md + 4,
    paddingVertical: SPACING.sm + 2,
    marginTop: SPACING.sm,
  },
  sectionEmoji: {
    fontSize: 20,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    color: COLORS.text,
    flex: 1,
  },
  sectionCountPill: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.full,
    ...SHADOWS.sm,
  },
  sectionCount: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  emptyList: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.xl,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.xl,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.md,
    ...SHADOWS.md,
    ...CLAY_BORDER.medium,
  },
  emptyText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
});
