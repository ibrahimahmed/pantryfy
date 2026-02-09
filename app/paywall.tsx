import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Switch,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import {
  COLORS,
  SPACING,
  FONT_SIZE,
  BORDER_RADIUS,
  SHADOWS,
  CLAY_BORDER,
} from "@/constants/theme";
import {
  getCurrentOffering,
  purchasePackage,
  restorePurchases,
  presentPaywall as presentNativePaywall,
  ENTITLEMENT_ID,
  isProUser,
  type RCOffering,
  type RCPackage,
} from "@/lib/revenuecat";
import { useSubscriptionStore } from "@/store/subscriptionStore";

type SelectedPlan = "yearly" | "monthly" | "lifetime";

export default function PaywallScreen() {
  const router = useRouter();
  const refreshStatus = useSubscriptionStore((s) => s.refreshStatus);
  const isPro = useSubscriptionStore((s) => s.isPro);
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlan>("yearly");
  const [remindMe, setRemindMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [offering, setOffering] = useState<RCOffering | null>(null);
  const [useNativePaywall, setUseNativePaywall] = useState(false);

  // Idempotency: prevent concurrent purchase attempts
  const purchaseInFlight = useRef(false);

  useEffect(() => {
    loadOfferings();
    // Check subscription on mount -- redirect if already Pro
    refreshStatus().then(() => {
      if (useSubscriptionStore.getState().isPro) {
        router.replace("/(auth)/signin");
      }
    });
  }, []);

  const loadOfferings = async () => {
    if (Platform.OS === "web") return;
    const current = await getCurrentOffering();
    if (current) {
      setOffering(current);
    }
  };

  /** Try to present the RevenueCat-hosted native paywall first */
  const tryNativePaywall = useCallback(async () => {
    if (Platform.OS === "web" || purchaseInFlight.current) return;
    purchaseInFlight.current = true;
    try {
      const purchased = await presentNativePaywall();
      if (purchased) {
        await refreshStatus();
        router.replace("/(auth)/signin");
      }
    } catch {
      // Native paywall not available -- fall through to custom UI
    } finally {
      purchaseInFlight.current = false;
    }
  }, []);

  const getPackageForPlan = (): RCPackage | null => {
    if (!offering) return null;
    switch (selectedPlan) {
      case "yearly":
        return offering.annual ?? offering.availablePackages[0] ?? null;
      case "monthly":
        return offering.monthly ?? offering.availablePackages[1] ?? null;
      case "lifetime":
        return offering.lifetime ?? offering.availablePackages[2] ?? null;
      default:
        return null;
    }
  };

  const handlePurchase = async () => {
    // Guard: prevent concurrent purchase calls (double-tap / triple-tap)
    if (purchaseInFlight.current || loading) return;

    // Guard: check if user already has an active subscription
    if (isPro) {
      Alert.alert(
        "Already Subscribed",
        "You already have an active PantryFy Pro subscription.",
        [{ text: "OK", onPress: () => router.replace("/(auth)/signin") }]
      );
      return;
    }

    const pkg = getPackageForPlan();
    if (!pkg) {
      // No packages -- skip to auth
      router.replace("/(auth)/signin");
      return;
    }

    // Lock purchase to prevent duplicate charges
    purchaseInFlight.current = true;
    setLoading(true);
    try {
      // Double-check entitlement right before purchasing (server-side truth)
      const alreadyPro = await isProUser();
      if (alreadyPro) {
        await refreshStatus();
        Alert.alert(
          "Already Subscribed",
          "You already have an active PantryFy Pro subscription.",
          [{ text: "OK", onPress: () => router.replace("/(auth)/signin") }]
        );
        return;
      }

      const result = await purchasePackage(pkg);
      if (result) {
        await refreshStatus();
        router.replace("/(auth)/signin");
        return;
      }
      // User cancelled -- stay on paywall
    } catch (error: any) {
      Alert.alert(
        "Purchase Error",
        error.message ?? "Something went wrong. Please try again."
      );
    } finally {
      purchaseInFlight.current = false;
      setLoading(false);
    }
  };

  const handleSkip = () => {
    router.replace("/(auth)/signin");
  };

  const handleRestore = async () => {
    if (purchaseInFlight.current || loading) return;
    purchaseInFlight.current = true;
    setLoading(true);
    try {
      const info = await restorePurchases();
      if (info) {
        await refreshStatus();
        const hasEntitlement =
          info.entitlements.active[ENTITLEMENT_ID] !== undefined;
        if (hasEntitlement) {
          Alert.alert("Restored", "Your PantryFy Pro subscription is active!");
          router.replace("/(auth)/signin");
          return;
        }
        Alert.alert("No Active Subscription", "No previous purchases found.");
      }
    } catch (error: any) {
      Alert.alert("Restore Error", error.message ?? "Could not restore.");
    } finally {
      purchaseInFlight.current = false;
      setLoading(false);
    }
  };

  // Helper to get price string for a plan
  const getPriceLabel = (plan: SelectedPlan): string => {
    if (!offering) {
      const fallback = { yearly: "$49.99/year", monthly: "$9.99/month", lifetime: "$99.99" };
      return fallback[plan];
    }
    const map: Record<SelectedPlan, RCPackage | null> = {
      yearly: offering.annual,
      monthly: offering.monthly,
      lifetime: offering.lifetime,
    };
    const pkg = map[plan];
    if (!pkg) return "";
    if (plan === "lifetime") return `${pkg.product.priceString} once`;
    return `${pkg.product.priceString}/${plan === "yearly" ? "year" : "month"}`;
  };

  const hasIntroOffer = offering?.annual?.product?.introPrice != null;

  return (
    <SafeAreaView style={styles.container}>
      {/* Close button */}
      <TouchableOpacity style={styles.closeButton} onPress={handleSkip}>
        <Ionicons name="close" size={24} color={COLORS.textSecondary} />
      </TouchableOpacity>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Photo collage header */}
        <View style={styles.collageHeader}>
          <View style={styles.collageRow}>
            {["\u{1F96A}", "\u{1F957}", "\u{1F35D}", "\u{1F363}"].map(
              (emoji, i) => (
                <View key={i} style={styles.collageItem}>
                  <Text style={styles.collageEmoji}>{emoji}</Text>
                </View>
              )
            )}
          </View>
        </View>

        {/* Heading */}
        <Text style={styles.heading}>
          Unlock PantryFy Pro
        </Text>
        <Text style={styles.subheading}>
          Import unlimited recipes, plan meals, and cook smarter
        </Text>

        {/* Feature list */}
        <View style={styles.featureList}>
          {[
            { icon: "infinite", label: "Unlimited recipe imports" },
            { icon: "calendar", label: "Advanced meal planning" },
            { icon: "cart", label: "Smart grocery lists" },
            { icon: "sparkles", label: "AI cooking suggestions" },
          ].map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <View style={styles.featureIconWrap}>
                <Ionicons name={f.icon as any} size={18} color={COLORS.primary} />
              </View>
              <Text style={styles.featureLabel}>{f.label}</Text>
            </View>
          ))}
        </View>

        {/* Plan cards */}
        <View style={styles.planCards}>
          {/* Yearly */}
          <TouchableOpacity
            style={[styles.planCard, selectedPlan === "yearly" && styles.planCardSelected]}
            onPress={() => setSelectedPlan("yearly")}
            activeOpacity={0.8}
          >
            {selectedPlan === "yearly" && (
              <View style={styles.popularBadge}>
                <Text style={styles.popularText}>BEST VALUE</Text>
              </View>
            )}
            <View style={styles.planRadio}>
              <View style={[styles.radioOuter, selectedPlan === "yearly" && styles.radioOuterSelected]}>
                {selectedPlan === "yearly" && <View style={styles.radioInner} />}
              </View>
            </View>
            <View style={styles.planInfo}>
              <Text style={styles.planTitle}>
                {hasIntroOffer ? "Free 7-Day Trial" : "Yearly"}
              </Text>
              <Text style={styles.planPrice}>
                {hasIntroOffer ? `then ${getPriceLabel("yearly")}` : getPriceLabel("yearly")}
              </Text>
            </View>
            <View style={styles.planSave}>
              <Text style={styles.planSaveText}>SAVE 58%</Text>
            </View>
          </TouchableOpacity>

          {/* Monthly */}
          <TouchableOpacity
            style={[styles.planCard, selectedPlan === "monthly" && styles.planCardSelected]}
            onPress={() => setSelectedPlan("monthly")}
            activeOpacity={0.8}
          >
            <View style={styles.planRadio}>
              <View style={[styles.radioOuter, selectedPlan === "monthly" && styles.radioOuterSelected]}>
                {selectedPlan === "monthly" && <View style={styles.radioInner} />}
              </View>
            </View>
            <View style={styles.planInfo}>
              <Text style={styles.planTitle}>Monthly</Text>
              <Text style={styles.planPrice}>{getPriceLabel("monthly")}</Text>
            </View>
          </TouchableOpacity>

          {/* Lifetime */}
          <TouchableOpacity
            style={[styles.planCard, selectedPlan === "lifetime" && styles.planCardSelected]}
            onPress={() => setSelectedPlan("lifetime")}
            activeOpacity={0.8}
          >
            <View style={styles.planRadio}>
              <View style={[styles.radioOuter, selectedPlan === "lifetime" && styles.radioOuterSelected]}>
                {selectedPlan === "lifetime" && <View style={styles.radioInner} />}
              </View>
            </View>
            <View style={styles.planInfo}>
              <Text style={styles.planTitle}>Lifetime</Text>
              <Text style={styles.planPrice}>{getPriceLabel("lifetime")}</Text>
            </View>
            <View style={[styles.planSave, { backgroundColor: COLORS.warningMuted }]}>
              <Text style={[styles.planSaveText, { color: COLORS.warning }]}>ONE TIME</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Remind me toggle (only if trial available) */}
        {hasIntroOffer && (
          <View style={styles.remindRow}>
            <Ionicons name="notifications-outline" size={20} color={COLORS.text} />
            <Text style={styles.remindText}>Remind me before my trial ends</Text>
            <Switch
              value={remindMe}
              onValueChange={setRemindMe}
              trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
              thumbColor={remindMe ? COLORS.primary : COLORS.surface}
            />
          </View>
        )}

        {/* Social proof */}
        <View style={styles.socialProof}>
          <View style={styles.proofRow}>
            <View style={styles.proofItem}>
              <Text style={styles.proofNumber}>100K+</Text>
              <Text style={styles.proofLabel}>Happy cooks</Text>
            </View>
            <View style={styles.proofDivider} />
            <View style={styles.proofItem}>
              <View style={styles.proofStars}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Ionicons key={s} name="star" size={14} color={COLORS.warning} />
                ))}
              </View>
              <Text style={styles.proofLabel}>4.8 rating</Text>
            </View>
          </View>

          <View style={styles.reviewCard}>
            <Text style={styles.reviewText}>
              "The meal planning and grocery list features alone are worth it.
              I've saved so much time and money!"
            </Text>
            <Text style={styles.reviewAuthor}>-- Jamie K.</Text>
          </View>
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={handlePurchase}
          disabled={loading}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaGradient}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.textOnPrimary} />
            ) : (
              <Text style={styles.ctaText}>
                {hasIntroOffer && selectedPlan === "yearly"
                  ? "Start Free Trial"
                  : "Subscribe Now"}
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Reassurance */}
        <View style={styles.reassurance}>
          <Ionicons name="shield-checkmark" size={16} color={COLORS.success} />
          <Text style={styles.reassuranceText}>
            {hasIntroOffer ? "No Payment Now -- Cancel anytime" : "Cancel anytime"}
          </Text>
        </View>

        {/* Restore purchases */}
        <TouchableOpacity style={styles.restoreButton} onPress={handleRestore}>
          <Text style={styles.restoreText}>Restore Purchases</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  closeButton: {
    position: "absolute",
    top: 58,
    right: SPACING.md,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.sm,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  collageHeader: {
    paddingTop: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  collageRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: SPACING.sm,
  },
  collageItem: {
    width: 72,
    height: 72,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.sm,
    ...CLAY_BORDER.subtle,
  },
  collageEmoji: {
    fontSize: 36,
  },
  heading: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "center",
    letterSpacing: -0.5,
    marginBottom: SPACING.xs,
  },
  subheading: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: SPACING.lg,
  },
  featureList: {
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  featureIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primaryMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  featureLabel: {
    fontSize: FONT_SIZE.md,
    fontWeight: "500",
    color: COLORS.text,
  },
  planCards: {
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  planCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    ...SHADOWS.sm,
    ...CLAY_BORDER.subtle,
  },
  planCardSelected: {
    backgroundColor: COLORS.primaryMuted,
    borderColor: COLORS.primary,
    borderTopColor: COLORS.primary,
    borderLeftColor: COLORS.primary,
    borderWidth: 2,
  },
  popularBadge: {
    position: "absolute",
    top: -10,
    left: SPACING.xl,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  popularText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.textOnPrimary,
    letterSpacing: 0.5,
  },
  planRadio: {
    marginRight: SPACING.md,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterSelected: {
    borderColor: COLORS.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  planInfo: {
    flex: 1,
  },
  planTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    color: COLORS.text,
  },
  planPrice: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  planSave: {
    backgroundColor: COLORS.successMuted,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  planSaveText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.success,
  },
  remindRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
    ...SHADOWS.sm,
    ...CLAY_BORDER.subtle,
  },
  remindText: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
    fontWeight: "500",
  },
  socialProof: {
    marginBottom: SPACING.lg,
  },
  proofRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.md,
    gap: SPACING.lg,
  },
  proofItem: {
    alignItems: "center",
  },
  proofNumber: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "800",
    color: COLORS.text,
  },
  proofLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  proofDivider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.border,
  },
  proofStars: {
    flexDirection: "row",
    gap: 2,
  },
  reviewCard: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    ...SHADOWS.sm,
    ...CLAY_BORDER.subtle,
  },
  reviewText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
    lineHeight: 20,
    fontStyle: "italic",
  },
  reviewAuthor: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
    fontWeight: "600",
  },
  ctaButton: {
    width: "100%",
    borderRadius: BORDER_RADIUS.lg,
    overflow: "hidden",
    ...SHADOWS.md,
    ...CLAY_BORDER.light,
  },
  ctaGradient: {
    paddingVertical: SPACING.md + 4,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: BORDER_RADIUS.lg,
  },
  ctaText: {
    color: COLORS.textOnPrimary,
    fontSize: FONT_SIZE.lg,
    fontWeight: "700",
  },
  reassurance: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.xs,
    marginTop: SPACING.md,
  },
  reassuranceText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  restoreButton: {
    alignItems: "center",
    marginTop: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  restoreText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
    fontWeight: "600",
  },
});
