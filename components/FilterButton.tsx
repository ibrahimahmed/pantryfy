import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFilterStore } from "@/store/filterStore";
import { ChipGroup } from "./ui/ChipGroup";
import { TIME_OPTIONS, CUISINE_OPTIONS, DIET_OPTIONS } from "@/constants/filters";
import {
  COLORS,
  SPACING,
  FONT_SIZE,
  BORDER_RADIUS,
  SHADOWS,
  CLAY_BORDER,
} from "@/constants/theme";

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
        activeOpacity={0.7}
      >
        <View style={styles.buttonIconContainer}>
          <Ionicons name="options-outline" size={16} color={COLORS.primary} />
        </View>
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
            <TouchableOpacity
              onPress={() => setVisible(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={22} color={COLORS.text} />
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
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[COLORS.primary, COLORS.primaryDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.applyGradient}
              >
                <Text style={styles.applyText}>Apply</Text>
              </LinearGradient>
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
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    alignSelf: "flex-start",
    ...SHADOWS.sm,
    ...CLAY_BORDER.subtle,
  },
  buttonIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: COLORS.primaryMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "700",
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
    backgroundColor: COLORS.surface,
    borderBottomLeftRadius: BORDER_RADIUS.lg,
    borderBottomRightRadius: BORDER_RADIUS.lg,
    ...SHADOWS.sm,
  },
  modalTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "800",
    color: COLORS.text,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.sm,
    ...CLAY_BORDER.subtle,
  },
  modalContent: {
    flex: 1,
    padding: SPACING.md,
    paddingTop: SPACING.lg,
  },
  modalFooter: {
    flexDirection: "row",
    gap: SPACING.sm,
    padding: SPACING.md,
  },
  clearButton: {
    flex: 1,
    paddingVertical: SPACING.sm + 4,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    ...SHADOWS.sm,
    ...CLAY_BORDER.subtle,
  },
  clearText: {
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  applyButton: {
    flex: 1,
    borderRadius: BORDER_RADIUS.md,
    overflow: "hidden",
    ...SHADOWS.md,
    ...CLAY_BORDER.light,
  },
  applyGradient: {
    paddingVertical: SPACING.sm + 4,
    borderRadius: BORDER_RADIUS.md,
    alignItems: "center",
  },
  applyText: {
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    color: COLORS.textOnPrimary,
  },
});
