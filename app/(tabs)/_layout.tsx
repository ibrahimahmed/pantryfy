import { Tabs } from "expo-router";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  COLORS,
  SHADOWS,
  BORDER_RADIUS,
  CLAY_BORDER,
} from "@/constants/theme";

function CenterFAB() {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={styles.fabContainer}
      onPress={() => {
        // Opens the import/add recipe sheet -- handled by the index screen
        // Use a global event or navigate to index with a param
        router.push("/(tabs)");
      }}
      activeOpacity={0.85}
    >
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.fabGradient}
      >
        <Ionicons name="add" size={30} color={COLORS.textOnPrimary} />
      </LinearGradient>
    </TouchableOpacity>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: {
          backgroundColor: COLORS.surfaceElevated,
          borderTopWidth: 0,
          height: 70,
          paddingBottom: 10,
          paddingTop: 6,
          marginHorizontal: 16,
          marginBottom: 10,
          borderRadius: BORDER_RADIUS.xl,
          ...SHADOWS.md,
          ...CLAY_BORDER.medium,
          position: "absolute",
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
          letterSpacing: 0.3,
        },
        tabBarIconStyle: {
          marginBottom: -2,
        },
        headerStyle: {
          backgroundColor: COLORS.background,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          fontWeight: "700",
          fontSize: 20,
          color: COLORS.text,
        },
        headerShadowVisible: false,
        headerTintColor: COLORS.text,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Cookbooks",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="planner"
        options={{
          title: "Meal Plan",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="fab-placeholder"
        options={{
          tabBarButton: () => <CenterFAB />,
          title: "",
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
          },
        }}
      />
      <Tabs.Screen
        name="grocery"
        options={{
          title: "Groceries",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: "More",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ellipsis-horizontal" color={color} size={size} />
          ),
        }}
      />
      {/* Hide saved tab from tab bar -- merged into index */}
      <Tabs.Screen
        name="saved"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  fabContainer: {
    top: -20,
    width: 58,
    height: 58,
    borderRadius: 29,
    ...SHADOWS.lg,
    ...CLAY_BORDER.light,
  },
  fabGradient: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
  },
});
