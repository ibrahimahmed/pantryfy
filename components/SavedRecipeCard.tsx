import React from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet, Platform } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { Badge } from "./ui/Badge";
import * as Haptics from "expo-haptics";
import {
  COLORS,
  SPACING,
  FONT_SIZE,
  BORDER_RADIUS,
  SHADOWS,
} from "@/constants/theme";
import { api } from "@/convex/_generated/api";

interface SavedRecipeCardProps {
  recipe: any;
}

export function SavedRecipeCard({ recipe }: SavedRecipeCardProps) {
  const deleteRecipe = useMutation(api.recipes.deleteRecipe);

  const doDelete = async () => {
    await deleteRecipe({ id: recipe._id });
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  };

  const handleDelete = () => {
    if (Platform.OS === "web") {
      if (window.confirm(`Remove "${recipe.title}"?`)) {
        doDelete();
      }
    } else {
      Alert.alert("Delete Recipe", `Remove "${recipe.title}"?`, [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: doDelete },
      ]);
    }
  };

  return (
    <View style={styles.card}>
      {recipe.imageUrl ? (
        <Image
          source={{ uri: recipe.imageUrl }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Ionicons name="restaurant-outline" size={32} color={COLORS.border} />
        </View>
      )}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {recipe.title}
        </Text>
        <View style={styles.meta}>
          <Badge
            color={
              recipe.source === "spoonacular"
                ? "primary"
                : recipe.source === "url"
                  ? "secondary"
                  : "warning"
            }
            small
          >
            {recipe.source}
          </Badge>
          <Text style={styles.ingredientCount}>
            {recipe.ingredients?.length || 0} ingredients
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDelete}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="trash-outline" size={20} color={COLORS.error} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
    overflow: "hidden",
    ...SHADOWS.sm,
  },
  image: {
    width: 90,
    height: 90,
  },
  imagePlaceholder: {
    width: 90,
    height: 90,
    backgroundColor: COLORS.divider,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    padding: SPACING.sm + 2,
    justifyContent: "center",
  },
  title: {
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
    color: COLORS.text,
    lineHeight: 21,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginTop: SPACING.xs,
  },
  ingredientCount: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
  },
  deleteButton: {
    padding: SPACING.sm,
    justifyContent: "center",
  },
});
