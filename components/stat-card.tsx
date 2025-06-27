// StatCard.tsx
import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Typo from "./typo";
import { FontAwesome } from "@expo/vector-icons";
import { colors, radius, spacingX } from "@/constants/theme";

type Props = {
  type: "Income" | "Expense";
  amount: number;
  containerStyle?: any;
};

const StatCard = ({ type, amount, containerStyle }: Props) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: type === "Income" ? colors.green : colors.rose },
        ]}
      >
        <FontAwesome
          name={{ Income: "arrow-up", Expense: "arrow-down" }[type] as any}
          size={20}
          color={colors.white}
        />
      </View>
      <View style={styles.textContainer}>
        <Typo fontWeight={"500"} style={styles.typeText}>
          {type}
        </Typo>
        <Typo
          fontWeight={"500"}
          style={styles.amountText}
          color={type === "Income" ? colors.green : colors.rose}
          size={12}
        >
          ${amount.toFixed(2)}
        </Typo>
      </View>
    </View>
  );
};

export default StatCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.text,
    borderRadius: radius._10,
    borderCurve: "continuous",
    padding: spacingX._10,
  },
  iconContainer: {
    borderRadius: 50,
    padding: spacingX._15,
    marginRight: spacingX._10,
  },
  textContainer: {
    flex: 1,
    padding: spacingX._5,
  },
  typeText: {
    marginBottom: 6,
    fontSize: 16,
  },
  amountText: {
    width: "100%",
  },
});
