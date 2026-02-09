// Claymorphism Design System
// Soft, inflated 3D elements with pastel tones, rounded corners, and layered shadows

export const COLORS = {
  // Core palette - warm pastels
  primary: "#7C6AEF",
  primaryLight: "#B4A7F5",
  primaryDark: "#5B48C2",
  primaryMuted: "#EDE9FE",

  secondary: "#F59E6C",
  secondaryLight: "#FBC4A0",
  secondaryDark: "#D97B3F",
  secondaryMuted: "#FFF0E6",

  // Backgrounds - soft, layered depth
  background: "#E8EAF0",
  backgroundWarm: "#F0ECF8",
  surface: "#F5F6FA",
  surfaceElevated: "#FFFFFF",

  // Text - muted, comfortable contrast
  text: "#2D3142",
  textSecondary: "#6B7394",
  textLight: "#9CA3C0",
  textOnPrimary: "#FFFFFF",
  textOnDark: "#F0F0F5",

  // Semantic
  success: "#5CB87A",
  successMuted: "#E3F5E9",
  warning: "#F5B944",
  warningMuted: "#FFF6E0",
  error: "#E86161",
  errorMuted: "#FDE8E8",

  // Structural
  border: "#D5D9E2",
  borderLight: "#E8ECF4",
  divider: "#E2E6EF",
  overlay: "rgba(45,49,66,0.35)",

  // Clay-specific
  clayHighlight: "rgba(255,255,255,0.6)",
  clayShadowLight: "rgba(255,255,255,0.8)",
  clayShadowDark: "rgba(149,157,180,0.35)",
  clayInnerGlow: "rgba(255,255,255,0.45)",
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FONT_SIZE = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
};

export const BORDER_RADIUS = {
  sm: 12,
  md: 18,
  lg: 24,
  xl: 32,
  full: 9999,
};

// Claymorphism shadow system
// Combines a soft outer shadow with elevated feel
export const SHADOWS = {
  // Subtle clay - for chips, badges, small elements
  sm: {
    shadowColor: "#8B93A8",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  // Standard clay - for cards, inputs, containers
  md: {
    shadowColor: "#8B93A8",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  // Prominent clay - for floating elements, FABs, modals
  lg: {
    shadowColor: "#8B93A8",
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  // Pressed/inset appearance - simulated with colors
  inset: {
    shadowColor: "#A0A8BE",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 1,
  },
};

// Claymorphism border style to simulate inner highlight/glow
export const CLAY_BORDER = {
  light: {
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.7)",
    borderTopColor: "rgba(255,255,255,0.9)",
    borderLeftColor: "rgba(255,255,255,0.85)",
  },
  medium: {
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.6)",
    borderTopColor: "rgba(255,255,255,0.85)",
    borderLeftColor: "rgba(255,255,255,0.8)",
  },
  subtle: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
    borderTopColor: "rgba(255,255,255,0.7)",
    borderLeftColor: "rgba(255,255,255,0.65)",
  },
};
