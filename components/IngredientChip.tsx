import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS, CLAY_BORDER } from "@/constants/theme";

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
      <Ionicons name="close" size={15} color={COLORS.primaryDark} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs + 1,
    backgroundColor: COLORS.primaryMuted,
    paddingHorizontal: SPACING.sm + 4,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    ...SHADOWS.sm,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.6)",
    borderTopColor: "rgba(255,255,255,0.8)",
    borderLeftColor: "rgba(255,255,255,0.75)",
  },
  text: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primaryDark,
    fontWeight: "600",
  },
});
