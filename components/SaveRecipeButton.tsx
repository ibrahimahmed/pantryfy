import React, { useState } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { RecipeDetail } from "@/types/recipe";
import * as Haptics from "expo-haptics";
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from "@/constants/theme";

interface SaveRecipeButtonProps {
  recipe: RecipeDetail;
}

export function SaveRecipeButton({ recipe }: SaveRecipeButtonProps) {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const saveRecipe = useMutation(api.recipes.saveRecipe);

  const handleSave = async () => {
    if (saved || saving) return;
    setSaving(true);
    try {
      await saveRecipe({
        title: recipe.title,
        source: "spoonacular",
        spoonacularId: recipe.id,
        imageUrl: recipe.image,
        sourceUrl: recipe.sourceUrl,
        ingredients: recipe.extendedIngredients.map((i) => ({
          name: i.name,
          quantity: i.amount,
          unit: i.unit,
          raw: i.original,
        })),
        servings: recipe.servings,
      });
      setSaved(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) {
      console.error("Failed to save recipe:", e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, saved && styles.savedButton]}
      onPress={handleSave}
      disabled={saved || saving}
      activeOpacity={0.8}
    >
      <Ionicons
        name={saved ? "checkmark-circle" : "bookmark-outline"}
        size={20}
        color={saved ? COLORS.primary : "#fff"}
      />
      <Text style={[styles.text, saved && styles.savedText]}>
        {saving ? "Saving..." : saved ? "Saved" : "Save Recipe"}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.lg,
  },
  savedButton: {
    backgroundColor: "#E8F5E9",
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  text: {
    color: "#fff",
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
  },
  savedText: {
    color: COLORS.primary,
  },
});
