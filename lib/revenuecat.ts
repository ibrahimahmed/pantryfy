import { Platform } from "react-native";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Your RevenueCat API key (same for both platforms during testing) */
const RC_API_KEY = process.env.EXPO_PUBLIC_RC_API_KEY;
if (!RC_API_KEY) {
  throw new Error("EXPO_PUBLIC_RC_API_KEY is not set");
}

/** The entitlement identifier configured in the RevenueCat dashboard */
export const ENTITLEMENT_ID = "PantryFy Pro";

/** Product identifiers configured in RevenueCat */
export const PRODUCT_IDS = {
  monthly: "monthly",
  yearly: "yearly",
  lifetime: "lifetime",
} as const;

// ---------------------------------------------------------------------------
// Lazy-load the SDK so the module is safe to import on web
// ---------------------------------------------------------------------------

let _Purchases: typeof import("react-native-purchases").default | null = null;
let _RevenueCatUI: typeof import("react-native-purchases-ui").default | null =
  null;
let _LOG_LEVEL: typeof import("react-native-purchases").LOG_LEVEL | null = null;
let _PAYWALL_RESULT:
  | typeof import("react-native-purchases-ui").PAYWALL_RESULT
  | null = null;

function getPurchases() {
  if (Platform.OS === "web") return null;
  if (_Purchases) return _Purchases;
  try {
    const mod = require("react-native-purchases");
    _Purchases = mod.default;
    _LOG_LEVEL = mod.LOG_LEVEL;
    return _Purchases;
  } catch {
    return null;
  }
}

function getRevenueCatUI() {
  if (Platform.OS === "web") return null;
  if (_RevenueCatUI) return _RevenueCatUI;
  try {
    const mod = require("react-native-purchases-ui");
    _RevenueCatUI = mod.default;
    _PAYWALL_RESULT = mod.PAYWALL_RESULT;
    return _RevenueCatUI;
  } catch {
    return null;
  }
}

export function getPaywallResult() {
  if (!_PAYWALL_RESULT) getRevenueCatUI();
  return _PAYWALL_RESULT;
}

// ---------------------------------------------------------------------------
// Initialization
// ---------------------------------------------------------------------------

let _initialized = false;

/**
 * Initialize the RevenueCat SDK. Call once at app startup.
 * Sets VERBOSE log level in __DEV__ for easier debugging.
 */
export async function initRevenueCat(): Promise<void> {
  if (Platform.OS === "web" || _initialized) return;

  const Purchases = getPurchases();
  if (!Purchases || !_LOG_LEVEL) return;

  try {
    if (__DEV__) {
      Purchases.setLogLevel(_LOG_LEVEL.VERBOSE);
    }

    Purchases.configure({ apiKey: RC_API_KEY });
    _initialized = true;
    console.log("[RevenueCat] SDK initialized");
  } catch (error) {
    console.warn("[RevenueCat] Init failed:", error);
  }
}

// ---------------------------------------------------------------------------
// Customer identity
// ---------------------------------------------------------------------------

/**
 * Identify a logged-in user in RevenueCat so purchases are tied
 * to their account across devices / platforms.
 */
export async function identifyUser(appUserID: string): Promise<void> {
  const Purchases = getPurchases();
  if (!Purchases) return;
  try {
    const { customerInfo } = await Purchases.logIn(appUserID);
    console.log("[RevenueCat] Identified user:", appUserID);
    return;
  } catch (error) {
    console.error("[RevenueCat] Identify error:", error);
  }
}

/**
 * Log the current user out of RevenueCat (generates a new anonymous ID).
 */
export async function logOutUser(): Promise<void> {
  const Purchases = getPurchases();
  if (!Purchases) return;
  try {
    await Purchases.logOut();
  } catch (error) {
    console.error("[RevenueCat] Logout error:", error);
  }
}

// ---------------------------------------------------------------------------
// Customer info & entitlement checking
// ---------------------------------------------------------------------------

export type CustomerInfo = {
  entitlements: {
    active: Record<string, any>;
    all: Record<string, any>;
  };
  activeSubscriptions: string[];
  allPurchasedProductIdentifiers: string[];
  managementURL: string | null;
  originalAppUserId: string;
};

/**
 * Fetch the latest CustomerInfo from RevenueCat.
 */
export async function getCustomerInfo(): Promise<CustomerInfo | null> {
  const Purchases = getPurchases();
  if (!Purchases) return null;
  try {
    const info = await Purchases.getCustomerInfo();
    return info as unknown as CustomerInfo;
  } catch (error) {
    console.error("[RevenueCat] Customer info error:", error);
    return null;
  }
}

/**
 * Check whether the current user has the "PantryFy Pro" entitlement active.
 */
export async function isProUser(): Promise<boolean> {
  const info = await getCustomerInfo();
  if (!info) return false;
  return info.entitlements.active[ENTITLEMENT_ID] !== undefined;
}

// ---------------------------------------------------------------------------
// Offerings & packages
// ---------------------------------------------------------------------------

export type RCOffering = {
  identifier: string;
  availablePackages: RCPackage[];
  monthly: RCPackage | null;
  annual: RCPackage | null;
  lifetime: RCPackage | null;
};

