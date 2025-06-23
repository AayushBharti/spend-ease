import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import ButtonComponent from "@/components/button";
import { colors, spacingX, spacingY } from "@/constants/theme";
import Typo from "@/components/typo";

import { useAuth } from "@/context/auth-context";
import ScreenWrapper from "@/components/screen-wrapper";
import { verticalScale } from "@/utils/styling";
import * as Icons from "phosphor-react-native";
import HomeCard from "@/components/home-card";
import { useRouter } from "expo-router";
import { limit, orderBy, where } from "firebase/firestore";
import { useFirestoreData } from "@/hooks/use-firestore-data";
import { TransactionType } from "@/types";
import { TransactionList } from "@/components/transaction-list";

const Home = () => {
  const { user } = useAuth();
  const router = useRouter();

  // Fetch recent transactions data
  const constraints = user?.uid
    ? [where("uid", "==", user.uid), orderBy("date", "desc"), limit(30)]
    : [];

  const {
    data: recentTransactions,
    error,
    loading: recentTransactionsLoading,
  } = useFirestoreData<TransactionType>(
    "transactions",
    constraints,
    !!user?.uid
  );

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ gap: 4 }}>
            <Typo size={16} color={colors.neutral400}>
              Hello,
            </Typo>
            <Typo size={20} fontWeight={"500"}>
              {user?.name}
            </Typo>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/(modals)/search-modal")}
            style={styles.searchIcon}
          >
            <Icons.MagnifyingGlass
              size={verticalScale(22)}
              color={colors.neutral200}
              weight="bold"
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollViewStyle}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          {/* Homecard component */}
          <View>
            <HomeCard />
          </View>

          <TransactionList
            data={recentTransactions}
            loading={recentTransactionsLoading}
            emptyListMessage="No transactions at the moment!"
            title="Recent Transactions"
          />
        </ScrollView>

        {/* Floating action button */}
        <ButtonComponent
          onPress={() => router.push("/(modals)/transaction-modal")}
          style={styles.floatingButton}
        >
          <Icons.Plus
            size={verticalScale(24)}
            color={colors.black}
            weight="bold"
          />
        </ButtonComponent>
      </View>
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
    marginTop: verticalScale(8),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingX._10,
  },
  searchIcon: {
    backgroundColor: colors.neutral700,
    padding: spacingX._10,
    borderRadius: 50,
  },
  floatingButton: {
    height: verticalScale(50),
    width: verticalScale(50),
    borderRadius: 100,
    position: "absolute",
    bottom: verticalScale(30),
    right: verticalScale(30),
  },
  scrollViewStyle: {
    marginTop: spacingY._10,
    paddingBottom: verticalScale(100),
    gap: spacingY._25,
  },
});
