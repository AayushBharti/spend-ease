import { ResponseType, WalletType } from "@/types";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { firestore } from "@/config/firebase";
import { uploadFileToCloudinary } from "./images-service";

export const createOrUpdateWallet = async (
  walletData: Partial<WalletType>
): Promise<ResponseType> => {
  try {
    let walletToSave = { ...walletData };
    if (walletData.image && walletData?.image?.uri) {
      const imageUploadRes = await uploadFileToCloudinary(
        walletData.image,
        "wallets"
      );
      if (!imageUploadRes.success) {
        return {
          success: false,
          msg: imageUploadRes.msg || "Failed to upload wallets image",
        };
      }

      walletToSave.image = imageUploadRes.data;
    }
    if (!walletToSave?.id) {
      //this means its new wallet
      walletToSave.amount = 0;
      walletToSave.totalIncome = 0;
      walletToSave.totalExpenses = 0;
      walletToSave.created = new Date();
    }

    const walletRef = walletData?.id
      ? doc(firestore, "wallets", walletData?.id)
      : doc(collection(firestore, "wallets"));

    await setDoc(walletRef, walletToSave, { merge: true }); 
    //with merge update only provided wallet data
    return { success: true, data: { ...walletToSave, id: walletRef.id } };
  } catch (error: any) {
    console.log("Error creating or updating wallet", error);
    return {
      success: false,
      msg: error.message || "Could not create or update wallet",
    };
  }
};

//Delete Wallet service
export const deleteWallet = async (walletId: string): Promise<ResponseType> => {
  try {
    const walletRef = doc(firestore, "wallets", walletId);
    await deleteDoc(walletRef);

    // Delete all transaction related to this wallet
    deleteTransactionByWalletId(walletId);
    return { success: true, data: "Wallet deleted successfully" };
  } catch (error: any) {
    console.log("Error Deleting the Wallet", error.message);
    return {
      success: false,
      msg: error.message || "Could not delete the wallet",
    };
  }
};

//Delete Transaction based on wallet Id
export const deleteTransactionByWalletId = async (
  walletId: string
): Promise<ResponseType> => {
  try {
    let hasMoreTransactions = true;

    while (hasMoreTransactions) {
      const transactionQuery = query(
        collection(firestore, "transactions"),
        where("walletId", "==", walletId)
      );
      const transactionSnapShot = await getDocs(transactionQuery);
      if (transactionSnapShot.size == 0) {
        hasMoreTransactions = false;
        break;
      }

      const batch = writeBatch(firestore);
      transactionSnapShot.forEach((transactiondoc) => {
        batch.delete(transactiondoc.ref);
      });
      await batch.commit();
      console.log(
        `${transactionSnapShot.size} transactions deleted in this batch`
      );
    }

    return { success: true, msg: "All transaction deleted" };
  } catch (error: any) {
    console.log("Error Deleting the Transaction", error.message);
    return {
      success: false,
      msg:
        error.message ||
        "Could not delete the Transaction based on this walletId",
    };
  }
};
