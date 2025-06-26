import React from "react";
import { StatusBar, StyleSheet, ViewStyle, StyleProp } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/constants/theme";

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ children, style }) => {
  return (
    <SafeAreaView
      style={[styles.container, style]}
      edges={["top", "left", "right"]}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.neutral900}
        translucent
      />
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral900,
  },
});

export default ScreenWrapper;
