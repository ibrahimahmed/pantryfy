import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from "@/constants/theme";

interface IngredientChipProps {
  name: string;
  onRemove: () => void;
}

export function IngredientChip({ name, onRemove }: IngredientChipProps) {
  return (
    <TouchableOpacity
      style={styles.chip}
      onPress={onRemove}
      activeOpacity={0.7}
    >
      <Text style={styles.text}>{name}</Text>
      <Ionicons name="close" size={16} color={COLORS.primary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
    backgroundColor: "#E8F5E9",
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: SPACING.sm - 1,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  text: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primaryDark,
    fontWeight: "500",
  },
});
