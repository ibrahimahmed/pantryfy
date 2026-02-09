import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, StyleSheet, Dimensions } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { getRecipeDetails } from "@/lib/spoonacular";
import { RecipeDetail } from "@/types/recipe";
import { SaveRecipeButton } from "@/components/SaveRecipeButton";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Badge } from "@/components/ui/Badge";
import {
  COLORS,
  SPACING,
  FONT_SIZE,
  BORDER_RADIUS,
  SHADOWS,
  CLAY_BORDER,
} from "@/constants/theme";

const { width } = Dimensions.get("window");

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipe = () => {
    setLoading(true);
    setError(null);
    getRecipeDetails(Number(id))
      .then(setRecipe)
      .catch(() => setError("Failed to load recipe details"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  if (loading) return <LoadingSpinner message="Loading recipe..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchRecipe} />;
  if (!recipe) return <ErrorMessage message="Recipe not found" />;

  const calories = recipe.nutrition?.nutrients?.find(
    (n) => n.name === "Calories"
  );
  const protein = recipe.nutrition?.nutrients?.find(
    (n) => n.name === "Protein"
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: recipe.image }}
          style={styles.heroImage}
          contentFit="cover"
          transition={300}
        />
      </View>

      <View style={styles.body}>
        <Text style={styles.title}>{recipe.title}</Text>

        {/* Meta Row */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <View style={styles.metaIconContainer}>
              <Ionicons
                name="time-outline"
                size={16}
                color={COLORS.primary}
              />
            </View>
            <Text style={styles.metaText}>{recipe.readyInMinutes} min</Text>
          </View>
          <View style={styles.metaItem}>
            <View style={styles.metaIconContainer}>
              <Ionicons
                name="people-outline"
                size={16}
                color={COLORS.primary}
              />
            </View>
            <Text style={styles.metaText}>{recipe.servings} servings</Text>
          </View>
          {calories && (
            <View style={styles.metaItem}>
              <View style={styles.metaIconContainer}>
                <Ionicons
                  name="flame-outline"
                  size={16}
                  color={COLORS.secondary}
                />
              </View>
              <Text style={styles.metaText}>
                {Math.round(calories.amount)} cal
              </Text>
            </View>
          )}
          {protein && (
            <View style={styles.metaItem}>
              <View style={styles.metaIconContainer}>
                <Ionicons
                  name="fitness-outline"
                  size={16}
                  color={COLORS.success}
                />
              </View>
              <Text style={styles.metaText}>
                {Math.round(protein.amount)}g protein
              </Text>
            </View>
          )}
        </View>

        {/* Tags */}
        {(recipe.cuisines.length > 0 || recipe.diets.length > 0) && (
          <View style={styles.tags}>
            {recipe.cuisines.map((c) => (
              <Badge key={c} color="secondary" small>
                {c}
              </Badge>
            ))}
            {recipe.diets.map((d) => (
              <Badge key={d} color="primary" small>
                {d}
              </Badge>
            ))}
          </View>
        )}

        {/* Ingredients */}
        <View style={styles.sectionHeaderRow}>
          <Ionicons name="restaurant-outline" size={18} color={COLORS.primary} />
          <Text style={styles.sectionTitle}>Ingredients</Text>
        </View>
        <View style={styles.ingredientsCard}>
          {recipe.extendedIngredients.map((ing, idx) => (
            <View key={`${ing.id}-${idx}`} style={styles.ingredientRow}>
              <View style={styles.bullet} />
              <Text style={styles.ingredientText}>{ing.original}</Text>
            </View>
          ))}
        </View>

        {/* Instructions */}
        {recipe.analyzedInstructions?.[0]?.steps && (
          <>
            <View style={styles.sectionHeaderRow}>
              <Ionicons
                name="list-outline"
                size={18}
                color={COLORS.secondary}
              />
              <Text style={styles.sectionTitle}>Instructions</Text>
            </View>
            {recipe.analyzedInstructions[0].steps.map((step) => (
              <View key={step.number} style={styles.stepRow}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{step.number}</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepText}>{step.step}</Text>
                </View>
              </View>
            ))}
          </>
        )}

        {/* Save Button */}
        <SaveRecipeButton recipe={recipe} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingBottom: SPACING.xl * 3,
  },
  imageContainer: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm,
    borderRadius: BORDER_RADIUS.xl,
    overflow: "hidden",
    ...SHADOWS.lg,
    ...CLAY_BORDER.medium,
  },
  heroImage: {
    width: "100%",
    height: width * 0.6,
  },
  body: {
    padding: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZE.xl + 2,
    fontWeight: "800",
    color: COLORS.text,
    lineHeight: 32,
    letterSpacing: -0.3,
    marginTop: SPACING.sm,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: SPACING.md,
    flexWrap: "wrap",
    gap: SPACING.sm,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: SPACING.xs + 2,
    borderRadius: BORDER_RADIUS.sm,
    ...SHADOWS.sm,
    ...CLAY_BORDER.subtle,
  },
  metaIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
  },
  metaText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginTop: SPACING.lg + 4,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "800",
    color: COLORS.text,
  },
  ingredientsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    gap: SPACING.sm + 2,
    ...SHADOWS.md,
    ...CLAY_BORDER.medium,
  },
  ingredientRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: SPACING.sm,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginTop: 7,
  },
  ingredientText: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    lineHeight: 22,
  },
  stepRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    ...SHADOWS.sm,
    ...CLAY_BORDER.light,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: COLORS.primaryMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumberText: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.sm,
    fontWeight: "800",
  },
  stepContent: {
    flex: 1,
  },
  stepText: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    lineHeight: 22,
  },
});
