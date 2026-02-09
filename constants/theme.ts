// Claymorphism Design System
// Soft, inflated 3D elements with warm kitchen tones, rounded corners, and layered shadows
//
// Palette anchors:
//   Sky Clay     #90B9D6  – Primary / brand text / main UI accents
//   Soft Peach   #F3A68F  – Secondary / buttons / main cupboard body
//   Fresh Sage   #B4E1C6  – Success states / recipe cupboard door
//   Off-White    #F5F1E6  – Backgrounds / container fills
//   Clay Orange  #E67E45  – High-contrast accents / ingredients

export const COLORS = {
  // Core palette – kitchen-inspired warmth
  primary: "#90B9D6",
  primaryLight: "#B5D1E5",
  primaryDark: "#5E8FAE",
  primaryMuted: "#E0EEF5",

  secondary: "#F3A68F",
  secondaryLight: "#F8C5B6",
  secondaryDark: "#D88A72",
  secondaryMuted: "#FDE8E0",

  // Accent – high-contrast kitchen orange
  accent: "#E67E45",
  accentLight: "#F0A67A",
  accentDark: "#C46530",
  accentMuted: "#FCE8D8",

  // Backgrounds – warm cream, layered depth
  background: "#F5F1E6",
  backgroundWarm: "#F0EBE0",
  surface: "#FAF8F2",
  surfaceElevated: "#FFFFFF",

  // Text – warm contrast
  text: "#3B3229",
  textSecondary: "#7A7068",
  textLight: "#A69E95",
  textOnPrimary: "#FFFFFF",
  textOnDark: "#F5F1E6",

  // Semantic
  success: "#5A9E7A",
  successMuted: "#B4E1C6",
  warning: "#E67E45",
  warningMuted: "#FCE8D8",
  error: "#D96B6B",
  errorMuted: "#F8E0E0",

  // Structural
  border: "#DDD8CC",
  borderLight: "#E8E3D8",
  divider: "#E4DFD4",
  overlay: "rgba(59,50,41,0.35)",

  // Clay-specific
  clayHighlight: "rgba(255,255,255,0.6)",
  clayShadowLight: "rgba(255,255,255,0.8)",
  clayShadowDark: "rgba(154,144,136,0.35)",
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
    shadowColor: "#9A9088",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  // Standard clay - for cards, inputs, containers
  md: {
    shadowColor: "#9A9088",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  // Prominent clay - for floating elements, FABs, modals
  lg: {
    shadowColor: "#9A9088",
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  // Pressed/inset appearance - simulated with colors
  inset: {
    shadowColor: "#A89E95",
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
