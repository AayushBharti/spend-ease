import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import Typo from "@/components/typo";
import ModalWrapper from "@/components/modal-wrapper";
import HeaderComponent from "@/components/header";
import BackButton from "@/components/back-button";
import * as Icons from "phosphor-react-native";
import TextInputComponent from "@/components/text-input";
import { TransactionType, WalletType } from "@/types";
import ButtonComponent from "@/components/button";
import { useLocalSearchParams, useRouter } from "expo-router";
import ImageUpload from "@/components/image-upload";
import { Dropdown } from "react-native-element-dropdown";
import { expenseCategories, transactionTypes } from "@/constants/data";
import { useAuth } from "@/context/auth-context";
import { useFirestoreData } from "@/hooks/use-firestore-data";
import { orderBy, where } from "firebase/firestore";
import {
  createOrUpdateTransaction,
  deleteTransaction,
} from "@/services/transaction-service";
import DateTimePicker from "@react-native-community/datetimepicker";

const TransactionModal = () => {
  const { user } = useAuth();
  const [transaction, setTransactionData] = useState<TransactionType>({
    type: "expense",
    amount: 0,
    description: "",
    category: "",
    date: new Date(),
    walletId: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const router = useRouter();

  const {
    data: wallets,
    loading: walletLoading,
    error: walletError,
  } = useFirestoreData<WalletType>("wallets", [
    where("uid", "==", user?.uid),
    orderBy("created", "desc"),
  ]);

  //retrieve data from wallte to update
  const oldTransaction: any = useLocalSearchParams();

  const onDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || transaction.date;
    setTransactionData({ ...transaction, date: currentDate });
    setShowDatePicker(Platform.OS == "ios" ? true : false);
  };

  useEffect(() => {
    if (oldTransaction?.id) {
      setTransactionData({
        type: oldTransaction?.type,
        amount: Number(oldTransaction?.amount),
        description: oldTransaction.description || "",
        category: oldTransaction.category || "",
        date: new Date(oldTransaction.date),
        walletId: oldTransaction.walletId,
        image: oldTransaction?.image,
      });
    }
  }, []);

  //onsublmit function
  const onSubmit = async () => {
    const { type, amount, description, category, date, walletId, image } =
      transaction;
    if (
      !type ||
      !amount ||
      (type == "expense" && !category) ||
      !date ||
      !walletId
    ) {
      Alert.alert("Transaction", "Please fill in all required fields");
      return;
    }
    let transactionData: TransactionType = {
      type,
      amount,
      description,
      category,
      date,
      walletId,
      image: image ? image : null,
      uid: user?.uid,
    };

    // include transaction id
    if (oldTransaction?.id) transactionData.id = oldTransaction.id;
    setLoading(true);
    const result = await createOrUpdateTransaction(transactionData);
    setLoading(false);
    if (result.success) {
      //update user
      router.back();
      Alert.alert("Transaction", "Transaction added successfully");
    } else {
      Alert.alert("Transaction", result.msg);
    }
  };

  const OnDelete = async () => {
    if (!oldTransaction?.id) return;
    setLoading(true);
    const result = await deleteTransaction(
      oldTransaction?.id,
      oldTransaction?.walletId
    );
    setLoading(false);
    if (result!.success) {
      //update user
      router.back();
      Alert.alert("Wallet", "Wallet deleted successfully");
    } else {
      Alert.alert("Wallet", result!.msg);
    }
  };

  //Function show delete alert for deleting wallet
  const showDeleteAlert = () => {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction?  \nThis action will delete all data related to this transaction.",
      [
        { text: "Cancel", onPress: () => {}, style: "cancel" },
        {
          text: "Delete",
          onPress: () => OnDelete(),
          style: "destructive",
        },
      ]
    );
  };

  // const renderLabel = () => {
  //   if (value || isFocus) {
  //     return (
  //       <Text style={[styles.label, isFocus && { color: "blue" }]}>
  //         Dropdown label
  //       </Text>
  //     );
  //   }
  //   return null;
  // };

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <HeaderComponent
          title={oldTransaction?.id ? "Update transaction" : "New Transaction"}
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />

        {/* Form */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.form}
        >
          {/* inputContainer */}
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200} size={16}>
              Type
            </Typo>
            {/* drop down input */}
            <Dropdown
              style={styles.dropDownContainer}
              activeColor={colors.neutral700}
              placeholderStyle={styles.dropdownPlaceholder}
              selectedTextStyle={styles.dropDownSelectedText}
              iconStyle={styles.dropDownIcon}
              data={transactionTypes}
              maxHeight={300}
              labelField="label"
              valueField="value"
              itemTextStyle={styles.dropDownItemText}
              itemContainerStyle={styles.dropdownItemContainer}
              containerStyle={styles.dropDownListContainer}
              value={transaction.type}
              onChange={(item) => {
                setTransactionData({ ...transaction, type: item.value });
              }}
            />
          </View>

          {/* inputContainer */}
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Wallet</Typo>
            {/* drop down input */}
            <Dropdown
              style={styles.dropDownContainer}
              activeColor={colors.neutral700}
              placeholderStyle={styles.dropdownPlaceholder}
              selectedTextStyle={styles.dropDownSelectedText}
              iconStyle={styles.dropDownIcon}
              data={wallets?.map((wallet) => ({
                label: `${wallet?.name} ($ ${wallet.amount})`,
                value: wallet?.id,
              }))}
              maxHeight={300}
              labelField="label"
              valueField="value"
              itemTextStyle={styles.dropDownItemText}
              itemContainerStyle={styles.dropdownItemContainer}
              containerStyle={styles.dropDownListContainer}
              placeholder={"Select a wallet"}
              value={transaction.walletId}
              onChange={(item) => {
                setTransactionData({
                  ...transaction,
                  walletId: item.value || "",
                });
              }}
            />
          </View>

          {/* expense category Container */}
          {transaction.type == "expense" && (
            <View style={styles.inputContainer}>
              <Typo color={colors.neutral200} size={16}>
                Expense Category
              </Typo>
              {/* drop down input */}
              <Dropdown
                style={styles.dropDownContainer}
                activeColor={colors.neutral700}
                placeholderStyle={styles.dropdownPlaceholder}
                selectedTextStyle={styles.dropDownSelectedText}
                iconStyle={styles.dropDownIcon}
                data={Object.values(expenseCategories)}
                maxHeight={300}
                labelField="label"
                valueField="value"
                itemTextStyle={styles.dropDownItemText}
                itemContainerStyle={styles.dropdownItemContainer}
                containerStyle={styles.dropDownListContainer}
                placeholder={"Select a category"}
                value={transaction.category}
                onChange={(item) => {
                  setTransactionData({
                    ...transaction,
                    category: item.value || "",
                  });
                }}
              />
            </View>
          )}

          {/* input Container end */}

          {/* Date picker */}
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200} size={16}>
              Date
            </Typo>
            {!showDatePicker && (
              <Pressable
                style={styles.dateInput}
                onPress={() => setShowDatePicker(true)}
              >
                <Typo size={14}>
                  {(transaction.date as Date).toLocaleDateString()}
                </Typo>
              </Pressable>
            )}
            {showDatePicker && (
              <View style={Platform.OS == "ios" && styles.iosDatePicker}>
                <DateTimePicker
                  themeVariant="dark"
                  value={transaction.date as Date}
                  textColor={colors.white}
                  mode="date"
                  display={Platform.OS == "ios" ? "spinner" : "default"}
                  onChange={onDateChange}
                />
                {Platform.OS == "ios" && (
                  <TouchableOpacity
                    style={styles.datePickerButton}
                    onPress={() => setShowDatePicker(false)}
                  >
                    <Typo size={15} color={colors.primary} fontWeight={"500"}>
                      Confirm
                    </Typo>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>

          {/* amount expense - income */}
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200} size={16}>
              Amount
            </Typo>
            <TextInputComponent
              keyboardType="numeric"
              value={transaction.amount?.toString()}
              onChangeText={(value) =>
                setTransactionData({
                  ...transaction,
                  amount: Number(value.replace(/[^0-9]/g, "")),
                })
              }
            />
          </View>

          {/* description of transaction */}

          <View style={styles.inputContainer}>
            <View style={styles.flexRow}>
              <Typo color={colors.neutral200} size={16}>
                Description
              </Typo>
              <Typo color={colors.neutral500} size={14}>
                {" "}
                (Optional)
              </Typo>
            </View>
            <TextInputComponent
              value={transaction.description}
              multiline
              containerStyle={styles.transactionDesc}
              onChangeText={(value) =>
                setTransactionData({
                  ...transaction,
                  description: value,
                })
              }
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.flexRow}>
              <Typo color={colors.neutral200} size={16}>
                Receipt
              </Typo>
              <Typo color={colors.neutral500} size={14}>
                {" "}
                (Optional)
              </Typo>
            </View>
            {/* Image input */}
            <ImageUpload
              file={transaction.image}
              onSelect={(file) =>
                setTransactionData({ ...transaction, image: file })
              }
              onClear={() =>
                setTransactionData({ ...transaction, image: null })
              }
              placeholder="Add an image"
            />
          </View>
        </ScrollView>
      </View>
      {/* footer area*/}
      <View style={styles.footer}>
        {oldTransaction?.id && !loading && (
          <ButtonComponent
            onPress={showDeleteAlert}
            style={{
              backgroundColor: colors.rose,
              paddingHorizontal: spacingX._15,
            }}
          >
            <Icons.Trash
              color={colors.white}
              size={verticalScale(24)}
              weight="bold"
            />
          </ButtonComponent>
        )}
        <ButtonComponent
          onPress={onSubmit}
          loading={loading}
          style={{ flex: 1 }}
        >
          <Typo color={colors.black} fontWeight={"800"}>
            {oldTransaction?.id ? "Update" : "Submit"}
          </Typo>
        </ButtonComponent>
      </View>
    </ModalWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingY._20,
  },
  form: {
    gap: spacingY._20,
    paddingVertical: spacingY._15,
    paddingBottom: spacingY._40,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: spacingX._20,
    gap: scale(12),
    paddingTop: spacingX._15,
    borderTopColor: colors.neutral700,
    borderTopWidth: 1,
  },
  inputContainer: {
    gap: spacingY._10,
  },
  androidDropDown: {
    height: verticalScale(54),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    fontSize: verticalScale(14),
    color: colors.white,
    borderColor: colors.neutral350,
    borderRadius: radius._17,
    borderCurve: "continuous",
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._5,
  },
  dateInput: {
    flexDirection: "row",
    height: verticalScale(54),
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.neutral350,
    borderRadius: radius._17,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._15,
  },
  iosDatePicker: {},
  datePickerButton: {
    backgroundColor: colors.neutral700,
    alignSelf: "flex-end",
    padding: spacingY._7,
    marginRight: spacingX._7,
    paddingHorizontal: spacingY._15,
    borderRadius: radius._10,
  },
  dropDownContainer: {
    height: verticalScale(54),
    borderWidth: 1,
    borderColor: colors.neutral350,
    paddingHorizontal: spacingX._15,
    borderRadius: radius._15,
    borderCurve: "continuous",
  },
  dropDownItemText: {
    color: colors.white,
  },
  dropDownSelectedText: {
    color: colors.white,
    fontSize: verticalScale(14),
  },
  dropDownListContainer: {
    backgroundColor: colors.neutral900,
    borderRadius: radius._15,
    borderCurve: "continuous",
    paddingVertical: spacingY._7,
    top: 5,
    borderColor: colors.neutral500,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 5,
  },
  dropdownPlaceholder: {
    color: colors.white,
  },
  dropdownItemContainer: {
    borderRadius: radius._15,
    marginHorizontal: spacingX._7,
  },
  dropDownIcon: {
    height: verticalScale(30),
    tintColor: colors.neutral350,
  },
  transactionDesc: {
    flexDirection: "row",
    height: verticalScale(100),
    alignItems: "flex-start",
    paddingVertical: 15,
  },
});

export default TransactionModal;
