import React, { useState, useMemo } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from "@/constants/theme";
import { Ingredient } from "@/types";
import ingredientsData from "@/data/ingredients.json";

interface IngredientInputProps {
  onAdd: (ingredient: { id: string; name: string }) => void;
  selectedIds: string[];
}

export function IngredientInput({ onAdd, selectedIds }: IngredientInputProps) {
  const [query, setQuery] = useState("");

  const suggestions = useMemo(() => {
    if (query.length < 1) return [];
    const lower = query.toLowerCase();
    return (ingredientsData as Ingredient[])
      .filter(
        (ing) =>
          ing.name.toLowerCase().includes(lower) &&
          !selectedIds.includes(ing.id)
      )
      .slice(0, 8);
  }, [query, selectedIds]);

  const handleSelect = (ingredient: Ingredient) => {
    onAdd({ id: ingredient.id, name: ingredient.name });
    setQuery("");
  };

  const handleSubmitCustom = () => {
    if (query.trim().length > 0) {
      const id = query.trim().toLowerCase().replace(/\s+/g, "_");
      if (!selectedIds.includes(id)) {
        onAdd({ id, name: query.trim() });
      }
      setQuery("");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Ionicons
          name="add-circle-outline"
          size={22}
          color={COLORS.textSecondary}
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          placeholder="Type an ingredient..."
          placeholderTextColor={COLORS.textLight}
          returnKeyType="done"
          onSubmitEditing={handleSubmitCustom}
          autoCorrect={false}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery("")} style={styles.clearBtn}>
            <Ionicons name="close-circle" size={20} color={COLORS.textLight} />
          </TouchableOpacity>
        )}
      </View>

      {suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => handleSelect(item)}
              >
                <Text style={styles.suggestionText}>{item.name}</Text>
                <Text style={styles.suggestionCategory}>{item.category}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.sm,
  },
  inputIcon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    paddingVertical: SPACING.sm + 4,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
  },
  clearBtn: {
    padding: SPACING.xs,
  },
  suggestionsContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.xs,
    maxHeight: 240,
    ...SHADOWS.md,
  },
  suggestionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  suggestionText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
  },
  suggestionCategory: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
    textTransform: "capitalize",
  },
});
