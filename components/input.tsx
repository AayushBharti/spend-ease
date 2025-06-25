import { Pressable, StyleSheet, TextInput, View } from "react-native";
import React, { useState } from "react";
import { verticalScale } from "@/utils/styling";
import { colors, radius, spacingX } from "@/constants/theme";
import { InputProps } from "@/types";
import Typo from "./typo";
import * as Icons from "phosphor-react-native";

const Input = (props: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View
      style={[styles.container, props.containerStyle && props.containerStyle]}
    >
      {props.icon && props.icon}
      <TextInput
        style={[styles.input, props.inputStyle || { fontSize: 16 }]}
        placeholderTextColor={colors.neutral400}
        secureTextEntry={props.type === "password" && !showPassword}
        ref={props.inputRef && props.inputRef}
        {...props}
      />
      {props.type === "currency" && (
        <Typo color={colors.white} size={20} style={styles.currency}>
          ₫
        </Typo>
      )}
      {props.type === "password" && (
        <Pressable onPress={() => setShowPassword(!showPassword)}>
          {showPassword ? (
            <Icons.Eye size={20} color={colors.white} />
          ) : (
            <Icons.EyeSlash size={20} color={colors.white} />
          )}
        </Pressable>
      )}
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: verticalScale(54),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.neutral350,
    borderRadius: radius._17,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._15,
    gap: spacingX._10,
  },
  input: {
    flex: 1,
    color: colors.white,
    fontSize: verticalScale(14),
  },
  currency: {
    bottom: verticalScale(1),
    fontWeight: "500",
  },
});
