import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GroceryItem } from "@/types/grocery";
import * as Haptics from "expo-haptics";
import { COLORS, SPACING, FONT_SIZE } from "@/constants/theme";

interface GroceryListItemProps {
  item: GroceryItem;
  onToggleChecked: (id: string) => void;
  onToggleHaveAtHome: (id: string) => void;
}

export function GroceryListItem({
  item,
  onToggleChecked,
  onToggleHaveAtHome,
}: GroceryListItemProps) {
  const handleCheck = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggleChecked(item.id);
  };

  const handleHaveAtHome = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggleHaveAtHome(item.id);
  };

  return (
    <View style={[styles.row, item.checked && styles.rowChecked]}>
      <TouchableOpacity style={styles.checkbox} onPress={handleCheck}>
        <Ionicons
          name={item.checked ? "checkmark-circle" : "ellipse-outline"}
          size={24}
          color={item.checked ? COLORS.primary : COLORS.border}
        />
      </TouchableOpacity>
      <View style={styles.content}>
        <Text
          style={[styles.name, item.checked && styles.nameChecked]}
          numberOfLines={1}
        >
          {item.quantity > 0 && item.unit
            ? `${item.quantity} ${item.unit} `
            : item.quantity > 1
              ? `${item.quantity} `
              : ""}
          {item.displayName}
        </Text>
        {item.fromRecipes.length > 0 && (
          <Text style={styles.recipes} numberOfLines={1}>
            {item.fromRecipes.join(", ")}
          </Text>
        )}
      </View>
      <TouchableOpacity style={styles.homeButton} onPress={handleHaveAtHome}>
        <Ionicons
          name={item.haveAtHome ? "home" : "home-outline"}
          size={18}
          color={item.haveAtHome ? COLORS.primary : COLORS.textLight}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  rowChecked: {
    opacity: 0.6,
  },
  checkbox: {
    marginRight: SPACING.sm,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    fontWeight: "500",
  },
  nameChecked: {
    textDecorationLine: "line-through",
    color: COLORS.textLight,
  },
  recipes: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
    marginTop: 2,
  },
  homeButton: {
    padding: SPACING.sm,
  },
});
