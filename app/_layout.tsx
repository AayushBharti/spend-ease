import { Stack } from "expo-router";
import { View, StyleSheet } from "react-native";
import { AuthProvider } from "@/context/auth-context";
import { colors } from "@/constants/theme";

import "./global.css";

export default function RootLayout() {
  return (
    <AuthProvider>
      <View style={styles.appBackground}>
        <Stack
          screenOptions={{
            headerShown: false,
            // animation: "slide_from_bottom",
            // animationDuration: 100,
          }}
        >
          <Stack.Screen
            name="(modals)/update-profile-modal"
            options={{
              presentation: "modal",
            }}
          />
          <Stack.Screen
            name="(modals)/change-password-modal"
            options={{
              presentation: "transparentModal",
              animation: "default",
            }}
          />
          <Stack.Screen
            name="(modals)/setting-modal"
            options={{
              presentation: "modal",
              // animation: "slide_from_bottom",
            }}
          />

          <Stack.Screen
            name="(modals)/search-modal"
            options={{
              presentation: "modal",
            }}
          />

          <Stack.Screen
            name="(modals)/transaction-modal"
            options={{
              presentation: "modal",
            }}
          />

          <Stack.Screen
            name="(modals)/wallet-modal"
            options={{
              presentation: "modal",
            }}
          />

          <Stack.Screen
            name="(modals)/profile-modal"
            options={{
              presentation: "modal",
            }}
          />
        </Stack>
      </View>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  appBackground: {
    flex: 1,
    backgroundColor: colors.neutral900,
  },
});
