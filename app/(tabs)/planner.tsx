import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQuery, useMutation } from "convex/react";
import { getWeekStart, getWeekDates, formatDate, formatShortDay, isToday } from "@/lib/dateUtils";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";

const MEAL_TYPES = ["breakfast", "lunch", "dinner"] as const;
const MEAL_ICONS: Record<string, string> = {
  breakfast: "\u2615",
  lunch: "\u{1F32E}",
  dinner: "\u{1F372}",
};

export default function PlannerScreen() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    date: string;
    mealType: (typeof MEAL_TYPES)[number];
  } | null>(null);

  const weekStart = useMemo(() => {
    const now = new Date();
    const start = getWeekStart(now);
    start.setDate(start.getDate() + weekOffset * 7);
    return start;
  }, [weekOffset]);

  const weekDates = useMemo(() => getWeekDates(weekStart), [weekStart]);

  const mealPlans = useQuery(api.planner.getMealPlan, {
    startDate: weekDates[0],
    endDate: weekDates[6],
  });

  const savedRecipes = useQuery(api.recipes.getSavedRecipes);
  const setMealPlan = useMutation(api.planner.setMealPlan);
  const removeMealPlan = useMutation(api.planner.removeMealPlan);

  const getMealForSlot = (date: string, mealType: string) => {
    if (!mealPlans) return null;
    const plan = mealPlans.find(
      (p) => p.date === date && p.mealType === mealType
    );
    if (!plan) return null;
    const recipe = savedRecipes?.find((r) => r._id === plan.recipeId);
    return { plan, recipe };
  };

  const handleSlotPress = (
    date: string,
    mealType: (typeof MEAL_TYPES)[number]
  ) => {
    setSelectedSlot({ date, mealType });
    setPickerVisible(true);
  };

  const handleSelectRecipe = async (recipeId: string) => {
    if (!selectedSlot) return;
    await setMealPlan({
      date: selectedSlot.date,
      mealType: selectedSlot.mealType,
      recipeId: recipeId as any,
    });
    setPickerVisible(false);
  };

  const handleRemoveMeal = async (planId: string) => {
    await removeMealPlan({ id: planId as any });
  };

  if (mealPlans === undefined || savedRecipes === undefined) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      {/* Week Navigation */}
      <View style={styles.weekNav}>
        <TouchableOpacity
          onPress={() => setWeekOffset((w) => w - 1)}
          style={styles.navButton}
        >
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <View style={styles.weekLabel}>
          <Text style={styles.weekText}>
            {formatDate(weekDates[0])} - {formatDate(weekDates[6])}
          </Text>
          {weekOffset !== 0 && (
            <TouchableOpacity onPress={() => setWeekOffset(0)}>
              <Text style={styles.todayLink}>Today</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          onPress={() => setWeekOffset((w) => w + 1)}
          style={styles.navButton}
        >
          <Ionicons name="chevron-forward" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {/* Week Grid */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {weekDates.map((date) => (
          <View
            key={date}
            style={[styles.dayCard, isToday(date) && styles.dayCardToday]}
          >
            <View style={styles.dayHeader}>
              <Text
                style={[
                  styles.dayName,
                  isToday(date) && styles.dayNameToday,
                ]}
              >
                {formatShortDay(date)}
              </Text>
              <Text style={styles.dayDate}>
                {new Date(date + "T12:00:00").getDate()}
              </Text>
            </View>
            <View style={styles.mealSlots}>
              {MEAL_TYPES.map((mealType) => {
                const meal = getMealForSlot(date, mealType);
                return (
                  <TouchableOpacity
                    key={mealType}
                    style={[
                      styles.mealSlot,
                      meal?.recipe && styles.mealSlotFilled,
                    ]}
                    onPress={() => {
                      if (meal?.plan) {
                        handleRemoveMeal(meal.plan._id);
                      } else {
                        handleSlotPress(date, mealType);
                      }
                    }}
                  >
                    <Text style={styles.mealIcon}>{MEAL_ICONS[mealType]}</Text>
                    {meal?.recipe ? (
                      <Text style={styles.mealName} numberOfLines={1}>
                        {meal.recipe.title}
                      </Text>
                    ) : (
                      <Ionicons
                        name="add"
                        size={16}
                        color={COLORS.textLight}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Recipe Picker Modal */}
      <Modal
        visible={pickerVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setPickerVisible(false)}
      >
        <View style={styles.pickerContainer}>
          <View style={styles.pickerHeader}>
            <Text style={styles.pickerTitle}>
              Choose a recipe for{" "}
              {selectedSlot
                ? `${selectedSlot.mealType} on ${formatDate(selectedSlot.date)}`
                : ""}
            </Text>
            <TouchableOpacity onPress={() => setPickerVisible(false)}>
              <Ionicons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>
          {savedRecipes.length === 0 ? (
            <EmptyState
              icon="bookmark-outline"
              message="Save some recipes first to add them to your plan"
            />
          ) : (
            <FlatList
              data={savedRecipes}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.pickerItem}
                  onPress={() => handleSelectRecipe(item._id)}
                >
                  <Text style={styles.pickerItemText}>{item.title}</Text>
                  <Text style={styles.pickerItemMeta}>
                    {item.ingredients?.length || 0} ingredients |{" "}
                    {item.servings} servings
                  </Text>
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.pickerList}
            />
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  weekNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  navButton: {
    padding: SPACING.sm,
  },
  weekLabel: {
    alignItems: "center",
  },
  weekText: {
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
    color: COLORS.text,
  },
  todayLink: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.primary,
    fontWeight: "600",
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
    gap: SPACING.sm,
    paddingBottom: SPACING.xl * 2,
  },
  dayCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm + 2,
    ...SHADOWS.sm,
  },
  dayCardToday: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  dayHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  dayName: {
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    color: COLORS.text,
  },
  dayNameToday: {
    color: COLORS.primary,
  },
  dayDate: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  mealSlots: {
    gap: SPACING.xs,
  },
  mealSlot: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    paddingVertical: SPACING.sm - 2,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderStyle: "dashed",
  },
  mealSlotFilled: {
    backgroundColor: "#E8F5E9",
    borderColor: COLORS.primaryLight,
    borderStyle: "solid",
  },
  mealIcon: {
    fontSize: 16,
  },
  mealName: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
    fontWeight: "500",
  },
  pickerContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  pickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  pickerTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
    color: COLORS.text,
    flex: 1,
    marginRight: SPACING.md,
  },
  pickerList: {
    padding: SPACING.md,
  },
  pickerItem: {
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.sm,
  },
  pickerItemText: {
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
    color: COLORS.text,
  },
  pickerItemMeta: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
});
