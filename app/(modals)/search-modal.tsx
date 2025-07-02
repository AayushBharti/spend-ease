import { ScrollView, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { scale } from "@/utils/styling";
import ModalWrapper from "@/components/modal-wrapper";
import HeaderComponent from "@/components/header";
import BackButton from "@/components/back-button";
import TextInput from "@/components/text-input";
import { TransactionType } from "@/types";

import { orderBy, where } from "firebase/firestore";
import { useFirestoreData } from "@/hooks/use-firestore-data";
import { TransactionList } from "@/components/transaction-list";
import { useAuth } from "@/context/auth-context";

const SearchModal = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const constraints = [where("uid", "==", user?.uid), orderBy("date", "desc")];
  const {
    data: allTransactions,
    error,
    loading: recentTransactionsLoading,
  } = useFirestoreData<TransactionType>("transactions", constraints);

  // console.log("Total transactions: ", allTransactions.length);

  const filteredTransactions = allTransactions.filter((item) => {
    if (search.length > 1) {
      if (
        item.category?.toLowerCase()?.includes(search?.toLowerCase()) ||
        item.type?.toLowerCase()?.includes(search?.toLowerCase()) ||
        item.description?.toLowerCase()?.includes(search?.toLowerCase())
      ) {
        return true;
      } else {
        return false;
      }
    }
    return true;
  });

  return (
    <ModalWrapper bg={colors.neutral900}>
      <View style={styles.container}>
        <HeaderComponent
          title={"Search"}
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />

        {/* Form */}
        {/* inputContainer */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Search transaction or wallet"
            value={search}
            placeholderTextColor={colors.neutral400}
            inputStyle={{ color: colors.neutral100 }}
            containerStyle={{ backgroundColor: colors.neutral800 }}
            onChangeText={(value) => setSearch(value)}
          />
        </View>

        <ScrollView contentContainerStyle={styles.form}>
          {/* list of all transactions */}
          <TransactionList
            loading={loading}
            data={filteredTransactions}
            emptyListMessage="No transaction found for this search!"
          />
        </ScrollView>
      </View>
    </ModalWrapper>
  );
};

export default SearchModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacingY._20,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacingX._20,
    gap: scale(12),
    paddingTop: spacingX._15,
    borderTopColor: colors.neutral700,
    marginBottom: spacingX._5,
    borderTopWidth: 1,
  },
  form: {
    gap: spacingY._30,
    marginTop: spacingY._15,
  },

  inputContainer: {
    gap: spacingY._10,
    marginVertical: spacingY._10,
  },
});
