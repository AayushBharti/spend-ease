import { Alert, Image, Pressable, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import ScreenWrapper from "@/components/screen-wrapper";
import Typo from "@/components/typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import Input from "@/components/input";
import * as Icons from "phosphor-react-native";
import Button from "@/components/button";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/auth-context";

const Login = () => {
  const router = useRouter();
  const { login: loginUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert("Warning", "Please fill all the fields");
      return;
    }
    setLoading(true);
    const res = await loginUser(email, password);
    setLoading(false);
    if (!res.success) {
      Alert.alert("Error", res.msg);
    }
    router.replace("/(tabs)");
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require("@/public/images/splash-icon.png")}
            style={styles.logo}
          />
          <Typo size={42} fontWeight={"800"}>
            Spend Ease
          </Typo>
          <Typo size={18} color={colors.neutral400}>
            Spend smarter, Live easy
          </Typo>
        </View>

        <View style={styles.form}>
          <Input
            placeholder="Enter your email"
            onChangeText={(value) => {
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
          <Input
            placeholder="Enter your password"
            type="password"
            onChangeText={(value) => {
              setPassword(value);
            }}
            icon={
              <Icons.Lock
                size={verticalScale(26)}
                color={colors.neutral350}
                weight="fill"
              />
            }
          />
          <Button onPress={handleSubmit} loading={loading}>
            <Typo fontWeight={"700"} color={colors.black} size={21}>
              Login
            </Typo>
          </Button>
          <View style={styles.authOptions}>
            <Pressable onPress={() => router.navigate("/(auth)/sign-up")}>
              <Typo size={15} color={colors.primary} fontWeight={"700"}>
                Create an account
              </Typo>
            </Pressable>
            <Pressable
              onPress={() => router.navigate("/(auth)/forgot-password")}
            >
              <Typo size={15} color={colors.primary} fontWeight={"700"}>
                Forgot password
              </Typo>
            </Pressable>
          </View>
        </View>

        {/* <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Typo size={15}>Or login with</Typo>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.socialButtonContainer}>
          <Pressable>
            <Image
              source={require("@/public/images/google.png")}
              style={styles.socialButton}
            />
          </Pressable>
        </View> */}
      </View>
    </ScreenWrapper>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacingY._30,
    paddingHorizontal: spacingX._20,
  },
  logoContainer: {
    gap: 5,
    marginTop: spacingY._30,
    marginBottom: spacingY._10,
    alignItems: "center",
  },
  logo: {
    width: verticalScale(100),
    height: verticalScale(100),
  },
  form: {
    gap: spacingY._20,
  },
  authOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  divider: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dividerLine: {
    height: 1,
    flex: 1,
    backgroundColor: colors.neutral700,
    marginHorizontal: spacingX._10,
  },
  socialButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 32,
  },
  socialButton: {
    width: verticalScale(40),
    height: verticalScale(40),
  },
});
