import { StyleSheet } from 'react-native';
import { scale, verticalScale } from "@/utils/styling";

// Default text style that will be applied app-wide
const defaultText = {
  fontFamily: "Quicksand-Regular",
};

export const colors = {
  primary: "#a3e635",
  primaryLight: "#0ea5e9",
  primaryDark: "#0369a1",
  text: "#fff",
  textLight: "#e5e5e5",
  textLighter: "#d4d4d4",
  white: "#fff",
  black: "#000",
  rose: "#ef4444",
  // brightGreen: "#32CD32",
  green: "#16a34a",
  lightGreen: "#E5FBF6",
  neutral50: "#fafafa",
  neutral100: "#f5f5f5",
  neutral200: "#e5e5e5",
  neutral350: "#CCCCCC",
  neutral400: "#a3a3a3",
  neutral500: "#737373",
  neutral600: "#525252",
  neutral700: "#404040",
  neutral800: "#262626",
  neutral900: "#171717",
};

export const englishFonts = {
  displaySmall: {
    ...defaultText,
    fontFamily: "Quicksand-Bold",
    fontSize: 28,
    letterSpacing: 0,
    lineHeight: 44,
  },
  displayMedium: {
    ...defaultText,
    fontFamily: "Quicksand-Bold",
    fontSize: 30,
    letterSpacing: 0,
    lineHeight: 52,
  },
  displayLarge: {
    ...defaultText,
    fontFamily: "Quicksand-Bold",
    fontSize: 30,
    letterSpacing: 0,
    lineHeight: 64,
  },
  headlineLarge: {
    ...defaultText,
    fontFamily: "Quicksand-Bold",
    fontSize: 28,
    letterSpacing: 0,
    lineHeight: 40,
  },
  headlineMedium: {
    ...defaultText,
    fontFamily: "Quicksand-Bold",
    fontSize: 25,
    letterSpacing: 0,
    lineHeight: 36,
  },
  headlineSmall: {
    ...defaultText,
    fontFamily: "Quicksand-Bold",
    fontSize: 22,
    letterSpacing: 0,
    lineHeight: 32,
  },
  titleLarge: {
    ...defaultText,
    fontFamily: "Quicksand-Bold",
    fontSize: 22,
    letterSpacing: 0,
    lineHeight: 28,
  },
  titleMedium: {
    ...defaultText,
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    letterSpacing: 0,
    lineHeight: 24,
  },
  titleSmall: {
    ...defaultText,
    fontFamily: "Quicksand-Bold",
    fontSize: 14,
    letterSpacing: 0,
    lineHeight: 20,
  },
  labelLarge: {
    ...defaultText,
    fontFamily: "Quicksand-SemiBold",
    fontSize: 14,
    letterSpacing: 0,
    lineHeight: 20,
  },
  labelMedium: {
    ...defaultText,
    fontFamily: "Quicksand-SemiBold",
    fontSize: 12,
    letterSpacing: 0,
    lineHeight: 16,
  },
  labelSmall: {
    ...defaultText,
    fontFamily: "Quicksand-SemiBold",
    fontSize: 11,
    letterSpacing: 0,
    lineHeight: 16,
  },
  bodyLarge: {
    ...defaultText,
    fontFamily: "Quicksand-Medium",
    fontSize: 16,
    letterSpacing: 0,
    lineHeight: 24,
  },
  bodyMedium: {
    ...defaultText,
    fontFamily: "Quicksand-Medium",
    fontSize: 14,
    letterSpacing: 0,
    lineHeight: 20,
  },
  bodySmall: {
    ...defaultText,
    fontFamily: "Quicksand-Medium",
    fontSize: 12,
    letterSpacing: 0,
    lineHeight: 16,
  },
};

export const spacingX = {
  _3: scale(3),
  _5: scale(5),
  _7: scale(7),
  _10: scale(10),
  _12: scale(12),
  _15: scale(15),
  _20: scale(20),
  _25: scale(25),
  _30: scale(30),
  _35: scale(35),
  _40: scale(40),
};

export const spacingY = {
  _5: verticalScale(5),
  _7: verticalScale(7),
  _10: verticalScale(10),
  _12: verticalScale(12),
  _15: verticalScale(15),
  _17: verticalScale(17),
  _20: verticalScale(20),
  _25: verticalScale(25),
  _30: verticalScale(30),
  _35: verticalScale(35),
  _40: verticalScale(40),
  _50: verticalScale(50),
  _60: verticalScale(60),
};

export const radius = {
  _3: verticalScale(3),
  _6: verticalScale(6),
  _10: verticalScale(10),
  _12: verticalScale(12),
  _15: verticalScale(15),
  _17: verticalScale(17),
  _20: verticalScale(20),
  _30: verticalScale(30),
};

// Default styles that can be applied app-wide
export const defaultStyles = StyleSheet.create({
  text: defaultText,
  container: {
    flex: 1,
  },
});
