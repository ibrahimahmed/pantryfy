import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Platform,
  Linking,
  Share,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  COLORS,
  SPACING,
  FONT_SIZE,
  BORDER_RADIUS,
  SHADOWS,
  CLAY_BORDER,
} from "@/constants/theme";
import { useOnboardingStore } from "@/store/onboardingStore";
import { useSubscriptionStore } from "@/store/subscriptionStore";
import {
  presentPaywallIfNeeded,
  presentCustomerCenter,
  restorePurchases,
  ENTITLEMENT_ID,
} from "@/lib/revenuecat";

const APP_STORE_URL = Platform.select({
  ios: "https://apps.apple.com/app/pantryfy/id0000000000",
  android:
    "https://play.google.com/store/apps/details?id=com.pantryfy.app",
  default: "https://pantryfy.app",
});
const SUPPORT_EMAIL = "support@pantryfy.app";
const PRIVACY_URL = "https://pantryfy.app/privacy";
const TERMS_URL = "https://pantryfy.app/terms";
const FAQ_URL = "https://pantryfy.app/faq";

export default function MoreScreen() {
  const router = useRouter();
  const { resetOnboarding } = useOnboardingStore();
  const { isPro, customerInfo, refreshStatus } = useSubscriptionStore();

  const handleUpgrade = async () => {
    if (Platform.OS === "web") {
      router.push("/paywall");
      return;
    }
    const purchased = await presentPaywallIfNeeded();
    if (purchased) {
      await refreshStatus();
    }
  };

  const handleManageSubscription = async () => {
    if (Platform.OS === "web") return;
    // Try Customer Center first, fall back to management URL
    try {
      await presentCustomerCenter();
    } catch {
      const url = customerInfo?.managementURL;
      if (url) {
        Linking.openURL(url);
      }
    }
  };

  const handleRestore = async () => {
    await restorePurchases();
    await refreshStatus();
  };

  // -- Discover handlers --
  const handleTrendingRecipes = () => {
    router.push("/recipes");
  };

  const handleImportGuides = () => {
    // Navigate back to cookbooks which shows the import tutorial
    router.push("/(tabs)");
  };

  const handleAISuggestions = () => {
    router.push("/recipes");
  };

  // -- Community handlers --
  const handleInviteFriends = async () => {
    try {
      await Share.share({
        message: Platform.select({
          ios: `Check out PantryFy -- save recipes from anywhere and plan meals effortlessly! ${APP_STORE_URL}`,
          default: `Check out PantryFy -- save recipes from anywhere and plan meals effortlessly! ${APP_STORE_URL}`,
        }),
      });
    } catch {
      // User cancelled share
    }
  };

  const handleRateApp = () => {
    Linking.openURL(APP_STORE_URL);
  };

  const handleShareKitchen = async () => {
    try {
      await Share.share({
        message: "Check out PantryFy! Save and organize your recipes from anywhere. Download the app to get started.",
      });
    } catch {
      // User cancelled share
    }
  };

  // -- Support handlers --
  const handleHelpFAQ = () => {
    Linking.openURL(FAQ_URL);
  };

  const handleContactUs = () => {
    Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=PantryFy%20Support`);
  };

  const handlePrivacyPolicy = () => {
    Linking.openURL(PRIVACY_URL);
  };

  const handleTermsOfService = () => {
    Linking.openURL(TERMS_URL);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Section */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={isPro ? [COLORS.warning, COLORS.secondary] : [COLORS.primaryLight, COLORS.primary]}
              style={styles.avatarGradient}
            >
              <Ionicons
                name={isPro ? "diamond" : "person"}
                size={28}
                color={COLORS.textOnPrimary}
              />
            </LinearGradient>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {customerInfo?.originalAppUserId
                ? `User ${customerInfo.originalAppUserId.slice(0, 8)}`
                : "PantryFy User"}
            </Text>
            <View style={styles.planBadge}>
              <Text
                style={[
                  styles.profilePlan,
                  isPro && { color: COLORS.warning, fontWeight: "700" },
                ]}
              >
                {isPro ? "PantryFy Pro" : "Free Plan"}
              </Text>
            </View>
          </View>
          {isPro && (
            <TouchableOpacity onPress={handleManageSubscription}>
              <Ionicons name="settings-outline" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          )}
        </View>

        {/* Upgrade card (only if not pro) */}
        {!isPro && (
          <TouchableOpacity
            style={styles.upgradeCard}
            onPress={handleUpgrade}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={[COLORS.primary, COLORS.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.upgradeGradient}
            >
              <View style={styles.upgradeIconWrap}>
                <Ionicons name="diamond" size={24} color={COLORS.warning} />
              </View>
              <View style={styles.upgradeTextCol}>
                <Text style={styles.upgradeTitle}>Upgrade to PantryFy Pro</Text>
                <Text style={styles.upgradeSubtitle}>
                  Unlimited imports, AI suggestions, and more
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textOnPrimary} />
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Subscription management (if pro) */}
        {isPro && (
          <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>Subscription</Text>
            <View style={styles.menuCard}>
              <TouchableOpacity
                style={[styles.menuItem, styles.menuItemBorder]}
                activeOpacity={0.7}
                onPress={handleManageSubscription}
              >
                <View style={[styles.menuIcon, { backgroundColor: COLORS.primaryMuted }]}>
                  <Ionicons name="card-outline" size={20} color={COLORS.primary} />
                </View>
                <Text style={styles.menuLabel}>Manage Subscription</Text>
                <Ionicons name="chevron-forward" size={16} color={COLORS.textLight} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                activeOpacity={0.7}
                onPress={handleRestore}
              >
                <View style={[styles.menuIcon, { backgroundColor: COLORS.successMuted }]}>
                  <Ionicons name="refresh-outline" size={20} color={COLORS.success} />
                </View>
                <Text style={styles.menuLabel}>Restore Purchases</Text>
                <Ionicons name="chevron-forward" size={16} color={COLORS.textLight} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Discover */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Discover</Text>
          <View style={styles.menuCard}>
            {[
              { icon: "trending-up-outline", label: "Trending Recipes", onPress: handleTrendingRecipes },
              { icon: "cloud-download-outline", label: "Import Guides", onPress: handleImportGuides },
              { icon: "sparkles-outline", label: "AI Suggestions", onPress: handleAISuggestions },
            ].map((item, i, arr) => (
              <TouchableOpacity
                key={i}
                style={[styles.menuItem, i < arr.length - 1 && styles.menuItemBorder]}
                activeOpacity={0.7}
                onPress={item.onPress}
              >
                <View style={[styles.menuIcon, { backgroundColor: COLORS.textSecondary + "15" }]}>
                  <Ionicons name={item.icon as any} size={20} color={COLORS.textSecondary} />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={16} color={COLORS.textLight} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Community */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Community</Text>
          <View style={styles.menuCard}>
            {[
              { icon: "people-outline", label: "Invite Friends", onPress: handleInviteFriends },
              { icon: "star-outline", label: "Rate the App", onPress: handleRateApp },
              { icon: "share-social-outline", label: "Share PantryFy", onPress: handleShareKitchen },
            ].map((item, i, arr) => (
              <TouchableOpacity
                key={i}
                style={[styles.menuItem, i < arr.length - 1 && styles.menuItemBorder]}
                activeOpacity={0.7}
                onPress={item.onPress}
              >
                <View style={[styles.menuIcon, { backgroundColor: COLORS.textSecondary + "15" }]}>
                  <Ionicons name={item.icon as any} size={20} color={COLORS.textSecondary} />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={16} color={COLORS.textLight} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Support */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.menuCard}>
            {[
              { icon: "help-circle-outline", label: "Help & FAQ", onPress: handleHelpFAQ },
              { icon: "chatbubble-outline", label: "Contact Us", onPress: handleContactUs },
              { icon: "document-text-outline", label: "Privacy Policy", onPress: handlePrivacyPolicy },
              { icon: "shield-outline", label: "Terms of Service", onPress: handleTermsOfService },
            ].map((item, i, arr) => (
              <TouchableOpacity
                key={i}
                style={[styles.menuItem, i < arr.length - 1 && styles.menuItemBorder]}
                activeOpacity={0.7}
                onPress={item.onPress}
              >
                <View style={[styles.menuIcon, { backgroundColor: COLORS.textSecondary + "15" }]}>
                  <Ionicons name={item.icon as any} size={20} color={COLORS.textSecondary} />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={16} color={COLORS.textLight} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Settings */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.menuCard}>
            {!isPro && (
              <TouchableOpacity
                style={[styles.menuItem, styles.menuItemBorder]}
                activeOpacity={0.7}
                onPress={handleRestore}
              >
                <View style={[styles.menuIcon, { backgroundColor: COLORS.successMuted }]}>
                  <Ionicons name="receipt-outline" size={20} color={COLORS.success} />
                </View>
                <Text style={styles.menuLabel}>Restore Purchases</Text>
                <Ionicons name="chevron-forward" size={16} color={COLORS.textLight} />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={resetOnboarding}
            >
              <View style={[styles.menuIcon, { backgroundColor: COLORS.errorMuted }]}>
                <Ionicons name="refresh-outline" size={20} color={COLORS.error} />
              </View>
              <Text style={[styles.menuLabel, { color: COLORS.error }]}>
                Reset Onboarding
              </Text>
              <Ionicons name="chevron-forward" size={16} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.version}>PantryFy v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl * 4,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    ...SHADOWS.md,
    ...CLAY_BORDER.medium,
  },
  avatarContainer: {
    borderRadius: 24,
    overflow: "hidden",
    ...SHADOWS.sm,
  },
  avatarGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  profileInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  profileName: {
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    color: COLORS.text,
  },
  planBadge: {
    marginTop: 2,
  },
  profilePlan: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },
  upgradeCard: {
    borderRadius: BORDER_RADIUS.xl,
    overflow: "hidden",
    marginBottom: SPACING.lg,
    ...SHADOWS.lg,
    ...CLAY_BORDER.light,
  },
  upgradeGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.xl,
  },
  upgradeIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  upgradeTextCol: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  upgradeTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    color: COLORS.textOnPrimary,
  },
  upgradeSubtitle: {
    fontSize: FONT_SIZE.xs,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
  },
  menuSection: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.xs,
    fontWeight: "700",
    color: COLORS.textLight,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: SPACING.sm,
    marginLeft: SPACING.xs,
  },
  menuCard: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.lg,
    overflow: "hidden",
    ...SHADOWS.sm,
    ...CLAY_BORDER.subtle,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.md,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  menuLabel: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    fontWeight: "500",
    color: COLORS.text,
    marginLeft: SPACING.md,
  },
  version: {
    textAlign: "center",
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
    marginTop: SPACING.md,
  },
});
