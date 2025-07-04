import { firestore } from "@/config/firebase";
import { TransactionType, ResponseType, WalletType } from "@/types";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { uploadFileToCloudinary } from "./images-service";
import { createOrUpdateWallet } from "./wallet-service";
import { getLast12Months, getLast7Days, getYearsRange } from "@/utils/common";
import { scale } from "@/utils/styling";
import { colors } from "@/constants/theme";

export const createOrUpdateTransaction = async (
  transactionData: Partial<TransactionType>
): Promise<ResponseType> => {
  try {
    // Check if transaction exists
    const { id, type, walletId, amount, image } = transactionData;
    if (!amount || amount <= 0 || !walletId || !type) {
      return { success: false, msg: "Invalid transaction data!" };
    }

    // Check if transaction id existe
    if (id) {
      // Update transaction
      const oldTransactionSnapshot = await getDoc(
        doc(firestore, "transactions", id)
      );
      const oldTransaction = oldTransactionSnapshot.data() as TransactionType;

      const shouldRevertOriginal =
        oldTransaction.type != type ||
        oldTransaction.amount != amount ||
        oldTransaction.walletId != walletId;

      if (shouldRevertOriginal) {
        let result = await revertAndUpdateWallets(
          oldTransaction,
          Number(amount),
          type,
          walletId
        );
        if (!result.success) return result;
      }

      // return { success: true, msg: "Transaction updated successfully" };
    } else {
      // update wallet for new transaction
      let result = await updateWalletforNewTransaction(
        walletId!,
        Number(amount!),
        type
      );
      if (!result.success) return result;
    }

    //update transaction image
    if (image) {
      const imageUploadResultat = await uploadFileToCloudinary(
        image,
        "transactions"
      );
      if (!imageUploadResultat.success) {
        return {
          success: false,
          msg: imageUploadResultat.msg || "Failed to upload transaction image",
        };
      }
      transactionData.image = imageUploadResultat.data;
    }

    // Create transaction in Firestore
    const transactionRef = id
      ? doc(firestore, "transactions", id)
      : doc(collection(firestore, "transactions"));

    await setDoc(transactionRef, transactionData, { merge: true });

    return {
      success: true,
      data: { ...transactionData, id: transactionRef.id },
    };
  } catch (error: any) {
    return { success: false, msg: error.message };
  }
};

//function to update wallet for nezw transation
const updateWalletforNewTransaction = async (
  walletId: string,
  amount: number,
  type: string
) => {
  try {
    const walletRef = doc(firestore, "wallets", walletId);
    const walletSnapshot = await getDoc(walletRef);

    if (!walletSnapshot.exists()) {
      console.log("Wallet not found esrror");
      return { success: false, msg: "Wallet not found" };
    }

    const walletData = walletSnapshot.data() as WalletType;

    if (type == "expense" && walletData.amount! - amount < 0) {
      return { success: false, msg: "Insufficient balance for your wallet" };
    }

    const updatedType = type == "income" ? "totalIncome" : "totalExpenses";
    const updatedWalletAmount =
      type == "income"
        ? Number(walletData.amount) + amount
        : Number(walletData.amount) - amount;

    const updatedTotals =
      type == "income"
        ? Number(walletData.totalIncome) + amount
        : Number(walletData.totalExpenses) + amount;

    //update wallet in firestore
    await updateDoc(walletRef, {
      amount: updatedWalletAmount,
      [updatedType]: updatedTotals,
    });

    return { success: true, msg: "Wallet updated successfully" };
  } catch (error: any) {
    console.log("Error in  uppdating wallet for new transaction", error);
    return { success: false, msg: error.message };
  }
};

