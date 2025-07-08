import { StyleSheet, Switch, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import ModalWrapper from "@/components/modal-wrapper";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import Header from "@/components/header";
import BackButton from "@/components/back-button";
import Typo from "@/components/typo";
import * as Icons from "phosphor-react-native";
import { verticalScale } from "@/utils/styling";
import Animated, { FadeInDown } from "react-native-reanimated";
import { OptionType } from "@/types";

const SettingsModal = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const settings: OptionType[] = [
    {
      title: "Dark Mode",
      icon: <Icons.Moon size={26} color={colors.white} weight="fill" />,
      type: "switch",
      value: isDarkMode,
      onChange: (value: boolean) => setIsDarkMode(value),
      bgColor: "#6366f1",
    },
    {
      title: "Notification",
      icon: <Icons.Bell size={26} color={colors.white} weight="fill" />,
      type: "arrow",
      bgColor: "#8b5cf6",
    },
    {
      title: "Language",
      icon: <Icons.Translate size={26} color={colors.white} weight="fill" />,
      type: "text",
      value: "English",
      bgColor: "#ec4899",
    },
    {
      title: "Version",
      icon: <Icons.Info size={26} color={colors.white} weight="fill" />,
      type: "text",
      value: "1.0.0",
      bgColor: "#0ea5e9",
    },
  ];

  const renderRightComponent = (item: OptionType) => {
    switch (item.type) {
      case "switch":
        return (
          <Switch value={item.value as boolean} onValueChange={item.onChange} />
        );
      case "arrow":
        return (
          <Icons.CaretRight
            size={verticalScale(20)}
            weight="bold"
            color={colors.white}
          />
        );
      case "text":
        return (
          <Typo size={14} color={colors.neutral400}>
            {item.value}
          </Typo>
        );
      default:
        return null;
    }
  };

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title="Settings"
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />

        <View style={styles.cardContainer}>
          <View style={styles.settingsSection}>
            {settings.map((item, index) => (
              <Animated.View
                key={index.toString()}
                entering={FadeInDown.delay(index * 50)
                  .springify()
                  .damping(14)}
              >
                {index > 0 && <View style={styles.divider} />}
                <TouchableOpacity
                  onPress={item.onPress}
                  style={styles.settingItem}
                  disabled={item.type === "switch" || item.type === "text"}
                >
                  <View
                    style={[styles.listIcon, { backgroundColor: item.bgColor }]}
                  >
                    {item.icon}
                  </View>
                  <Typo size={16} style={{ flex: 1 }} fontWeight="500">
                    {item.title}
                  </Typo>
                  {renderRightComponent(item)}
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </View>
      </View>
    </ModalWrapper>
  );
};

export default SettingsModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
  },
  cardContainer: {
    backgroundColor: colors.neutral800,
    borderRadius: radius._15,
  },
  settingsSection: {
    gap: 0,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
    paddingVertical: spacingY._12,
  },
  listIcon: {
    height: verticalScale(44),
    width: verticalScale(44),
    backgroundColor: colors.neutral500,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius._15,
    borderCurve: "continuous",
  },
  divider: {
    height: 1,
    backgroundColor: colors.neutral700,
  },
});
