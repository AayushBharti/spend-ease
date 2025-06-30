import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import ScreenWrapper from "@/components/screen-wrapper";
import Typo from "@/components/typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import * as Icons from "phosphor-react-native";
import { useRouter } from "expo-router";
import { useFirestoreData } from "@/hooks/use-firestore-data";
import { WalletType } from "@/types";
import { orderBy, where } from "firebase/firestore";
import { useAuth } from "@/context/auth-context";
import WalletListItem from "@/components/wallet-list-item";
import Loading from "@/components/loading";

export default function Wallet() {
  const router = useRouter();
  const { user } = useAuth();

  const {
    data: wallets,
    loading,
    error,
  } = useFirestoreData<WalletType>("wallets", [
    where("uid", "==", user?.uid),
    orderBy("created", "desc"),
  ]);

  // console.log("wallets", wallets);

  // Fetch total balance from API
  const getTotalBalance = () =>
    wallets.reduce((total, item) => {
      total += (item.amount || 0);
      return total;
    }, 0);

  return (
    <ScreenWrapper style={{ backgroundColor: colors.black }}>
      <View style={styles.container}>
        {/* Balance View container */}
        <View style={styles.balanceView}>
          <View style={{ alignItems: "center" }}>
            <Typo size={32} fontWeight={"600"}>
              $ {getTotalBalance()?.toFixed(2)}
            </Typo>
            <Typo size={16} color={colors.neutral350}>
              Total Balance
            </Typo>
          </View>
        </View>
        {/* Wallet container */}
        <View style={styles.wallet}>
          <View style={styles.flexRow}>
            <Typo size={20} fontWeight={"500"}>
              My Wallets
            </Typo>
            <TouchableOpacity
              onPress={() => router.push("/(modals)/wallet-modal")}
            >
              <Icons.PlusCircle
                weight="fill"
                color={colors.primary}
                size={verticalScale(33)}
              />
            </TouchableOpacity>
          </View>

          {/* Wallet list section  */}
          {loading && <Loading />}
          {error && (
            <Typo size={16} color={colors.primary}>
              {error}
            </Typo>
          )}

          <FlatList
            data={wallets}
            renderItem={({ item, index }) => {
              return (
                <WalletListItem item={item} index={index} router={router} />
              );
            }}
            contentContainerStyle={styles.listStyle}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    color: colors.textLight,
  },
  balanceView: {
    height: verticalScale(160),
    backgroundColor: colors.black,
    justifyContent: "center",
    alignItems: "center",
  },
  flexRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY._10,
  },
  wallet: {
    flex: 1,
    backgroundColor: colors.neutral900,
    borderTopRightRadius: radius._30,
    borderTopLeftRadius: radius._30,
    padding: spacingX._20,
    paddingTop: spacingX._25,
  },
  listStyle: {
    paddingVertical: spacingY._15,
    paddingTop: spacingY._15,
  },
});
