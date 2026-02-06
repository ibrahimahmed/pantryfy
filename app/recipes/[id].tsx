import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { getRecipeDetails } from "@/lib/spoonacular";
import { RecipeDetail } from "@/types/recipe";
import { SaveRecipeButton } from "@/components/SaveRecipeButton";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Badge } from "@/components/ui/Badge";
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from "@/constants/theme";

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
      <Image
        source={{ uri: recipe.image }}
        style={styles.heroImage}
        contentFit="cover"
        transition={300}
      />

      <View style={styles.body}>
        <Text style={styles.title}>{recipe.title}</Text>

        {/* Meta Row */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={18} color={COLORS.textSecondary} />
            <Text style={styles.metaText}>{recipe.readyInMinutes} min</Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaItem}>
            <Ionicons name="people-outline" size={18} color={COLORS.textSecondary} />
            <Text style={styles.metaText}>{recipe.servings} servings</Text>
          </View>
          {calories && (
            <>
              <View style={styles.metaDivider} />
              <View style={styles.metaItem}>
                <Ionicons name="flame-outline" size={18} color={COLORS.textSecondary} />
                <Text style={styles.metaText}>
                  {Math.round(calories.amount)} cal
                </Text>
              </View>
            </>
          )}
          {protein && (
            <>
              <View style={styles.metaDivider} />
              <View style={styles.metaItem}>
                <Text style={styles.metaText}>
                  {Math.round(protein.amount)}g protein
                </Text>
              </View>
            </>
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
        <Text style={styles.sectionTitle}>Ingredients</Text>
        <View style={styles.ingredientsList}>
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
            <Text style={styles.sectionTitle}>Instructions</Text>
            {recipe.analyzedInstructions[0].steps.map((step) => (
              <View key={step.number} style={styles.stepRow}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{step.number}</Text>
                </View>
                <Text style={styles.stepText}>{step.step}</Text>
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
    paddingBottom: SPACING.xl * 2,
  },
  heroImage: {
    width,
    height: width * 0.65,
  },
  body: {
    padding: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZE.xl + 2,
    fontWeight: "800",
    color: COLORS.text,
    lineHeight: 32,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: SPACING.md,
    flexWrap: "wrap",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
  },
  metaDivider: {
    width: 1,
    height: 16,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.sm,
  },
  metaText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "700",
    color: COLORS.text,
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  ingredientsList: {
    gap: SPACING.sm,
  },
  ingredientRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: SPACING.sm,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginTop: 8,
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
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  stepNumberText: {
    color: "#fff",
    fontSize: FONT_SIZE.sm,
    fontWeight: "700",
  },
  stepText: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    lineHeight: 22,
  },
});
