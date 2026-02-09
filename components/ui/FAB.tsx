import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, SHADOWS, CLAY_BORDER, BORDER_RADIUS } from "@/constants/theme";

interface FABProps {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

export function FAB({ icon, onPress }: FABProps) {
  return (
    <TouchableOpacity
      style={styles.fab}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Ionicons name={icon} size={26} color={COLORS.textOnPrimary} />
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 20,
    bottom: 90,
    width: 60,
    height: 60,
    borderRadius: 22,
    ...SHADOWS.lg,
    ...CLAY_BORDER.medium,
  },
  gradient: {
    width: "100%",
    height: "100%",
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
});
