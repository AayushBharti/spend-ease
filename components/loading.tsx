import { ActivityIndicator, StyleSheet, View } from "react-native";
import React from "react";
import { colors, spacingY } from "@/constants/theme";

const Loading = ({ size = "large", color = colors.primary }: any) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacingY._10,
    marginBottom: spacingY._10,
  },
});
