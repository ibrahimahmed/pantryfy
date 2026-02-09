import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS, CLAY_BORDER } from "@/constants/theme";

interface ChipGroupProps<T> {
  options: readonly { label: string; value: T }[] | readonly string[];
  selected: T | null;
  onSelect: (value: T | null) => void;
  label?: string;
}

export function ChipGroup<T extends string | number | null>({
  options,
  selected,
  onSelect,
  label,
}: ChipGroupProps<T>) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.chips}>
          {options.map((option, index) => {
            const isObject = typeof option === "object" && option !== null;
            const optLabel = isObject
              ? (option as { label: string; value: T }).label
              : (option as string);
            const optValue = isObject
              ? (option as { label: string; value: T }).value
              : (option as unknown as T);
            const isSelected = selected === optValue;

            return (
              <TouchableOpacity
                key={index}
                style={[styles.chip, isSelected && styles.chipSelected]}
                onPress={() => onSelect(isSelected ? null : optValue)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.chipText,
                    isSelected && styles.chipTextSelected,
                  ]}
                >
                  {optLabel}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.sm,
    letterSpacing: 0.3,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
  },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surface,
    ...SHADOWS.sm,
    ...CLAY_BORDER.subtle,
  },
  chipSelected: {
    backgroundColor: COLORS.primaryMuted,
    borderColor: COLORS.primaryLight,
    borderTopColor: "rgba(255,255,255,0.7)",
    borderLeftColor: "rgba(255,255,255,0.6)",
  },
  chipText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  chipTextSelected: {
    color: COLORS.primaryDark,
    fontWeight: "700",
  },
});
