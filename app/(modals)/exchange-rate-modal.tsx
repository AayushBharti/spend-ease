import { StyleSheet, ScrollView, View, TextInput } from "react-native";
import React, { useEffect, useState, useMemo } from "react";
import ModalWrapper from "@/components/modal-wrapper";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import BackButton from "@/components/back-button";
import Header from "@/components/header";
import { CurrencyType } from "@/types";
import { fetchCurrencies } from "@/services/currency-service";
import Typo from "@/components/typo";
import { Dropdown } from "react-native-element-dropdown";
import Input from "@/components/input";
import {
  formatCurrency,
  formatNumberInput,
  getNumberInput,
} from "@/utils/common";
import * as Icons from "phosphor-react-native";
import { verticalScale, scale } from "@/utils/styling";
import Animated, { FadeInDown } from "react-native-reanimated";
import Loading from "@/components/loading";

const ExchangeRateModal = () => {
  const [currencies, setCurrencies] = useState<CurrencyType[]>([]);
  const [baseCurrency, setBaseCurrency] = useState<string>("VND");
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetchCurrencies(baseCurrency);
        setCurrencies(response);
      } catch (error) {
        setError(error as string);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [baseCurrency]);

  const filteredCurrencies = useMemo(() => {
    return currencies.filter(
      (currency) =>
        currency.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        currency.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [currencies, searchQuery]);

  const handleAmountChange = (value: string) => {
    const numericValue = getNumberInput(value);
    if (numericValue !== undefined) {
      setAmount(numericValue.toString());
    }
  };

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title={"Exchange Rate"}
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />

        <ScrollView
          contentContainerStyle={styles.scrollViewStyle}
          showsVerticalScrollIndicator={false}
        >
          {/* Currency Selection */}
          <View style={styles.inputContainer}>
            <Typo size={16} fontWeight="600" color={colors.neutral200}>
              Select Currency
            </Typo>
            <Dropdown
              style={styles.dropdownContainer}
              activeColor={colors.neutral700}
              selectedTextStyle={styles.dropdownSelectedItem}
              iconStyle={styles.dropdownIcon}
              data={currencies.map((currency) => ({
                label: `${currency.code} - ${currency.name}`,
                value: currency.code,
              }))}
              maxHeight={300}
              labelField="label"
              valueField="value"
              itemTextStyle={styles.dropdownItemText}
              itemContainerStyle={styles.dropdownItemContainer}
              containerStyle={styles.dropdownListContainer}
              placeholderStyle={styles.dropdownPlaceholder}
              value={baseCurrency}
              onChange={(item) => setBaseCurrency(item.value)}
            />
          </View>

          {/* Amount Input */}
          <View style={styles.inputContainer}>
            <Typo size={16} fontWeight="600" color={colors.neutral200}>
              Amount
            </Typo>
            <Input
              value={formatNumberInput(amount)}
              onChangeText={handleAmountChange}
              keyboardType="numeric"
              placeholder="Enter amount"
              type="normal"
            />
          </View>

          {/* Search */}
          <View style={styles.inputContainer}>
            <Input
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search currency..."
              type="normal"
              icon={
                <Icons.MagnifyingGlass size={20} color={colors.neutral400} />
              }
            />
          </View>

          {/* Conversion List */}
          <View style={styles.inputContainer}>
            <View style={styles.listHeader}>
              <Typo size={16} fontWeight="600" color={colors.neutral200}>
                Conversion Result
              </Typo>
            </View>
            <View style={styles.listContainer}>
              {filteredCurrencies.map((currency, index) => (
                <Animated.View
                  key={currency.code}
                  entering={FadeInDown.delay(index * 50)
                    .springify()
                    .damping(14)}
                >
                  <View style={styles.currencyItem}>
                    <View style={styles.currencyInfo}>
                      <Typo size={17} fontWeight="500">
                        {currency.code}
                      </Typo>
                      <Typo size={14} color={colors.neutral400}>
                        {currency.name}
                      </Typo>
                    </View>
                    <Typo size={17} fontWeight="500" color={colors.green}>
                      {formatCurrency(
                        Number(amount) * currency.value,
                        "vi-VN",
                        currency.code,
                        6
                      )}
                    </Typo>
                  </View>
                  {index < filteredCurrencies.length - 1 && (
                    <View style={styles.divider} />
                  )}
                </Animated.View>
              ))}

              {loading ? (
                <Loading />
              ) : (
                filteredCurrencies.length === 0 && (
                  <Typo
                    size={15}
                    color={colors.neutral400}
                    style={{ textAlign: "center", marginTop: spacingY._15 }}
                  >
                    No available currency
                  </Typo>
                )
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </ModalWrapper>
  );
};

export default ExchangeRateModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
  },
  scrollViewStyle: {
    gap: spacingY._15,
    paddingBottom: verticalScale(100),
  },
  inputContainer: {
    gap: spacingY._10,
  },
  dropdownContainer: {
    height: verticalScale(54),
    borderWidth: 1,
    borderColor: colors.neutral350,
    paddingHorizontal: spacingX._15,
    borderRadius: radius._15,
    borderCurve: "continuous",
  },
  dropdownSelectedItem: {
    color: colors.white,
    fontWeight: "500",
  },
  dropdownItemText: {
    color: colors.white,
  },
  dropdownPlaceholder: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "500",
  },
  dropdownListContainer: {
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
  dropdownItemContainer: {
    borderRadius: radius._15,
    marginHorizontal: spacingX._7,
  },
  dropdownIcon: {
    height: verticalScale(30),
    tintColor: colors.neutral350,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY._10,
  },
  listContainer: {
    backgroundColor: colors.neutral800,
    borderRadius: radius._15,
    overflow: "hidden",
  },
  currencyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacingY._12,
    paddingHorizontal: spacingX._15,
    backgroundColor: colors.neutral800,
  },
  currencyInfo: {
    gap: spacingY._5,
  },
  divider: {
    height: 1,
    backgroundColor: colors.neutral700,
    marginHorizontal: spacingX._15,
  },
});
