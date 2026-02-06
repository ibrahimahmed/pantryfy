import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS, SPACING } from "@/constants/theme";

interface ContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padded?: boolean;
  safeArea?: boolean;
}

export function Container({
  children,
  style,
  padded = true,
  safeArea = true,
}: ContainerProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        safeArea && { paddingTop: insets.top },
        padded && styles.padded,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  padded: {
    paddingHorizontal: SPACING.md,
  },
});
