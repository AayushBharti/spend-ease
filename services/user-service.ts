import { firestore } from "@/config/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { UserDataType } from "../types";
import { ResponseType } from "../types";
import { uploadFileToCloudinary } from "./images-service";

export const updateUser = async (
  uid: string,
  updatedData: UserDataType
): Promise<ResponseType> => {
  try {
    if (updatedData.image && updatedData?.image?.uri) {
      const imageUploadRes = await uploadFileToCloudinary(
        updatedData.image,
        "expense-tracker-users"
      );
      if (!imageUploadRes.success) {
        return {
          success: false,
          msg: imageUploadRes.msg || "Failed to upload image.",
        };
      }
      updatedData.image = imageUploadRes.data;
    }
    const docRef = doc(firestore, "users", uid);
    await updateDoc(docRef, updatedData);
    return { success: true, msg: "Updated Successfully" };
  } catch (error: any) {
    console.log("error updating user !", error);
    return { success: false, msg: error.message };
  }
};
