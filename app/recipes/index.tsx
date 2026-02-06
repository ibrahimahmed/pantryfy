import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useIngredientStore } from "@/store/ingredientStore";
import { useFilterStore } from "@/store/filterStore";
import { useRecipeSearch } from "@/hooks/useRecipeSearch";
import { useAISuggestion } from "@/hooks/useAISuggestion";
import { RecipeList } from "@/components/RecipeList";
import { SmartSuggestion } from "@/components/SmartSuggestion";
import { FilterButton } from "@/components/FilterButton";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { EmptyState } from "@/components/ui/EmptyState";
import { COLORS, SPACING } from "@/constants/theme";

export default function RecipesScreen() {
  const { selected } = useIngredientStore();
  const { maxTime, cuisine, diet } = useFilterStore();
  const { search, loading, error, results } = useRecipeSearch();
  const {
    fetchSuggestion,
    loading: aiLoading,
    suggestion,
  } = useAISuggestion();

  const ingredientNames = selected.map((i) => i.name);

  useEffect(() => {
    if (ingredientNames.length > 0) {
      search(ingredientNames, {
        maxTime: maxTime ?? undefined,
        cuisine: cuisine ?? undefined,
        diet: diet ?? undefined,
      });
      fetchSuggestion(ingredientNames);
    }
  }, [maxTime, cuisine, diet]);

  useEffect(() => {
    if (ingredientNames.length > 0) {
      search(ingredientNames, {
        maxTime: maxTime ?? undefined,
        cuisine: cuisine ?? undefined,
        diet: diet ?? undefined,
      });
      fetchSuggestion(ingredientNames);
    }
  }, []);

  if (loading) return <LoadingSpinner message="Finding recipes..." />;
  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={() =>
          search(ingredientNames, {
            maxTime: maxTime ?? undefined,
            cuisine: cuisine ?? undefined,
            diet: diet ?? undefined,
          })
        }
      />
    );
  }
  if (!results) {
    return <EmptyState message="Add ingredients to search for recipes" />;
  }

  return (
    <View style={styles.container}>
      <SmartSuggestion loading={aiLoading} suggestion={suggestion} />
      <FilterButton />
      <RecipeList results={results} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