export type RCPackage = {
  identifier: string;
  packageType: string;
  product: {
    identifier: string;
    title: string;
    description: string;
    price: number;
    priceString: string;
    currencyCode: string;
    introPrice: {
      price: number;
      priceString: string;
      period: string;
      periodUnit: string;
      periodNumberOfUnits: number;
      cycles: number;
    } | null;
  };
};

/**
 * Fetch the current offering from RevenueCat.
 */
export async function getCurrentOffering(): Promise<RCOffering | null> {
  const Purchases = getPurchases();
  if (!Purchases) return null;
  try {
    const offerings = await Purchases.getOfferings();
    return (offerings.current as unknown as RCOffering) ?? null;
  } catch (error) {
    console.error("[RevenueCat] Offerings error:", error);
    return null;
  }
}

/**
 * Fetch all offerings (useful if you have multiple).
 */
export async function getAllOfferings(): Promise<Record<
  string,
  RCOffering
> | null> {
  const Purchases = getPurchases();
  if (!Purchases) return null;
  try {
    const offerings = await Purchases.getOfferings();
    return offerings.all as unknown as Record<string, RCOffering>;
  } catch (error) {
    console.error("[RevenueCat] All offerings error:", error);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Purchases
// ---------------------------------------------------------------------------

export type PurchaseResult = {
  customerInfo: CustomerInfo;
  productIdentifier: string;
};

/**
 * Purchase a specific package. Returns null if the user cancelled.
 */
export async function purchasePackage(
  pkg: RCPackage
): Promise<PurchaseResult | null> {
  const Purchases = getPurchases();
  if (!Purchases) return null;
  try {
    const result = await Purchases.purchasePackage(pkg as any);
    return {
      customerInfo: result.customerInfo as unknown as CustomerInfo,
      productIdentifier: result.productIdentifier,
    };
  } catch (error: any) {
    if (error.userCancelled) {
      console.log("[RevenueCat] Purchase cancelled by user");
      return null;
    }
    console.error("[RevenueCat] Purchase error:", error);
    throw error;
  }
}

/**
 * Restore previous purchases (e.g. after reinstalling).
 */
export async function restorePurchases(): Promise<CustomerInfo | null> {
  const Purchases = getPurchases();
  if (!Purchases) return null;
  try {
    const info = await Purchases.restorePurchases();
    console.log("[RevenueCat] Purchases restored");
    return info as unknown as CustomerInfo;
  } catch (error) {
    console.error("[RevenueCat] Restore error:", error);
    return null;
  }
}

// ---------------------------------------------------------------------------
// RevenueCat native paywall (from react-native-purchases-ui)
// ---------------------------------------------------------------------------

/**
 * Present the RevenueCat-hosted native paywall.
 * Returns true if a purchase or restore was made.
 */
export async function presentPaywall(): Promise<boolean> {
  const RevenueCatUI = getRevenueCatUI();
  const PR = getPaywallResult();
  if (!RevenueCatUI || !PR) return false;
  try {
    const result = await RevenueCatUI.presentPaywall();
    return result === PR.PURCHASED || result === PR.RESTORED;
  } catch (error) {
    console.error("[RevenueCat] Present paywall error:", error);
    return false;
  }
}

/**
 * Present the RevenueCat-hosted native paywall only if the user
 * does NOT have the PantryFy Pro entitlement.
 * Returns true if a purchase or restore was made.
 */
export async function presentPaywallIfNeeded(): Promise<boolean> {
  const RevenueCatUI = getRevenueCatUI();
  const PR = getPaywallResult();
  if (!RevenueCatUI || !PR) return false;
  try {
    const result = await RevenueCatUI.presentPaywallIfNeeded({
      requiredEntitlementIdentifier: ENTITLEMENT_ID,
    });
    return result === PR.PURCHASED || result === PR.RESTORED;
  } catch (error) {
    console.error("[RevenueCat] Present paywall if needed error:", error);
    return false;
  }
}

// ---------------------------------------------------------------------------
// Customer Center (manage subscription)
// ---------------------------------------------------------------------------

/**
 * Present the RevenueCat Customer Center where users can manage
 * their subscription (cancel, change plan, request refund, etc.).
 */
export async function presentCustomerCenter(): Promise<void> {
  const RevenueCatUI = getRevenueCatUI();
  if (!RevenueCatUI) return;
  try {
    await (RevenueCatUI as any).presentCustomerCenter();
  } catch (error) {
    console.error("[RevenueCat] Customer center error:", error);
  }
}

// ---------------------------------------------------------------------------
// Listener for real-time customer info updates
// ---------------------------------------------------------------------------

/**
 * Add a listener that fires whenever the customer info changes
 * (e.g. a purchase completes, subscription expires, etc.)
 * Returns an unsubscribe function.
 */
export function addCustomerInfoUpdateListener(
  callback: (info: CustomerInfo) => void
): () => void {
  const Purchases = getPurchases();
  if (!Purchases) return () => {};
  const subscription: any = Purchases.addCustomerInfoUpdateListener(
    (info: any) => {
      callback(info as unknown as CustomerInfo);
    }
  );
  return () => {
    subscription?.remove?.();
  };
}
