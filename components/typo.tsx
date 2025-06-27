import { Text, TextProps, TextStyle } from "react-native";
import React from "react";
import { colors } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";

export type TypoProps = {
  size?: number;
  color?: string;
  fontWeight?: TextStyle["fontWeight"];
  children: any | null;
  style?: TextStyle;
  textProps?: TextProps;
  className?: string;
};

const Typo = ({
  children,
  size,
  color = colors.text,
  fontWeight = "400",
  style,
  className,
  textProps = {},
}: TypoProps) => {
  const textStyle: TextStyle = {
    fontSize: size ? verticalScale(size) : verticalScale(18),
    color,
    fontWeight,
  };
  return (
    <Text className={className} style={[textStyle, style]} {...textProps}>
      {children}
    </Text>
  );
};

export default Typo;