//function to update old transaction
const revertAndUpdateWallets = async (
  oldTransaction: TransactionType,
  newTransactionAmount: number,
  newTransactionType: string,
  newWalletId: string
) => {
  try {
    const originalWalletSnapshop = await getDoc(
      doc(firestore, "wallets", oldTransaction.walletId)
    );

    const originalWallet = originalWalletSnapshop.data() as WalletType;
    let newWalletSnapshot = await getDoc(
      doc(firestore, "wallets", newWalletId)
    );

    let newWallet = newWalletSnapshot.data() as WalletType;

    const revertType =
      oldTransaction.type == "income" ? "totalIncome" : "totalExpenses";

    const revertIncomeExpense: number =
      oldTransaction.type == "income"
        ? -Number(oldTransaction.amount)
        : Number(oldTransaction.amount);

    const revertedWalletAmount =
      Number(originalWallet.amount) + revertIncomeExpense;
    //wallet amount after the transaction is removed
    const revertedIncomeExpenseAmount =
      Number(originalWallet[revertType]) - Number(oldTransaction.amount);

    if (newTransactionType == "expense") {
      //if user tries to convert income to expense on the same wallet
      //or if the user tries to increase the expense amount and dont have enough balance
      if (
        oldTransaction.walletId == newWalletId &&
        revertedWalletAmount < newTransactionAmount
      ) {
        return {
          success: false,
          msg: "The selected wallet don't have enough balance",
        };
      }

      //if user tries to add expense from a new wallet but the wallet don't have enouhg balance
      if (newWallet.amount! < newTransactionAmount) {
        return {
          success: false,
          msg: "The selected wallet don't have enough balance",
        };
      }
    }

    await createOrUpdateWallet({
      id: oldTransaction.walletId,
      amount: revertedWalletAmount,
      [revertType]: revertedIncomeExpenseAmount,
    });

    ////////////////////////////////////////////////////////////////////////////////////

    //refecth the newWallet because we may have just updated it
    newWalletSnapshot = await getDoc(doc(firestore, "wallets", newWalletId));

    newWallet = newWalletSnapshot.data() as WalletType;

    //update the wallet
    const updatetype =
      newTransactionType == "income" ? "totalIncome" : "totalExpenses";

    const updatedTransactionAmount: number =
      newTransactionType == "income"
        ? Number(newTransactionAmount)
        : -Number(newTransactionAmount);

    ///Create new wallet amount
    const newWalletAmount = Number(newWallet.amount) + updatedTransactionAmount;

    const newIncomeExpenseAmount = Number(
      newWallet[updatetype]! + Number(newTransactionAmount)
    );

    await createOrUpdateWallet({
      id: newWalletId,
      amount: newWalletAmount,
      [updatetype]: newIncomeExpenseAmount,
    });

    return { success: true, msg: "Wallet updated successfully" };
  } catch (error: any) {
    console.log("Error in  uppdating wallet for new transaction", error);
    return { success: false, msg: error.message };
  }
};

//deleteTransaction
export const deleteTransaction = async (
  transactionId: string,
  walletId: string
) => {
  try {
    const transactionRef = doc(firestore, "transactions", transactionId);
    const transactionSnapshot = await getDoc(transactionRef);

    if (!transactionSnapshot.exists()) {
      return { success: false, msg: "Transaction not found" };
    }

    const transactionData = transactionSnapshot.data() as TransactionType;

    const transactionType = transactionData?.type;
    const transactionAmount = transactionData?.amount;

    //fetch wallet to update amount, totalIncome, totalExpenses
    const walletSnapshot = await getDoc(doc(firestore, "wallets", walletId));
    const walletData = walletSnapshot.data() as WalletType;

    //check fields to be update based on transaction type
    const updatedType =
      transactionType == "income" ? "totalIncome" : "totalExpenses";
    const newWalletAmount =
      walletData?.amount! -
      (transactionType == "income" ? transactionAmount : -transactionAmount);

    const newIncomeExpenseAmount = walletData[updatedType]! - transactionAmount;

    //if its expense and the wallet amount can go below zero
    if (transactionType == "income" && newWalletAmount < 0) {
      return {
        success: false,
        msg: "The selected wallet don't have enough balance",
      };
    }

    await createOrUpdateWallet({
      id: walletId,
      amount: newWalletAmount,
      [updatedType]: newIncomeExpenseAmount,
    });

    await deleteDoc(transactionRef);

    return { success: true };
  } catch (error: any) {
    return { success: false, msg: error.message };
  }
};

///////////////////////////////
// 📊 Fetch Stats Utilities
///////////////////////////////

const formatStats = (data: any[], labelKey: string) =>
  data.flatMap((item) => [
    {
      value: item.income,
      label: item[labelKey],
      spacing: scale(4),
      labelWidth: scale(30),
      frontColor: colors.primary,
    },
    {
      value: item.expense,
      frontColor: colors.rose,
    },
  ]);

