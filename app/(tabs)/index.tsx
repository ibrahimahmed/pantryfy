import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useQuery } from "convex/react";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { api } from "@/convex/_generated/api";
import { ImportBanner } from "@/components/ImportBanner";
import { ImportTutorial } from "@/components/ImportTutorial";
import { SaveRecipeSheet } from "@/components/SaveRecipeSheet";
import { SavedRecipeCard } from "@/components/SavedRecipeCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  COLORS,
  SPACING,
  FONT_SIZE,
  BORDER_RADIUS,
  SHADOWS,
  CLAY_BORDER,
} from "@/constants/theme";

// Tab bar height (70) + bottom margin (10) + extra breathing room
const TAB_BAR_HEIGHT = 90;

export default function CookbooksScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const recipes = useQuery(api.recipes.getSavedRecipes);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);

  const handleImportPress = () => {
    setSheetOpen(true);
  };

  if (recipes === undefined) {
    return <LoadingSpinner message="Loading your cookbooks..." />;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + SPACING.md,
            paddingBottom: TAB_BAR_HEIGHT + SPACING.md,
          },
        ]}
      >
        {/* Header with subscription info */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>PantryFy</Text>
            <Text style={styles.subGreeting}>
              {recipes.length} recipe{recipes.length !== 1 ? "s" : ""} saved
            </Text>
          </View>
          <View style={styles.importCountBadge}>
            <Ionicons name="cloud-download" size={14} color={COLORS.primary} />
            <Text style={styles.importCountText}>5/5 free</Text>
          </View>
        </View>

        {/* Tutorial banner */}
        <View style={styles.tutorialSection}>
          <ImportTutorial
            visible={showTutorial}
            onDismiss={() => setShowTutorial(false)}
          />
        </View>

        {/* Import banner */}
        <View style={styles.importSection}>
          <ImportBanner onPress={handleImportPress} />
        </View>

        {/* Cookbooks section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Cookbooks</Text>
          <TouchableOpacity
            onPress={() => router.push("/recipes")}
            activeOpacity={0.7}
          >
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {recipes.length === 0 ? (
          <EmptyState
            icon="book-outline"
            title="No recipes yet"
            message="Import your first recipe from any website or social platform"
            actionLabel="Import Recipe"
            onAction={handleImportPress}
          />
        ) : (
          <View style={styles.recipeList}>
            {recipes.map((recipe) => (
              <SavedRecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </View>
        )}

        {/* Quick search card */}
        <TouchableOpacity
          style={styles.searchCard}
          onPress={() => router.push("/recipes")}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={[COLORS.secondaryMuted, COLORS.surface]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.searchCardGradient}
          >
            <View style={styles.searchCardIcon}>
              <Ionicons name="search" size={22} color={COLORS.secondary} />
            </View>
            <View style={styles.searchCardText}>
              <Text style={styles.searchCardTitle}>
                Search by ingredients
              </Text>
              <Text style={styles.searchCardSub}>
                Tell us what's in your fridge
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={COLORS.textLight}
            />
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>

      <SaveRecipeSheet
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  greeting: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "800",
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  subGreeting: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  importCountBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.primaryMuted,
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: SPACING.xs + 2,
    borderRadius: BORDER_RADIUS.full,
    ...SHADOWS.sm,
    ...CLAY_BORDER.subtle,
  },
  importCountText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: "700",
    color: COLORS.primary,
  },
  tutorialSection: {
    marginBottom: SPACING.md,
  },
  importSection: {
    marginBottom: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "700",
    color: COLORS.text,
  },
  seeAll: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
    color: COLORS.primary,
  },
  recipeList: {
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  searchCard: {
    borderRadius: BORDER_RADIUS.xl,
    overflow: "hidden",
    ...SHADOWS.md,
    ...CLAY_BORDER.medium,
  },
  searchCardGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.xl,
  },
  searchCardIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surfaceElevated,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.sm,
  },
  searchCardText: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  searchCardTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    color: COLORS.text,
  },
  searchCardSub: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});
