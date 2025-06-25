import { Alert, ScrollView, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { scale } from "@/utils/styling";
import ModalWrapper from "@/components/modal-wrapper";
import Header from "@/components/header";
import BackButton from "@/components/back-button";
import Typo from "@/components/typo";
import Input from "@/components/input";
import Button from "@/components/button";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "expo-router";
import * as Icons from "phosphor-react-native";
import { verticalScale } from "@/utils/styling";

const ChangePasswordModal = () => {
  const { updatePassword } = useAuth();
  const router = useRouter();
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const { oldPassword, newPassword, confirmPassword } = passwords;

    if (!oldPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      Alert.alert("Warning", "Please fill all the fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Warning", "New password does not match");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Warning", "New password must be at least 6 characters");
      return;
    }

    setLoading(true);
    const res = await updatePassword(oldPassword, newPassword);
    setLoading(false);

    if (res.success) {
      Alert.alert("Success", "Password updated successfully", [
        {
          text: "OK",
          onPress: () => {
            router.back();
          },
        },
      ]);
    } else {
      Alert.alert("Error", res.msg || "Failed to update password");
    }
  };

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title="Change password"
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />
        <ScrollView contentContainerStyle={styles.form}>
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Old password</Typo>
            <Input
              placeholder="Enter old password"
              value={passwords.oldPassword}
              onChangeText={(value) =>
                setPasswords({ ...passwords, oldPassword: value })
              }
              type="password"
              icon={
                <Icons.Lock
                  size={verticalScale(26)}
                  color={colors.neutral350}
                  weight="fill"
                />
              }
            />
          </View>
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>New password</Typo>
            <Input
              placeholder="Enter new password"
              value={passwords.newPassword}
              type="password"
              onChangeText={(value) =>
                setPasswords({ ...passwords, newPassword: value })
              }
              icon={
                <Icons.Lock
                  size={verticalScale(26)}
                  color={colors.neutral350}
                  weight="fill"
                />
              }
            />
          </View>
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Confirm new password</Typo>
            <Input
              placeholder="Enter new password again"
              value={passwords.confirmPassword}
              type="password"
              onChangeText={(value) =>
                setPasswords({ ...passwords, confirmPassword: value })
              }
              icon={
                <Icons.Lock
                  size={verticalScale(26)}
                  color={colors.neutral350}
                  weight="fill"
                />
              }
            />
          </View>
        </ScrollView>
      </View>
      <View style={styles.footer}>
        <Button onPress={handleSubmit} loading={loading} style={{ flex: 1 }}>
          <Typo color={colors.black} fontWeight={"700"}>
            Update
          </Typo>
        </Button>
      </View>
    </ModalWrapper>
  );
};

export default ChangePasswordModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacingY._20,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: spacingX._20,
    gap: scale(12),
    paddingTop: spacingY._15,
    borderTopColor: colors.neutral700,
    marginBottom: spacingY._5,
    borderTopWidth: 1,
  },
  form: {
    gap: spacingY._30,
    marginTop: spacingY._15,
  },
  inputContainer: {
    gap: spacingY._10,
  },
});
