import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ConvexReactClient } from "convex/react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { COLORS } from "@/constants/theme";
import { useOnboardingStore } from "@/store/onboardingStore";
import { useSubscriptionStore } from "@/store/subscriptionStore";

const convex = new ConvexReactClient(
  process.env.EXPO_PUBLIC_CONVEX_URL as string
);

// Platform-aware storage: SecureStore on native, localStorage on web
function getStorage() {
  if (Platform.OS === "web") return undefined;
  const SecureStore = require("expo-secure-store");
  return {
    getItem: SecureStore.getItemAsync,
    setItem: SecureStore.setItemAsync,
    removeItem: SecureStore.deleteItemAsync,
  };
}

const storage = getStorage();

function NavigationGuard({ children }: { children: React.ReactNode }) {
  const { hasCompletedOnboarding } = useOnboardingStore();
  const segments = useSegments();
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const unsub = useOnboardingStore.persist.onFinishHydration(() => {
      setIsHydrated(true);
    });
    if (useOnboardingStore.persist.hasHydrated()) {
      setIsHydrated(true);
    }
    return unsub;
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const inOnboarding = segments[0] === "(onboarding)";
    const inAuth = segments[0] === "(auth)";
    const inPaywall = segments[0] === "paywall";

    if (!hasCompletedOnboarding && !inOnboarding && !inPaywall && !inAuth) {
      router.replace("/(onboarding)/welcome");
    }
  }, [hasCompletedOnboarding, segments, isHydrated]);

  return <>{children}</>;
}

export default function RootLayout() {
  const refreshStatus = useSubscriptionStore((s) => s.refreshStatus);
  const startListening = useSubscriptionStore((s) => s.startListening);

  useEffect(() => {
    if (Platform.OS === "web") return;

    // Initialize RevenueCat SDK
    const { initRevenueCat } = require("@/lib/revenuecat");
    initRevenueCat().then(() => {
      // After init, fetch subscription status and start listening
      refreshStatus();
    });

    const unsub = startListening();
    return unsub;
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ConvexAuthProvider client={convex} storage={storage}>
        <StatusBar style="dark" />
        <NavigationGuard>
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: COLORS.background },
              headerTintColor: COLORS.text,
              headerTitleStyle: { fontWeight: "700", color: COLORS.text },
              headerShadowVisible: false,
              contentStyle: { backgroundColor: COLORS.background },
            }}
          >
            <Stack.Screen
              name="(onboarding)"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="paywall"
              options={{ headerShown: false, presentation: "modal" }}
            />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="recipes/index"
              options={{ title: "Recipe Results" }}
            />
            <Stack.Screen
              name="recipes/[id]"
              options={{ title: "Recipe Details" }}
            />
          </Stack>
        </NavigationGuard>
      </ConvexAuthProvider>
    </GestureHandlerRootView>
  );
}
