import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GroceryItem } from "@/types/grocery";
import * as Haptics from "expo-haptics";
import {
  COLORS,
  SPACING,
  FONT_SIZE,
  BORDER_RADIUS,
  SHADOWS,
  CLAY_BORDER,
} from "@/constants/theme";

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
        <View
          style={[
            styles.checkboxIcon,
            item.checked && styles.checkboxIconChecked,
          ]}
        >
          {item.checked ? (
            <Ionicons
              name="checkmark"
              size={16}
              color={COLORS.textOnPrimary}
            />
          ) : (
            <View style={styles.checkboxEmpty} />
          )}
        </View>
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
        <View
          style={[
            styles.homeIconContainer,
            item.haveAtHome && styles.homeIconActive,
          ]}
        >
          <Ionicons
            name={item.haveAtHome ? "home" : "home-outline"}
            size={16}
            color={item.haveAtHome ? COLORS.textOnPrimary : COLORS.textLight}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.md,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.xs + 1,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.sm,
    ...CLAY_BORDER.subtle,
  },
  rowChecked: {
    opacity: 0.55,
    backgroundColor: COLORS.background,
  },
  checkbox: {
    marginRight: SPACING.sm,
  },
  checkboxIcon: {
    width: 26,
    height: 26,
    borderRadius: 9,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.inset,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
  },
  checkboxIconChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryDark,
  },
  checkboxEmpty: {
    width: 10,
    height: 10,
    borderRadius: 3,
    backgroundColor: COLORS.borderLight,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    fontWeight: "600",
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
    padding: SPACING.xs,
  },
  homeIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.sm,
    ...CLAY_BORDER.subtle,
  },
  homeIconActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryDark,
  },
});
