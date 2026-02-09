import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useIngredientStore } from "@/store/ingredientStore";
import { useFilterStore } from "@/store/filterStore";
import { useRecipeSearch } from "@/hooks/useRecipeSearch";
import { useAISuggestion } from "@/hooks/useAISuggestion";
import { RecipeList } from "@/components/RecipeList";
import { SmartSuggestion } from "@/components/SmartSuggestion";
import { FilterButton } from "@/components/FilterButton";
import { SelectedIngredients } from "@/components/SelectedIngredients";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import {
  COLORS,
  SPACING,
  FONT_SIZE,
  BORDER_RADIUS,
  SHADOWS,
  CLAY_BORDER,
} from "@/constants/theme";

const QUICK_INGREDIENTS = [
  "Chicken",
  "Rice",
  "Eggs",
  "Pasta",
  "Tomato",
  "Onion",
  "Garlic",
  "Cheese",
  "Potato",
  "Broccoli",
  "Bell Pepper",
  "Salmon",
];

export default function RecipesScreen() {
  const { selected, addIngredient, removeIngredient, clearAll } =
    useIngredientStore();
  const { maxTime, cuisine, diet } = useFilterStore();
  const { search, loading, error, results, reset } = useRecipeSearch();
  const {
    fetchSuggestion,
    loading: aiLoading,
    suggestion,
  } = useAISuggestion();

  const [inputValue, setInputValue] = useState("");

  const ingredientNames = selected.map((i) => i.name);

  const doSearch = useCallback(() => {
    if (ingredientNames.length === 0) return;
    search(ingredientNames, {
      maxTime: maxTime ?? undefined,
      cuisine: cuisine ?? undefined,
      diet: diet ?? undefined,
    });
    fetchSuggestion(ingredientNames);
  }, [ingredientNames.join(","), maxTime, cuisine, diet]);

  // Re-search when filters change (only if ingredients exist)
  useEffect(() => {
    if (ingredientNames.length > 0 && results) {
      doSearch();
    }
  }, [maxTime, cuisine, diet]);

  const handleAddIngredient = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    // Prevent duplicates
    if (selected.some((s) => s.name.toLowerCase() === trimmed.toLowerCase()))
      return;
    addIngredient({ id: trimmed.toLowerCase(), name: trimmed });
    setInputValue("");
  };

  const handleSubmitInput = () => {
    if (inputValue.trim()) {
      handleAddIngredient(inputValue);
    }
  };

  const handleSearch = () => {
    doSearch();
  };

  const handleClearAll = () => {
    clearAll();
    reset();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Search Input Section */}
      <View style={styles.searchSection}>
        <Text style={styles.title}>Search by Ingredients</Text>
        <Text style={styles.subtitle}>
          Add what's in your fridge and find recipes
        </Text>

        {/* Text input row */}
        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <Ionicons
              name="search"
              size={18}
              color={COLORS.textLight}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Type an ingredient..."
              placeholderTextColor={COLORS.textLight}
              value={inputValue}
              onChangeText={setInputValue}
              onSubmitEditing={handleSubmitInput}
              returnKeyType="done"
              autoCapitalize="words"
              autoCorrect={false}
            />
            {inputValue.length > 0 && (
              <TouchableOpacity
                onPress={() => setInputValue("")}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons
                  name="close-circle"
                  size={18}
                  color={COLORS.textLight}
                />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            style={[
              styles.addButton,
              !inputValue.trim() && styles.addButtonDisabled,
            ]}
            onPress={handleSubmitInput}
            disabled={!inputValue.trim()}
            activeOpacity={0.7}
          >
            <Ionicons
              name="add"
              size={22}
              color={
                inputValue.trim() ? COLORS.textOnPrimary : COLORS.textLight
              }
            />
          </TouchableOpacity>
        </View>

        {/* Quick-add chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickChips}
        >
          {QUICK_INGREDIENTS.filter(
            (q) =>
              !selected.some(
                (s) => s.name.toLowerCase() === q.toLowerCase()
              )
          ).map((name) => (
            <TouchableOpacity
              key={name}
              style={styles.quickChip}
              onPress={() => handleAddIngredient(name)}
              activeOpacity={0.7}
            >
              <Ionicons name="add" size={14} color={COLORS.primary} />
              <Text style={styles.quickChipText}>{name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Selected ingredients */}
        <SelectedIngredients
          ingredients={selected}
          onRemove={removeIngredient}
          onClearAll={handleClearAll}
        />

        {/* Search button */}
        {selected.length > 0 && (
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearch}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <View style={styles.searchButtonInner}>
                <LoadingSpinner />
              </View>
            ) : (
              <View style={styles.searchButtonInner}>
                <Ionicons
                  name="search"
                  size={18}
                  color={COLORS.textOnPrimary}
                />
                <Text style={styles.searchButtonText}>
                  Find Recipes ({selected.length} ingredient
                  {selected.length !== 1 ? "s" : ""})
                </Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Results Section */}
      {loading && <LoadingSpinner message="Finding recipes..." />}
      {error && !loading && (
        <ErrorMessage message={error} onRetry={doSearch} />
      )}
      {results && !loading && !error && (
        <View style={styles.resultsContainer}>
          <SmartSuggestion loading={aiLoading} suggestion={suggestion} />
          <FilterButton />
          <RecipeList results={results} />
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  searchSection: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "800",
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
    marginBottom: SPACING.md,
  },
  inputRow: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
    height: 48,
    ...SHADOWS.sm,
    ...CLAY_BORDER.medium,
  },
  inputIcon: {
    marginRight: SPACING.sm,
  },
  textInput: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    height: 48,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.sm,
    ...CLAY_BORDER.light,
  },
  addButtonDisabled: {
    backgroundColor: COLORS.surface,
  },
  quickChips: {
    flexDirection: "row",
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
  },
  quickChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.primaryMuted,
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: SPACING.xs + 2,
    borderRadius: BORDER_RADIUS.full,
    ...CLAY_BORDER.subtle,
  },
  quickChipText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.primary,
    fontWeight: "600",
  },
  searchButton: {
    marginTop: SPACING.md,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md,
    ...SHADOWS.md,
    ...CLAY_BORDER.light,
  },
  searchButtonInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
  },
  searchButtonText: {
    color: COLORS.textOnPrimary,
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
  },
  resultsContainer: {
    flex: 1,
  },
});
