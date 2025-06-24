import { Alert, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import ScreenWrapper from "@/components/screen-wrapper";
import Typo from "@/components/typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import BackButton from "@/components/back-button";
import Input from "@/components/input";
import * as Icons from "phosphor-react-native";
import Button from "@/components/button";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "expo-router";

const ForgotPassword = () => {
  const router = useRouter();
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      Alert.alert("Warning", "Please enter your email");
      return;
    }
    setLoading(true);
    const res = await forgotPassword(email);
    setLoading(false);

    if (res.success) {
      Alert.alert(
        "Success",
        "A link to reset your password has been sent to your email"
      );
      router.back();
    }
    if (!res.success) {
      Alert.alert("Error", res.msg);
      setEmail("");
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <BackButton iconSize={28} />

        <View style={styles.headerContainer}>
          <Typo size={24} fontWeight={"800"}>
            Forgot Password
          </Typo>
          <Typo style={{ textAlign: "center" }}>
            Please enter your email address, we will send you a link to reset
            your password.
          </Typo>
        </View>

        <View style={styles.form}>
          <Input
            placeholder="Enter your email"
            value={email}
            onChangeText={(value: string) => {
              setEmail(value);
            }}
            icon={
              <Icons.At
                size={verticalScale(26)}
                color={colors.neutral350}
                weight="fill"
              />
            }
          />
          <Button onPress={handleSubmit} loading={loading}>
            <Typo fontWeight={"700"} color={colors.black} size={21}>
              Reset Password
            </Typo>
          </Button>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacingY._30,
    paddingHorizontal: spacingX._20,
  },
  headerContainer: {
    gap: spacingY._20,
    marginBottom: spacingY._10,
    alignItems: "center",
  },
  form: {
    gap: spacingY._20,
  },
});
