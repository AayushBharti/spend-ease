import { Alert, ScrollView, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import Typo from "@/components/typo";
import ModalWrapper from "@/components/modal-wrapper";
import HeaderComponent from "@/components/header";
import BackButton from "@/components/back-button";
import * as Icons from "phosphor-react-native";
import TextInputComponent from "@/components/text-input";
import { WalletType } from "@/types";
import ButtonComponent from "@/components/button";
import { useAuth } from "@/context/auth-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { createOrUpdateWallet, deleteWallet } from "@/services/wallet-service";
import ImageUpload from "@/components/image-upload";

const WalletModal = () => {
  const { user, updateUserData } = useAuth();
  const [wallet, setWalletData] = useState<WalletType>({
    name: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  //retrieve data from wallte to update
  const oldWallet: { name: string; image: string; id: string } =
    useLocalSearchParams();

  useEffect(() => {
    if (oldWallet?.id) {
      setWalletData({
        name: oldWallet?.name || "",
        image: oldWallet?.image || null,
      });
    }
  }, []);

  //onsublmit function
  const onSubmit = async () => {
    let { name, image } = wallet;
    if (!name.trim() || !image) {
      Alert.alert("Wallet", "Please enter wallet name");
      return;
    }

    const data: WalletType = {
      name,
      image,
      uid: user?.uid,
    };

    if (oldWallet?.id) data.id = oldWallet?.id;

    setLoading(true);
    const result = await createOrUpdateWallet(data);
    setLoading(false);
    if (result.success) {
      //update user
      router.back();
    } else {
      Alert.alert("Wallet", result.msg);
    }
  };

  const OnDelete = async () => {
    if (!oldWallet?.id) return;
    setLoading(true);
    const result = await deleteWallet(oldWallet?.id);
    setLoading(false);
    if (result.success) {
      //update user
      router.back();
      Alert.alert("Wallet", "Wallet deleted successfully");
    } else {
      Alert.alert("Wallet", result.msg);
    }
  };

  //Function show delete alert for deleting wallet
  const showDeleteAlert = () => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to delete this wallet?  \nThis action will delete all data related to this wallet.",
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

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <HeaderComponent
          title={oldWallet?.id ? "Edit Wallet" : "New Wallet"}
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />

        {/* //Form */}
        <ScrollView contentContainerStyle={styles.form}>
          {/* //inputContainer */}
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Wallet Name</Typo>
            <TextInputComponent
              placeholder="Enter wallet name"
              value={wallet.name}
              onChangeText={(value: any) =>
                setWalletData({ ...wallet, name: value })
              }
            />
          </View>
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Choose an icon</Typo>
            {/* Image input */}
            <ImageUpload
              file={wallet.image}
              onSelect={(file: any) =>
                setWalletData({ ...wallet, image: file })
              }
              onClear={() => setWalletData({ ...wallet, image: null })}
              placeholder="Add an image"
            />
          </View>
        </ScrollView>
      </View>
      {/* //footer area*/}
      <View style={styles.footer}>
        {oldWallet?.id && !loading && (
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
          <Typo color={colors.black} fontWeight="800">
            {oldWallet?.id ? "Update Wallet" : "Add Wallet"}
          </Typo>
        </ButtonComponent>
      </View>
    </ModalWrapper>
  );
};

export default WalletModal;

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
  avatarContainer: {
    position: "relative",
    alignSelf: "center",
  },
  avatar: {
    alignSelf: "center",
    backgroundColor: colors.neutral350,
    height: verticalScale(135),
    width: verticalScale(135),
    borderRadius: 200,
    borderWidth: 1,
    borderColor: colors.neutral500,
  },
  editIcon: {
    position: "absolute",
    bottom: spacingY._5,
    right: spacingY._7,
    backgroundColor: colors.neutral100,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    padding: spacingY._7,
    borderRadius: 50,
    elevation: 4,
  },
  inputContainer: {
    gap: spacingY._10,
  },
});
