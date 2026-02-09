import React, { useState } from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { RecipeDetail } from "@/types/recipe";
import * as Haptics from "expo-haptics";
import {
  COLORS,
  SPACING,
  FONT_SIZE,
  BORDER_RADIUS,
  SHADOWS,
  CLAY_BORDER,
} from "@/constants/theme";

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

  if (saved) {
    return (
      <View style={styles.savedButton}>
        <Ionicons name="checkmark-circle" size={22} color={COLORS.success} />
        <Text style={styles.savedText}>Saved</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handleSave}
      disabled={saving}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Ionicons name="bookmark-outline" size={20} color={COLORS.textOnPrimary} />
        <Text style={styles.text}>
          {saving ? "Saving..." : "Save Recipe"}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    overflow: "hidden",
    ...SHADOWS.md,
    ...CLAY_BORDER.medium,
  },
  gradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    paddingVertical: SPACING.md + 2,
    borderRadius: BORDER_RADIUS.lg,
  },
  text: {
    color: COLORS.textOnPrimary,
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
  },
  savedButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    marginTop: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.successMuted,
    ...SHADOWS.sm,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.5)",
    borderTopColor: "rgba(255,255,255,0.7)",
  },
  savedText: {
    color: COLORS.success,
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
  },
});
