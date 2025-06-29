import { createContext, useContext, useEffect, useState } from "react";
import { AuthContextType, UserType } from "@/types";
import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updatePassword as firebaseUpdatePassword,
} from "firebase/auth";
import { auth, firestore } from "@/config/firebase";
import { doc, getDoc, setDoc } from "@firebase/firestore";
import { useRouter } from "expo-router";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserType>(null);
  const [initializing, setInitializing] = useState(true);
  const router = useRouter();

  // Handle navigation based on authentication state
  useEffect(() => {
    if (initializing) return;

    const navigateBasedOnAuth = async () => {
      if (user) {
        router.replace("/(tabs)");
      } else {
        router.replace("/(auth)/welcome");
      }
    };

    navigateBasedOnAuth();
  }, [initializing, user]);

  // Handle normal sign in status change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName,
        });
        updateUserData(firebaseUser.uid);
      } else {
        // user is signed out
        setUser(null);
      }
      if (initializing) {
        setInitializing(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // login function
  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error: any) {
      let msg = error.message;
      console.log(msg);
      if (msg === "Firebase: Error (auth/invalid-credential).") {
        msg = "Wrong credentials";
      }
      if (msg === "Firebase: Error (auth/user-not-found).") {
        msg = "User not found";
      }
      if (msg === "Firebase: Error (auth/wrong-password).") {
        msg = "Wrong password";
      }
      if (msg === "Firebase: Error (auth/too-many-requests).") {
        msg = "Too many requests";
      }
      if (msg === "Firebase: Error (auth/invalid-email).") {
        msg = "Invalid email";
      }
      return { success: false, msg };
    }
  };

  //signUp function
  const signUp = async (email: string, password: string, name: string) => {
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await setDoc(doc(firestore, "users", response?.user?.uid), {
        name,
        email,
        uid: response?.user?.uid,
      });
      return { success: true };
    } catch (error: any) {
      let msg = error.message;
      if (msg.includes("(auth/email-already-in-use)")) {
        msg = "Email already in use";
      }
      if (msg.includes("(auth/network-request-failed)")) {
        msg = "Invalid email";
      }
      return { success: false, msg };
    }
  };

  // forgot password function
  const forgotPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error: any) {
      let msg = error.message;
      if (msg.includes("(auth/network-request-failed)")) msg = "Network error";
      if (msg.includes("(auth/invalid-email)")) msg = "Invalid email";
      return { success: false, msg };
    }
  };

  // update user data
  const updateUserData = async (uid: string) => {
    try {
      const docRef = doc(firestore, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const userData: UserType = {
          uid: data?.uid,
          email: data?.email || null,
          name: data?.name || null,
          image: data?.image || null,
        };
        setUser({ ...userData });
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const updatePassword = async (
    oldPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; msg?: string }> => {
    try {
      const user = auth.currentUser;
      if (!user || !user.email) {
        return { success: false, msg: "Không tìm thấy người dùng" };
      }

      const credential = EmailAuthProvider.credential(user.email, oldPassword);
      await reauthenticateWithCredential(user, credential);

      await firebaseUpdatePassword(user, newPassword);

      return { success: true, msg: "Cập nhật mật khẩu thành công" };
    } catch (error: any) {
      console.log("error updating password: ", error);
      let msg = error.message;
      if (msg.includes("(auth/invalid-credential)")) {
        msg = "Mật khẩu cũ không chính xác";
      }
      return { success: false, msg };
    }
  };

  const logout = async () => {
    try {
      setUser(null);

      // if (isGoogleSignIn) {
      //   try {
      //     await GoogleSignin.signOut();
      //   } catch (error) {
      //     console.error("Error signing out from Google:", error);
      //   } finally {
      //     setIsGoogleSignIn(false);
      //   }
      // }

      await auth.signOut();

      return { success: true };
    } catch (error: any) {
      console.error("Logout error:", error);
      return { success: false, msg: error.message };
    }
  };

  const contextValue: AuthContextType = {
    user,
    setUser,
    login,
    signUp,
    updateUserData,
    forgotPassword,
    logout,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};
