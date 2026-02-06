import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Container } from "@/components/ui/Container";
import { IngredientInput } from "@/components/IngredientInput";
import { SelectedIngredients } from "@/components/SelectedIngredients";
import { useIngredientStore } from "@/store/ingredientStore";
import { COLORS, SPACING, FONT_SIZE } from "@/constants/theme";

export default function HomeScreen() {
  const router = useRouter();
  const { selected, addIngredient, removeIngredient, clearAll } =
    useIngredientStore();

  const handleSearch = () => {
    if (selected.length > 0) {
      router.push("/recipes");
    }
  };

  return (
    <Container safeArea={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.heroSection}>
            <LinearGradient
              colors={["#E8F5E9", "#FAFAFA"]}
              style={styles.heroBg}
            />
            <Text style={styles.heroEmoji}>{"\u{1F373}"}</Text>
            <Text style={styles.heroTitle}>What's in your fridge?</Text>
            <Text style={styles.heroSubtitle}>
              Add ingredients and we'll find recipes you can make
            </Text>
          </View>

          <View style={styles.inputSection}>
            <IngredientInput
              onAdd={addIngredient}
              selectedIds={selected.map((s) => s.id)}
            />

            <SelectedIngredients
              ingredients={selected}
              onRemove={removeIngredient}
              onClearAll={clearAll}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.searchButton,
              selected.length === 0 && styles.searchButtonDisabled,
            ]}
            onPress={handleSearch}
            disabled={selected.length === 0}
            activeOpacity={0.8}
          >
            <Ionicons name="search" size={20} color="#fff" />
            <Text style={styles.searchButtonText}>Find Recipes</Text>
          </TouchableOpacity>

          {selected.length > 0 && (
            <Text style={styles.hint}>
              Tap "Find Recipes" to discover what you can cook
            </Text>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xl * 2,
  },
  heroSection: {
    alignItems: "center",
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
    position: "relative",
  },
  heroBg: {
    position: "absolute",
    top: -100,
    left: -50,
    right: -50,
    bottom: 0,
  },
  heroEmoji: {
    fontSize: 56,
    marginBottom: SPACING.md,
  },
  heroTitle: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: SPACING.sm,
    lineHeight: 22,
  },
  inputSection: {
    marginTop: SPACING.lg,
  },
  searchButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: 14,
    marginTop: SPACING.lg,
  },
  searchButtonDisabled: {
    backgroundColor: COLORS.border,
  },
  searchButtonText: {
    color: "#fff",
    fontSize: FONT_SIZE.lg,
    fontWeight: "700",
  },
  hint: {
    textAlign: "center",
    color: COLORS.textLight,
    fontSize: FONT_SIZE.sm,
    marginTop: SPACING.md,
  },
});
