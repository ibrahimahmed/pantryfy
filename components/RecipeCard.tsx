import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { RecipeMatch } from "@/types/recipe";
import { Badge } from "./ui/Badge";
import {
  COLORS,
  SPACING,
  FONT_SIZE,
  BORDER_RADIUS,
  SHADOWS,
  CLAY_BORDER,
} from "@/constants/theme";

interface RecipeCardProps {
  recipe: RecipeMatch;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const router = useRouter();
  const matchPercent = Math.round(
    (recipe.usedIngredientCount /
      (recipe.usedIngredientCount + recipe.missedIngredientCount)) *
      100
  );

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/recipes/${recipe.id}`)}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: recipe.image }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {recipe.title}
        </Text>
        <View style={styles.badges}>
          {recipe.missedIngredientCount === 0 ? (
            <Badge color="success">Ready to cook!</Badge>
          ) : (
            <Badge color="warning">
              Missing {recipe.missedIngredientCount}
            </Badge>
          )}
          <View style={styles.matchPill}>
            <Text style={styles.matchText}>{matchPercent}%</Text>
          </View>
        </View>
        {recipe.missedIngredients.length > 0 && (
          <Text style={styles.missingText} numberOfLines={1}>
            Need: {recipe.missedIngredients.map((i) => i.name).join(", ")}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.sm + 2,
    overflow: "hidden",
    ...SHADOWS.md,
    ...CLAY_BORDER.medium,
  },
  imageContainer: {
    width: 115,
    height: 115,
    overflow: "hidden",
  },
  image: {
    width: 115,
    height: 115,
  },
  content: {
    flex: 1,
    padding: SPACING.sm + 4,
    justifyContent: "space-between",
  },
  title: {
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    color: COLORS.text,
    lineHeight: 21,
  },
  badges: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginTop: SPACING.xs + 2,
  },
  matchPill: {
    backgroundColor: COLORS.primaryMuted,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.full,
  },
  matchText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.primary,
    fontWeight: "700",
  },
  missingText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
});