//fecth weekly stats
export const fetchWeeklyStats = async (uid: string): Promise<ResponseType> => {
  try {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    const transactionQuery = query(
      collection(firestore, "transactions"),
      where("date", ">=", Timestamp.fromDate(sevenDaysAgo)),
      where("date", "<=", Timestamp.fromDate(today)),
      where("uid", "==", uid),
      orderBy("date", "asc")
    );

    const snapshot = await getDocs(transactionQuery);
    const weeklyData = getLast7Days();

    const transactions = snapshot.docs.map((doc) => {
      const data = doc.data() as TransactionType;
      data.id = doc.id;

      const date = (data.date as Timestamp)
        .toDate()
        .toISOString()
        .split("T")[0];
      const day = weeklyData.find((d) => d.date === date);

      if (day) {
        if (data.type === "income") day.income! += data.amount!;
        if (data.type === "expense") day.expense! += data.amount!;
      }

      return data;
    });

    return {
      success: true,
      data: { stats: formatStats(weeklyData, "day"), transactions },
    };
  } catch (error: any) {
    console.error("Error in fetchWeeklyStats:", error);
    return { success: false, msg: error.message };
  }
};

//fecth weekly stats
export const fetchMonthlyStats = async (uid: string): Promise<ResponseType> => {
  try {
    const db = firestore;

    const today = new Date();
    const twelveMonthAgo = new Date(today);
    twelveMonthAgo.setMonth(today.getMonth() - 12);

    //fetch all transactions in the last 12 months
    const transactionQuery = query(
      collection(db, "transactions"),
      where("date", ">=", Timestamp.fromDate(twelveMonthAgo)),
      where("date", "<=", Timestamp.fromDate(today)),
      orderBy("date", "asc"),
      where("uid", "==", uid)
    );

    const querySnapshot = await getDocs(transactionQuery);
    const monthlyData = getLast12Months();
    const transactions: TransactionType[] = [];

    //mapping each transaction in day
    querySnapshot.forEach((doc) => {
      const transaction = doc.data() as TransactionType;
      transaction.id = doc.id;
      transactions.push(transaction);

      const transactionDate = (transaction.date as Timestamp).toDate();
      const monthName = transactionDate.toLocaleDateString("default", {
        month: "short",
      });
      const shortYear = transactionDate.getFullYear().toString().slice(-2);

      const monthData = monthlyData.find(
        (month) => month.month === `${monthName} ${shortYear}`
      );

      if (monthData) {
        if (transaction.type == "income") {
          monthData.income! += transaction.amount!;
        } else if (transaction.type == "expense") {
          monthData.expense! += transaction.amount!;
        }
      }
    });

    //stats for weekly Data
    const stats = monthlyData.flatMap((month) => [
      {
        value: month.income,
        label: month.month,
        spacing: scale(4),
        labelWidth: scale(30),
        frontColor: colors.primary,
      },
      {
        value: month.expense,
        frontColor: colors.rose,
      },
    ]);

    return {
      success: true,
      data: {
        stats,
        transactions,
      },
    };
  } catch (error: any) {
    return { success: false, msg: error.message };
  }
};

//fecth weekly stats
export const fetchYearlyStats = async (uid: string): Promise<ResponseType> => {
  try {
    const db = firestore;

    //fetch all transactions in the last 12 months
    const transactionQuery = query(
      collection(db, "transactions"),
      orderBy("date", "asc"),
      where("uid", "==", uid)
    );

    const querySnapshot = await getDocs(transactionQuery);
    const transactions: TransactionType[] = [];

    //find the first transaction
    const firstTransaction = querySnapshot.docs.reduce((earliest, doc) => {
      const transactionDate = doc.data().date.toDate();
      return transactionDate < earliest ? transactionDate : earliest;
    }, new Date());

    const firstYear = firstTransaction.getFullYear();
    const currentYear = new Date().getFullYear();

    const yearlyData = getYearsRange(firstYear, currentYear);

    //mapping each transaction in day
    querySnapshot.forEach((doc) => {
      const transaction = doc.data() as TransactionType;
      transaction.id = doc.id;
      transactions.push(transaction);

      const transactionYear = (transaction.date as Timestamp)
        .toDate()
        .getFullYear();

      const yearData = yearlyData.find(
        (item: any) => item.year === transactionYear.toString()
      );

      if (yearData) {
        if (transaction.type == "income") {
          yearData.income! += transaction.amount!;
        } else if (transaction.type == "expense") {
          yearData.expense! += transaction.amount!;
        }
      }
    });

    //stats for weekly Data
    const stats = yearlyData.flatMap((year: any) => [
      {
        value: year.income,
        label: year.year,
        spacing: scale(4),
        labelWidth: scale(35),
        frontColor: colors.primary,
      },
      {
        value: year.expense,
        frontColor: colors.rose,
      },
    ]);

    return {
      success: true,
      data: {
        stats,
        transactions,
      },
    };
  } catch (error: any) {
    return { success: false, msg: error.message };
  }
};
