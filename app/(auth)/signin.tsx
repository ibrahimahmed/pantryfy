import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useAuthActions } from "@convex-dev/auth/react";
import {
  COLORS,
  SPACING,
  FONT_SIZE,
  BORDER_RADIUS,
  SHADOWS,
  CLAY_BORDER,
} from "@/constants/theme";

type Step = "email" | "code";

export default function SignInScreen() {
  const router = useRouter();
  const { signIn } = useAuthActions();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const codeInputRef = useRef<TextInput>(null);

  const handleSendCode = async () => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("email", trimmed);
      await signIn("resend-otp", formData);
      setStep("code");
      setTimeout(() => codeInputRef.current?.focus(), 300);
    } catch (err: any) {
      console.error("Send code error:", err);
      setError("Failed to send verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    const trimmedCode = code.trim();
    if (!trimmedCode || trimmedCode.length < 4) {
      setError("Please enter the verification code");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("email", email.trim().toLowerCase());
      formData.append("code", trimmedCode);
      await signIn("resend-otp", formData);
      router.replace("/(tabs)");
    } catch (err: any) {
      console.error("Verify code error:", err);
      setError("Invalid code. Please check and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setCode("");
    setError("");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("email", email.trim().toLowerCase());
      await signIn("resend-otp", formData);
      if (Platform.OS !== "web") {
        Alert.alert("Code sent", "A new verification code has been sent to your email.");
      }
    } catch (err: any) {
      console.error("Resend code error:", err);
      setError("Failed to resend code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    router.replace("/(tabs)");
  };

  const handleBack = () => {
    setStep("email");
    setCode("");
    setError("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.content}>
          <View style={styles.topSpacer} />

          {/* Logo */}
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={[COLORS.primaryLight, COLORS.primary]}
              style={styles.logoGradient}
            >
              <Text style={styles.logoEmoji}>{"\u{1F373}"}</Text>
            </LinearGradient>
          </View>

          {step === "email" ? (
            <>
              <Text style={styles.title}>Sign in to PantryFy</Text>
              <Text style={styles.subtitle}>
                Enter your email and we'll send you a verification code
              </Text>

              {/* Email input */}
              <View style={styles.inputGroup}>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color={COLORS.textSecondary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="your@email.com"
                    placeholderTextColor={COLORS.textLight}
                    value={email}
                    onChangeText={(t) => {
                      setEmail(t);
                      setError("");
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="email"
                    returnKeyType="go"
                    onSubmitEditing={handleSendCode}
                    editable={!loading}
                  />
                </View>

                {error ? (
                  <Text style={styles.errorText}>{error}</Text>
                ) : null}

                <TouchableOpacity
                  style={[styles.primaryButton, loading && styles.buttonDisabled]}
                  onPress={handleSendCode}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={[COLORS.primary, COLORS.primaryDark]}
                    style={styles.primaryButtonGradient}
                  >
                    {loading ? (
                      <ActivityIndicator color="#FFF" size="small" />
                    ) : (
                      <Text style={styles.primaryButtonText}>
                        Send Verification Code
                      </Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              {/* Back button */}
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBack}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="arrow-back"
                  size={20}
                  color={COLORS.textSecondary}
                />
                <Text style={styles.backButtonText}>Change email</Text>
              </TouchableOpacity>

              <Text style={styles.title}>Check your email</Text>
              <Text style={styles.subtitle}>
                We sent a code to{" "}
                <Text style={styles.emailHighlight}>
                  {email.trim().toLowerCase()}
                </Text>
              </Text>

              {/* Code input */}
              <View style={styles.inputGroup}>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="keypad-outline"
                    size={20}
                    color={COLORS.textSecondary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    ref={codeInputRef}
                    style={styles.input}
                    placeholder="Enter 4-digit code"
                    placeholderTextColor={COLORS.textLight}
                    value={code}
                    onChangeText={(t) => {
                      setCode(t);
                      setError("");
                    }}
                    keyboardType="number-pad"
                    autoComplete="one-time-code"
                    maxLength={4}
                    returnKeyType="go"
                    onSubmitEditing={handleVerifyCode}
                    editable={!loading}
                  />
                </View>

                {error ? (
                  <Text style={styles.errorText}>{error}</Text>
                ) : null}

                <TouchableOpacity
                  style={[styles.primaryButton, loading && styles.buttonDisabled]}
                  onPress={handleVerifyCode}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={[COLORS.primary, COLORS.primaryDark]}
                    style={styles.primaryButtonGradient}
                  >
                    {loading ? (
                      <ActivityIndicator color="#FFF" size="small" />
                    ) : (
                      <Text style={styles.primaryButtonText}>Verify & Sign In</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                {/* Resend */}
                <TouchableOpacity
                  style={styles.resendButton}
                  onPress={handleResendCode}
                  disabled={loading}
                  activeOpacity={0.7}
                >
                  <Text style={styles.resendText}>
                    Didn't get the code?{" "}
                    <Text style={styles.resendBold}>Resend</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* Skip */}
          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkip}
            activeOpacity={0.7}
          >
            <Text style={styles.skipText}>Skip for now</Text>
          </TouchableOpacity>

          <View style={{ flex: 1 }} />

          {/* Disclaimer */}
          <Text style={styles.disclaimer}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>

          <View style={styles.bottomSpacer} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    alignItems: "center",
  },
  topSpacer: {
    height: SPACING.xxl * 1.5,
  },
  logoContainer: {
    borderRadius: 32,
    overflow: "hidden",
    marginBottom: SPACING.xl,
    ...SHADOWS.lg,
    ...CLAY_BORDER.light,
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  logoEmoji: {
    fontSize: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: SPACING.sm,
    lineHeight: 22,
    paddingHorizontal: SPACING.md,
  },
  emailHighlight: {
    color: COLORS.primary,
    fontWeight: "700",
  },
  inputGroup: {
    width: "100%",
    gap: SPACING.md,
    marginTop: SPACING.xl,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
    ...SHADOWS.md,
    ...CLAY_BORDER.medium,
  },
  inputIcon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    paddingVertical: SPACING.md + 2,
  },
  primaryButton: {
    width: "100%",
    borderRadius: BORDER_RADIUS.lg,
    overflow: "hidden",
    ...SHADOWS.md,
    ...CLAY_BORDER.light,
  },
  primaryButtonGradient: {
    paddingVertical: SPACING.md + 2,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: BORDER_RADIUS.lg,
  },
  primaryButtonText: {
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZE.sm,
    textAlign: "center",
    marginTop: -SPACING.xs,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: SPACING.xs,
    marginBottom: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  backButtonText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  resendButton: {
    paddingVertical: SPACING.sm,
    alignItems: "center",
  },
  resendText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  resendBold: {
    color: COLORS.primary,
    fontWeight: "700",
  },
  skipButton: {
    marginTop: SPACING.lg,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
  },
  skipText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  disclaimer: {
    fontSize: 11,
    color: COLORS.textLight,
    textAlign: "center",
    lineHeight: 16,
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.sm,
  },
  bottomSpacer: {
    height: SPACING.xl,
  },
});
