import React, { useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { SavedRecipeCard } from "@/components/SavedRecipeCard";
import { SaveRecipeSheet } from "@/components/SaveRecipeSheet";
import { FAB } from "@/components/ui/FAB";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { COLORS, SPACING } from "@/constants/theme";

export default function SavedScreen() {
  const recipes = useQuery(api.recipes.getSavedRecipes);
  const [sheetOpen, setSheetOpen] = useState(false);

  if (recipes === undefined) return <LoadingSpinner message="Loading saved recipes..." />;

  return (
    <View style={styles.container}>
      {recipes.length === 0 ? (
        <EmptyState
          icon="bookmark-outline"
          title="No saved recipes"
          message="Save recipes from search or add your own"
          actionLabel="Add Recipe"
          onAction={() => setSheetOpen(true)}
        />
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <SavedRecipeCard recipe={item} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
      <FAB icon="add" onPress={() => setSheetOpen(true)} />
      <SaveRecipeSheet
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  list: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl * 3,
  },
});
