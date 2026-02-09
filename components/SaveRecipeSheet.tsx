import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRecipeExtraction } from "@/hooks/useRecipeExtraction";
import { parseIngredientLine } from "@/lib/ingredientParser";
import * as Haptics from "expo-haptics";
import {
  COLORS,
  SPACING,
  FONT_SIZE,
  BORDER_RADIUS,
  SHADOWS,
  CLAY_BORDER,
} from "@/constants/theme";

interface SaveRecipeSheetProps {
  visible: boolean;
  onClose: () => void;
}

export function SaveRecipeSheet({ visible, onClose }: SaveRecipeSheetProps) {
  const [tab, setTab] = useState<"url" | "manual">("url");
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [ingredientsText, setIngredientsText] = useState("");
  const [servings, setServings] = useState("4");
  const [saving, setSaving] = useState(false);

  const saveRecipe = useMutation(api.recipes.saveRecipe);
  const {
    extract,
    loading: extracting,
    result,
    error,
    reset,
    status,
  } = useRecipeExtraction();

  const handleExtract = () => {
    if (!url.trim()) return;
    extract(url.trim());
  };

  const handleSaveFromUrl = async () => {
    if (!result) return;
    setSaving(true);
    try {
      await saveRecipe({
        title: result.title,
        source: "url",
        sourceUrl: url,
        imageUrl: result.imageUrl,
        ingredients: result.ingredients,
        servings: result.servings || 4,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      handleClose();
    } catch (e) {
      Alert.alert("Error", "Failed to save recipe");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveManual = async () => {
    if (!title.trim() || !ingredientsText.trim()) {
      Alert.alert("Missing info", "Please add a title and ingredients");
      return;
    }
    setSaving(true);
    try {
      const lines = ingredientsText
        .split("\n")
        .filter((l) => l.trim().length > 0);
      const ingredients = lines.map((line) => {
        const parsed = parseIngredientLine(line);
        return {
          name: parsed.name,
          quantity: parsed.quantity,
          unit: parsed.unit,
          raw: parsed.raw,
        };
      });
      await saveRecipe({
        title: title.trim(),
        source: "manual",
        ingredients,
        servings: parseInt(servings) || 4,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      handleClose();
    } catch (e) {
      Alert.alert("Error", "Failed to save recipe");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setUrl("");
    setTitle("");
    setIngredientsText("");
    setServings("4");
    reset();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Add Recipe</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={22} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, tab === "url" && styles.tabActive]}
            onPress={() => setTab("url")}
          >
            <Ionicons
              name="link-outline"
              size={16}
              color={tab === "url" ? COLORS.primary : COLORS.textLight}
            />
            <Text
              style={[
                styles.tabText,
                tab === "url" && styles.tabTextActive,
              ]}
            >
              From URL
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, tab === "manual" && styles.tabActive]}
            onPress={() => setTab("manual")}
          >
            <Ionicons
              name="create-outline"
              size={16}
              color={tab === "manual" ? COLORS.primary : COLORS.textLight}
            />
            <Text
              style={[
                styles.tabText,
                tab === "manual" && styles.tabTextActive,
              ]}
            >
              Manual
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
          {tab === "url" ? (
            <View>
              <Text style={styles.label}>
                Paste any recipe, Instagram, TikTok, or YouTube link
              </Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={url}
                  onChangeText={setUrl}
                  placeholder="https://..."
                  autoCapitalize="none"
                  keyboardType="url"
                  placeholderTextColor={COLORS.textLight}
                />
              </View>
              <TouchableOpacity
                style={[
                  styles.extractButton,
                  !url.trim() && styles.buttonDisabled,
                ]}
                onPress={handleExtract}
                disabled={!url.trim() || extracting}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[COLORS.secondary, COLORS.secondaryDark]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.extractGradient}
                >
                  {extracting ? (
                    <View style={styles.extractingRow}>
                      <ActivityIndicator size="small" color="#fff" />
                      {status ? (
                        <Text style={styles.extractingStatusText}>
                          {status}
                        </Text>
                      ) : null}
                    </View>
                  ) : (
                    <Text style={styles.extractButtonText}>Extract Recipe</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {error && <Text style={styles.error}>{error}</Text>}

              {result && (
                <View style={styles.preview}>
                  <Text style={styles.previewTitle}>{result.title}</Text>
                  <Text style={styles.previewMeta}>
                    {result.ingredients?.length || 0} ingredients |{" "}
                    {result.servings} servings
                  </Text>
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSaveFromUrl}
                    disabled={saving}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={[COLORS.primary, COLORS.primaryDark]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.saveGradient}
                    >
                      <Text style={styles.saveButtonText}>
                        {saving ? "Saving..." : "Save Recipe"}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ) : (
            <View>
              <Text style={styles.label}>Recipe Name</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={title}
                  onChangeText={setTitle}
                  placeholder="e.g., Grandma's Chicken Soup"
                  placeholderTextColor={COLORS.textLight}
                />
              </View>

              <Text style={styles.label}>Ingredients (one per line)</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, styles.multilineInput]}
                  value={ingredientsText}
                  onChangeText={setIngredientsText}
                  placeholder={"2 cups flour\n1 tsp salt\n3 eggs\n..."}
                  placeholderTextColor={COLORS.textLight}
                  multiline
                  numberOfLines={8}
                  textAlignVertical="top"
                />
              </View>

              <Text style={styles.label}>Servings</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={servings}
                  onChangeText={setServings}
                  placeholder="4"
                  keyboardType="number-pad"
                  placeholderTextColor={COLORS.textLight}
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.saveButton,
                  (!title.trim() || !ingredientsText.trim()) &&
                    styles.buttonDisabled,
                ]}
                onPress={handleSaveManual}
                disabled={!title.trim() || !ingredientsText.trim() || saving}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[COLORS.primary, COLORS.primaryDark]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.saveGradient}
                >
                  <Text style={styles.saveButtonText}>
                    {saving ? "Saving..." : "Save Recipe"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
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
  headerTitle: {
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
  tabs: {
    flexDirection: "row",
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xs,
    ...SHADOWS.sm,
    ...CLAY_BORDER.subtle,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.xs,
    paddingVertical: SPACING.sm + 2,
    borderRadius: BORDER_RADIUS.md,
  },
  tabActive: {
    backgroundColor: COLORS.primaryMuted,
    ...SHADOWS.sm,
  },
  tabText: {
    fontSize: FONT_SIZE.md,
    fontWeight: "500",
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.primaryDark,
    fontWeight: "700",
  },
  content: {
    flex: 1,
    padding: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
    letterSpacing: 0.3,
  },
  inputWrapper: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.md,
    ...CLAY_BORDER.medium,
  },
  input: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 4,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    fontWeight: "500",
  },
  multilineInput: {
    height: 160,
    paddingTop: SPACING.sm + 2,
  },
  extractButton: {
    marginTop: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    overflow: "hidden",
    ...SHADOWS.md,
    ...CLAY_BORDER.light,
  },
  extractGradient: {
    paddingVertical: SPACING.sm + 4,
    borderRadius: BORDER_RADIUS.md,
    alignItems: "center",
  },
  extractButtonText: {
    color: COLORS.textOnPrimary,
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
  },
  extractingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  extractingStatusText: {
    color: COLORS.textOnPrimary,
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
    opacity: 0.9,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  error: {
    color: COLORS.error,
    fontSize: FONT_SIZE.sm,
    marginTop: SPACING.sm,
    textAlign: "center",
    fontWeight: "500",
  },
  preview: {
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginTop: SPACING.md,
    ...SHADOWS.md,
    ...CLAY_BORDER.medium,
  },
  previewTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "800",
    color: COLORS.text,
  },
  previewMeta: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  saveButton: {
    marginTop: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    overflow: "hidden",
    ...SHADOWS.md,
    ...CLAY_BORDER.light,
  },
  saveGradient: {
    paddingVertical: SPACING.sm + 4,
    borderRadius: BORDER_RADIUS.md,
    alignItems: "center",
  },
  saveButtonText: {
    color: COLORS.textOnPrimary,
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
  },
});
