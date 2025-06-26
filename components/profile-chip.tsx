import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import { colors, spacingX } from "@/constants/theme";
import { scale } from "@/utils/styling";

type Props = {
  imageUrl: any;
  name: string | null | undefined;
  message: string | null | undefined;
  rightIcon?: React.ReactNode;
  onPress?: () => void;
};

const ProfileChip: React.FC<Props> = ({
  imageUrl,
  name,
  message,
  rightIcon,
  onPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        <Image source={imageUrl} style={styles.profileImage} />
        <View style={styles.textContainer}>
          <Text style={styles.message}>{message}</Text>
          <Text style={styles.name}>{name}</Text>
        </View>
      </View>
      {rightIcon && (
        <TouchableOpacity onPress={onPress}>
          <View style={styles.rightContent}>{rightIcon}</View>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ProfileChip;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacingX._12,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  profileImage: {
    width: scale(45),
    height: scale(45),
    borderRadius: scale(25),
    marginRight: scale(spacingX._12),
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
  message: {
    fontSize: 14,
    color: colors.neutral600,
    fontWeight: "600",
  },
  rightContent: {
    marginLeft: spacingX._12,
  },
});
