import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import Typo from "./typo";
import * as Icons from "phosphor-react-native";
import { useAuth } from "@/context/auth-context";
import { useFirestoreData } from "@/hooks/use-firestore-data";
import { WalletType } from "@/types";
import { orderBy, where } from "firebase/firestore";
import { router } from "expo-router";

const HomeCard = () => {
  const { user } = useAuth();

  // Fetch wallet data
  const walletConstraints = user?.uid
    ? [where("uid", "==", user.uid), orderBy("created", "desc")]
    : [];

  const {
    data: wallets,
    error,
    loading: walletLoading,
  } = useFirestoreData<WalletType>("wallets", walletConstraints, !!user?.uid);

  // Calculate total balance
  const getTotalBalanle = () => {
    return wallets.reduce(
      (totals: any, item: WalletType) => {
        totals.balance = totals.balance + Number(item.amount);
        totals.income = totals.income + Number(item.totalIncome);
        totals.expenses = totals.expenses + Number(item.totalExpenses);
        return totals;
      },
      { balance: 0, income: 0, expenses: 0 }
    );
  };
  return (
    <ImageBackground
      source={require("@/public/images/card.png")}
      resizeMode="stretch"
      style={styles.bgImage}
    >
      <View style={styles.container}>
        <View>
          {/* //total balance section */}
          <View style={styles.totalBalanceRow}>
            <Typo size={17} color={colors.neutral800} fontWeight={"500"}>
              Total Balance
            </Typo>
            <TouchableOpacity onPress={() => router.push("/(tabs)/more")}>
              <Icons.DotsThreeOutline
                size={verticalScale(23)}
                color={colors.black}
                weight="fill"
              />
            </TouchableOpacity>
          </View>
          <Typo size={30} color={colors.black} fontWeight={"bold"}>
            $ {walletLoading ? "----" : getTotalBalanle()?.balance?.toFixed(2)}
          </Typo>
        </View>
        {/* //total income expense */}
        <View style={styles.stats}>
          {/* //total income */}
          <View style={{ gap: verticalScale(5) }}>
            <View style={styles.incomeExpense}>
              <View style={styles.statsIcon}>
                <Icons.ArrowDown
                  size={verticalScale(15)}
                  color={colors.black}
                  weight="bold"
                />
              </View>
              <Typo size={16} color={colors.neutral700} fontWeight={"500"}>
                Income
              </Typo>
            </View>
            <View style={{ alignSelf: "center" }}>
              <Typo size={15} color={colors.green} fontWeight={"600"}>
                ${" "}
                {walletLoading ? "----" : getTotalBalanle()?.income?.toFixed(2)}
              </Typo>
            </View>
          </View>
          {/* //total expenses  */}
          <View style={{ gap: verticalScale(5) }}>
            <View style={styles.incomeExpense}>
              <View style={styles.statsIcon}>
                <Icons.ArrowUp
                  size={verticalScale(15)}
                  color={colors.black}
                  weight="bold"
                />
              </View>
              <Typo size={16} color={colors.neutral700} fontWeight={"500"}>
                Expenses
              </Typo>
            </View>
            <View style={{ alignSelf: "center" }}>
              <Typo size={15} color={colors.rose} fontWeight={"600"}>
                ${" "}
                {walletLoading
                  ? "----"
                  : getTotalBalanle()?.expenses?.toFixed(2)}
              </Typo>
            </View>
          </View>
          {/* end //total expenses  */}
        </View>
      </View>
    </ImageBackground>
  );
};

export default HomeCard;

const styles = StyleSheet.create({
  bgImage: {
    height: scale(210),
    width: "100%",
  },
  container: {
    padding: spacingX._20,
    paddingHorizontal: scale(23),
    height: "87%",
    width: "100%",
    justifyContent: "space-between",
  },
  totalBalanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingX._5,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statsIcon: {
    backgroundColor: colors.neutral350,
    padding: spacingY._5,
    borderRadius: 50,
  },
  incomeExpense: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingY._7,
  },
});
