import { create } from "zustand";
import { Platform } from "react-native";
import {
  ENTITLEMENT_ID,
  getCustomerInfo,
  addCustomerInfoUpdateListener,
  type CustomerInfo,
} from "@/lib/revenuecat";

interface SubscriptionState {
  /** Whether the user has an active PantryFy Pro entitlement */
  isPro: boolean;
  /** Full customer info from RevenueCat */
  customerInfo: CustomerInfo | null;
  /** Whether we're currently loading subscription status */
  loading: boolean;
  /** Any error from the last check */
  error: string | null;

  // Actions
  refreshStatus: () => Promise<void>;
  startListening: () => () => void;
  setFromCustomerInfo: (info: CustomerInfo) => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  isPro: false,
  customerInfo: null,
  loading: false,
  error: null,

  setFromCustomerInfo: (info: CustomerInfo) => {
    set({
      customerInfo: info,
      isPro: info.entitlements.active[ENTITLEMENT_ID] !== undefined,
      loading: false,
      error: null,
    });
  },

  refreshStatus: async () => {
    if (Platform.OS === "web") {
      set({ loading: false });
      return;
    }
    set({ loading: true, error: null });
    try {
      const info = await getCustomerInfo();
      if (info) {
        get().setFromCustomerInfo(info);
      } else {
        set({ loading: false });
      }
    } catch (error: any) {
      set({
        loading: false,
        error: error?.message ?? "Failed to check subscription",
      });
    }
  },

  /**
   * Start listening for real-time customer info updates.
   * Returns an unsubscribe function -- call it on cleanup.
   */
  startListening: () => {
    if (Platform.OS === "web") return () => {};
    const unsub = addCustomerInfoUpdateListener((info) => {
      get().setFromCustomerInfo(info);
    });
    return unsub;
  },
}));
