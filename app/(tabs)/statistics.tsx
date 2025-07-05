import { Alert, ScrollView, StyleSheet, View } from "react-native";
import React, { useState, useEffect } from "react";
import ScreenWrapper from "@/components/screen-wrapper";
import { scale, verticalScale } from "@/utils/styling";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import HeaderComponent from "@/components/header";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { BarChart } from "react-native-gifted-charts";
import LoadingCompenent from "@/components/loading";
import { useAuth } from "@/context/auth-context";
import {
  fetchMonthlyStats,
  fetchWeeklyStats,
  fetchYearlyStats,
} from "@/services/transaction-service";
import { TransactionList } from "@/components/transaction-list";

export default function Statistic() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { user } = useAuth();
  const [chartData, setChartData] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (activeIndex == 0) {
      getWeeklyStats();
    }
    if (activeIndex == 1) {
      getMonthlyStats();
    }
    if (activeIndex == 2) {
      getYearlyStats();
    }
  }, [activeIndex]);

  //functions to gets stats

  const getWeeklyStats = async () => {
    //get weekly stats
    setChartLoading(true);
    let result = await fetchWeeklyStats(user?.uid as string);
    setChartLoading(false);
    if (result.success) {
      setChartData(result?.data?.stats);
      setTransactions(result?.data?.transactions);
    } else {
      console.log(result.msg);
      Alert.alert("Error", result.msg);
    }
  };

  const getMonthlyStats = async () => {
    //get monthly stats
    setChartLoading(true);
    let result = await fetchMonthlyStats(user?.uid as string);
    setChartLoading(false);
    if (result.success) {
      setChartData(result?.data?.stats);
      setTransactions(result?.data?.transactions);
    } else {
      console.log(result.msg);
      Alert.alert("Error", result.msg);
    }
  };

  const getYearlyStats = async () => {
    //get yearly stats
    setChartLoading(true);
    let result = await fetchYearlyStats(user?.uid as string);
    setChartLoading(false);
    if (result.success) {
      setChartData(result?.data?.stats);
      setTransactions(result?.data?.transactions);
    } else {
      console.log(result.msg);
      Alert.alert("Error", result.msg);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <HeaderComponent title="Statistics" />
        </View>
        <SegmentedControl
          values={["Weekly", "Monthly", "Yearly"]}
          selectedIndex={activeIndex}
          onChange={(event: any) => {
            setActiveIndex(event.nativeEvent.selectedSegmentIndex);
          }}
          tintColor={colors.neutral200}
          backgroundColor={colors.neutral800}
          appearance="dark"
          style={styles.segmentStyle}
          activeFontStyle={styles.segmentFontStyle}
          fontStyle={{ ...styles.segmentFontStyle, color: colors.white }}
        />
        {/* //chart graphic data visualisation */}
        <View style={styles.chartContainer}>
          {chartData.length > 0 ? (
            <BarChart
              data={chartData}
              barWidth={scale(12)}
              // spacing={[1, 2].includes(activeIndex) ? scale(25) : scale(16)}
              roundedTop
              roundedBottom
              // hideRules
              rulesColor={colors.neutral700}
              yAxisLabelPrefix="$"
              yAxisThickness={0}
              xAxisThickness={0}
              // yAxisLabelWidth={
              //   [1, 2].includes(activeIndex) ? scale(38) : scale(35)
              // }
              yAxisTextStyle={{ color: colors.neutral350 }}
              xAxisLabelTextStyle={{
                color: colors.neutral350,
                fontSize: verticalScale(12),
              }}
              noOfSections={5}
              minHeight={5}
            />
          ) : (
            <View style={styles.nochart} />
          )}
          {chartLoading && (
            <View style={styles.chartLoadingContainer}>
              <LoadingCompenent color={colors.white} />
            </View>
          )}
        </View>
        <ScrollView
          contentContainerStyle={{
            gap: spacingY._20,
            paddingTop: spacingY._5,
            paddingBottom: verticalScale(100),
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* //transaction list */}
          <TransactionList
            data={transactions}
            title="Transactions"
            emptyListMessage="No transaction for this period"
          />
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  chartContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  chartLoadingContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: radius._12,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  header: {},
  nochart: {
    height: verticalScale(210),
  },
  searchIcon: {
    backgroundColor: colors.neutral700,
    alignItems: "center",
    justifyContent: "center",
    height: verticalScale(35),
    width: verticalScale(35),
    borderCurve: "continuous",
  },
  segmentStyle: {
    height: scale(37),
  },
  segmentFontStyle: {
    fontSize: verticalScale(13),
    fontWeight: "bold",
    color: colors.black,
  },
  container: {
    paddingHorizontal: spacingX._20,
    paddingVertical: spacingY._5,
    gap: spacingY._10,
  },
});
