import { Platform, StyleSheet, View } from "react-native";
import React from "react";
import { colors, spacingY } from "../constants/theme";
import { ModalWrapperProps } from "../types";

const isIos = Platform.OS == "ios";
const ModalWrapper = ({
  style,
  bg = colors.neutral800,
  children,
}: ModalWrapperProps) => {
  return (
    <View style={[styles.container, style && style, { backgroundColor: bg }]}>
      {children}
    </View>
  );
};

export default ModalWrapper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: spacingY._10,
    paddingTop: isIos ? spacingY._15 : 60,
    paddingBottom: isIos ? spacingY._20 : spacingY._20,
  },
});
