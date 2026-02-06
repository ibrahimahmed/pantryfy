import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFilterStore } from "@/store/filterStore";
import { ChipGroup } from "./ui/ChipGroup";
import { TIME_OPTIONS, CUISINE_OPTIONS, DIET_OPTIONS } from "@/constants/filters";
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from "@/constants/theme";

export function FilterButton() {
  const [visible, setVisible] = useState(false);
  const {
    maxTime,
    cuisine,
    diet,
    setMaxTime,
    setCuisine,
    setDiet,
    clearFilters,
    hasFilters,
  } = useFilterStore();

  const activeCount = [maxTime, cuisine, diet].filter(Boolean).length;

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setVisible(true)}
      >
        <Ionicons name="options-outline" size={18} color={COLORS.text} />
        <Text style={styles.buttonText}>
          Filters{activeCount > 0 ? ` (${activeCount})` : ""}
        </Text>
        {activeCount > 0 && <View style={styles.dot} />}
      </TouchableOpacity>

      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filters</Text>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Ionicons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <ChipGroup
              label="Cooking Time"
              options={TIME_OPTIONS as any}
              selected={maxTime}
              onSelect={(val) => setMaxTime(val as number | null)}
            />

            <ChipGroup
              label="Cuisine"
              options={CUISINE_OPTIONS.map((c) => ({ label: c, value: c }))}
              selected={cuisine}
              onSelect={(val) => setCuisine(val)}
            />

            <ChipGroup
              label="Diet"
              options={DIET_OPTIONS.map((d) => ({ label: d, value: d }))}
              selected={diet}
              onSelect={(val) => setDiet(val)}
            />
          </ScrollView>

          <View style={styles.modalFooter}>
            {hasFilters() && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={clearFilters}
              >
                <Text style={styles.clearText}>Clear Filters</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => setVisible(false)}
            >
              <Text style={styles.applyText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm,
  },
  buttonText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
    color: COLORS.text,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  modal: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  modalTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "700",
    color: COLORS.text,
  },
  modalContent: {
    flex: 1,
    padding: SPACING.md,
  },
  modalFooter: {
    flexDirection: "row",
    gap: SPACING.sm,
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  clearButton: {
    flex: 1,
    paddingVertical: SPACING.sm + 4,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: "center",
  },
  clearText: {
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  applyButton: {
    flex: 1,
    paddingVertical: SPACING.sm + 4,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primary,
    alignItems: "center",
  },
  applyText: {
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
    color: "#fff",
  },
});
