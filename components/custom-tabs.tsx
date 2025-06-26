import * as Icons from "phosphor-react-native";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { colors } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";

export default function CustomTabs({ state, descriptors, navigation }: any) {
  const tabbarIcons: any = {
    index: (isFocused: boolean) => (
      <Icons.House
        size={30}
        weight={isFocused ? "fill" : "regular"}
        color={isFocused ? colors.primary : colors.neutral400}
      />
    ),
    statistics: (isFocused: boolean) => (
      <Icons.ChartBar
        size={30}
        weight={isFocused ? "fill" : "regular"}
        color={isFocused ? colors.primary : colors.neutral400}
      />
    ),
    wallet: (isFocused: boolean) => (
      <Icons.Wallet
        size={30}
        weight={isFocused ? "fill" : "regular"}
        color={isFocused ? colors.primary : colors.neutral400}
      />
    ),
    more: (isFocused: boolean) => (
      <Icons.SquaresFour
        size={30}
        weight={isFocused ? "fill" : "regular"}
        color={isFocused ? colors.primary : colors.neutral400}
      />
    ),
  };

  return (
    <View style={styles.tabBar}>
      {state.routes.map((route: any, index: any): any => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.name}
            // href={buildHref(route.name, route.params)}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabBarItem}
          >
            {tabbarIcons[route.name] && tabbarIcons[route.name](isFocused)}
            {/* <View style={{ opacity: isFocused ? 1 : 0, marginTop: 4 }}>
              <Typo size={14} fontWeight={"500"} color={colors.green}>
                {label}
              </Typo>
            </View> */}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    width: "100%",
    height: Platform.OS === "ios" ? verticalScale(73) : verticalScale(55),
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: colors.neutral700,
    borderTopColor: colors.neutral800,
    borderTopWidth: 1,
  },
  tabBarItem: {
    // marginBottom: Platform.OS === "ios" ? spacingY._10 : spacingY._5,
    justifyContent: "center",
    alignItems: "center",
    padding: scale(25),
  },
});
