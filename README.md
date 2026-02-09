# PantryFy

A recipe management app built with React Native / Expo, Convex backend, and claymorphism UI. Import recipes from any website or social platform, plan meals, and build grocery lists.

## Tech Stack

- **Frontend**: React Native (Expo SDK 54), Expo Router, Zustand
- **Backend**: Convex (real-time database + server functions)
- **Auth**: Convex Auth (Email OTP via Resend)
- **Payments**: RevenueCat (in-app subscriptions)
- **APIs**: Spoonacular (recipe search), OpenAI (recipe extraction + AI suggestions)

## Getting Started

```bash
cd recipe-app
npm install
```

### 1. Set up Convex

```bash
npx convex dev
```

This connects to the Convex deployment and syncs your backend functions.

### 2. Configure environment variables

Create `.env.local` in the `recipe-app/` directory:

```env
# --- Convex (required) ---
EXPO_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
CONVEX_DEPLOYMENT=dev:your-project
EXPO_PUBLIC_CONVEX_SITE_URL=https://your-project.convex.site

# --- Spoonacular (required for recipe search) ---
EXPO_PUBLIC_SPOONACULAR_KEY=your_spoonacular_api_key
```

### 3. Configure Convex dashboard environment variables

In the [Convex dashboard](https://dashboard.convex.dev) under Settings > Environment Variables, add:

| Variable | Required | Description |
|---|---|---|
| `OPENAI_API_KEY` | Yes | OpenAI API key for recipe extraction and AI suggestions |
| `SPOONACULAR_API_KEY` | Yes | Spoonacular API key (server-side, used by `convex/extract.ts`) |
| `AUTH_RESEND_KEY` | Yes | Resend API key for sending OTP verification emails |
| `SITE_URL` | Yes | Your app URL for auth redirects (e.g. `http://localhost:8081` for dev) |
| `JWT_PRIVATE_KEY` | Yes | RSA private key for signing auth tokens (see setup below) |
| `JWKS` | Yes | JSON Web Key Set for verifying auth tokens (see setup below) |

### 4. Set up auth keys

Generate the JWT key pair for Convex Auth. Run this once:

```bash
node -e "
const { generateKeyPair, exportJWK, exportPKCS8 } = require('jose');
(async () => {
  const keys = await generateKeyPair('RS256', { extractable: true });
  const privateKey = await exportPKCS8(keys.privateKey);
  const publicKey = await exportJWK(keys.publicKey);
  const jwks = JSON.stringify({ keys: [{ use: 'sig', ...publicKey }] });
  console.log('JWT_PRIVATE_KEY=' + JSON.stringify(privateKey.trimEnd().replace(/\\n/g, ' ')));
  console.log('JWKS=' + jwks);
})();
"
```

Copy both values (`JWT_PRIVATE_KEY` and `JWKS`) into the Convex dashboard environment variables.

Also set your Resend API key and site URL in the Convex dashboard:

```bash
npx convex env set AUTH_RESEND_KEY your_resend_api_key
npx convex env set SITE_URL http://localhost:8081
```

Get a free Resend API key at [resend.com](https://resend.com).

### 5. Run the app

```bash
# Start Metro + Expo dev server
npx expo start

# Web
npx expo start --web

# iOS simulator
npx expo start --ios

# Android emulator
npx expo start --android
```

## RevenueCat Integration

PantryFy uses [RevenueCat](https://www.revenuecat.com) for in-app subscription management.

### Architecture

```
lib/revenuecat.ts          -- SDK init, purchases, offerings, customer center
store/subscriptionStore.ts -- Zustand store for real-time subscription state
app/_layout.tsx            -- SDK initialization at app startup
app/paywall.tsx            -- Custom paywall with RC offering data
app/(tabs)/more.tsx        -- Subscription management + Customer Center
```

### Configuration

The API key is hardcoded in `lib/revenuecat.ts`:

```typescript
const RC_API_KEY = "";
```

For production, move this to environment variables:
```env
EXPO_PUBLIC_RC_API_KEY=appl_your_production_key
```

### RevenueCat Dashboard Setup

1. **Project**: Create a project at [app.revenuecat.com](https://app.revenuecat.com)
2. **Store connection**: Connect your App Store Connect / Google Play Console
3. **Products**: Create these products in your store and RevenueCat:
   - `monthly` -- Monthly subscription
   - `yearly` -- Yearly subscription
   - `lifetime` -- One-time lifetime purchase
4. **Entitlement**: Create an entitlement called `PantryFy Pro` and attach all 3 products to it
5. **Offering**: Create a default offering with all 3 packages (monthly, annual, lifetime)
6. **Paywall** (optional): Configure a remote paywall in the RevenueCat dashboard to use the native `RevenueCatUI.presentPaywall()` method

### How It Works

**Initialization** (`app/_layout.tsx`):
- RevenueCat SDK is initialized on native platforms at app startup
- `LOG_LEVEL.VERBOSE` is enabled in `__DEV__` mode
- A customer info listener starts to keep subscription state in sync

**Subscription Store** (`store/subscriptionStore.ts`):
- Zustand store holds `isPro`, `customerInfo`, `loading`, `error`
- `refreshStatus()` fetches latest customer info
- `startListening()` registers a real-time listener for purchase events

**Entitlement Checking**:
```typescript
import { useSubscriptionStore } from "@/store/subscriptionStore";

const { isPro } = useSubscriptionStore();
if (isPro) {
  // User has PantryFy Pro
}
```

**Paywall** (`app/paywall.tsx`):
- Fetches current offering from RevenueCat for real pricing
- Displays 3 plan options: Yearly (with trial badge), Monthly, Lifetime
- Handles `purchasePackage()` with error handling and user cancellation
- Supports `restorePurchases()` with user feedback
- Falls back to hardcoded prices if offerings aren't available

**Native Paywall** (`lib/revenuecat.ts`):
```typescript
import { presentPaywallIfNeeded } from "@/lib/revenuecat";

// Shows RC-hosted paywall only if user doesn't have PantryFy Pro
const purchased = await presentPaywallIfNeeded();
```

**Customer Center** (`lib/revenuecat.ts`):
```typescript
import { presentCustomerCenter } from "@/lib/revenuecat";

// Opens the RC Customer Center for subscription management
await presentCustomerCenter();
```

**Manage Subscription** (`app/(tabs)/more.tsx`):
- Shows current plan status (Free / PantryFy Pro)
- "Upgrade to PantryFy Pro" card when on free plan (triggers native paywall)
- "Manage Subscription" opens Customer Center (cancel, change plan, refund)
- "Restore Purchases" for reinstall recovery

### Testing

RevenueCat's SDK includes a **Preview API Mode** for Expo Go that mocks native calls. For real purchase testing:

```bash
# Build for iOS simulator
eas build --platform ios --profile ios-simulator

# Build for Android
eas build --platform android --profile development
```

Use [sandbox/test accounts](https://www.revenuecat.com/docs/test-and-launch/sandbox) for purchase testing.

### Available Functions (`lib/revenuecat.ts`)

| Function | Description |
|---|---|
| `initRevenueCat()` | Initialize SDK with API key |
| `identifyUser(appUserID)` | Link purchases to a user account |
| `logOutUser()` | Reset to anonymous user |
| `getCustomerInfo()` | Get full customer info object |
| `isProUser()` | Check if PantryFy Pro is active |
| `getCurrentOffering()` | Fetch current offering with packages |
| `getAllOfferings()` | Fetch all configured offerings |
| `purchasePackage(pkg)` | Initiate a purchase |
| `restorePurchases()` | Restore previous purchases |
| `presentPaywall()` | Show native RC paywall |
| `presentPaywallIfNeeded()` | Show paywall only if not entitled |
| `presentCustomerCenter()` | Open subscription management |
| `addCustomerInfoUpdateListener(cb)` | Listen for real-time status changes |

## Environment Variables Summary

### Client-side (`.env.local`)

| Variable | Required | Used By |
|---|---|---|
| `EXPO_PUBLIC_CONVEX_URL` | Yes | `app/_layout.tsx` -- Convex client connection |
| `CONVEX_DEPLOYMENT` | Yes | `npx convex dev` -- links to your Convex project |
| `EXPO_PUBLIC_CONVEX_SITE_URL` | Yes | HTTP action endpoints |
| `EXPO_PUBLIC_SPOONACULAR_KEY` | Yes | `lib/spoonacular.ts` -- recipe search API |

### Server-side (Convex dashboard)

| Variable | Required | Used By |
|---|---|---|
| `OPENAI_API_KEY` | Yes | `convex/ai.ts`, `convex/extract.ts` -- AI recipe parsing |
| `SPOONACULAR_API_KEY` | Yes | `convex/extract.ts` -- server-side recipe extraction |
| `AUTH_RESEND_KEY` | Yes | `convex/ResendOTP.ts` -- Resend API key for sending OTP emails |
| `SITE_URL` | Yes | Convex Auth -- redirect base URL |
| `JWT_PRIVATE_KEY` | Yes | Convex Auth -- RSA private key for signing tokens |
| `JWKS` | Yes | Convex Auth -- JSON Web Key Set for token verification |

### RevenueCat (hardcoded in `lib/revenuecat.ts`)

| Value | Description |
|---|---|
| API Key: `test_CIpvmWfJtXXxgqzOPOwVklbfypl` | RevenueCat project API key |
| Entitlement: `PantryFy Pro` | Pro subscription entitlement |
| Products: `monthly`, `yearly`, `lifetime` | Subscription product identifiers |

## Project Structure

```
recipe-app/
  app/
    _layout.tsx              # Root layout: ConvexAuthProvider, RevenueCat init, navigation guard
    paywall.tsx              # Subscription paywall with RevenueCat offerings
    (onboarding)/            # 8-screen onboarding flow
    (auth)/                  # Sign-in screen (Email OTP)
    (tabs)/                  # Main tab navigation
      index.tsx              # Cookbooks / home screen (recipe import)
      planner.tsx            # Meal planner
      grocery.tsx            # Grocery list
      more.tsx               # Settings / profile / subscription management
    recipes/                 # Recipe search results + detail
  components/                # Shared UI components
  convex/                    # Convex backend (schema, mutations, queries, auth)
  constants/                 # Theme, categories, filters
  hooks/                     # Custom hooks (recipe search, extraction, AI)
  lib/
    revenuecat.ts            # RevenueCat SDK wrapper (init, purchases, paywall, customer center)
    spoonacular.ts           # Spoonacular recipe API
    ...                      # Other utilities
  store/
    subscriptionStore.ts     # Zustand store for subscription state
    onboardingStore.ts       # Zustand store for onboarding state
    filterStore.ts           # Zustand store for recipe filters
    ...                      # Other stores
```
