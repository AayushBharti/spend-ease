import axios from "axios";

const CLOUDINARY_API_URL = `https://api.cloudinary.com/v1_1/${process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;

export const uploadFileToCloudinary = async (
  file: { uri?: string } | string,
  folderName: string
): Promise<any> => {
  try {
    if (!file) return { success: true, data: null };
    if (typeof file === "string") {
      return { success: true, data: file };
    }
    if (typeof file != "string" && file.uri) {
      const formData = new FormData();
      formData.append("file", {
        uri: file?.uri,
        type: "image/jpeg",
        name: file?.uri?.split("/").pop() || "file.jpg",
      } as any);

      formData.append("upload_preset", "expense-tracker-image");
      formData.append("folder", folderName);
      console.log("first", formData);
      const response = await axios.post(CLOUDINARY_API_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("uploadresponse", response.data);
      return { success: true, data: response?.data?.secure_url };
    }
  } catch (error: any) {
    console.log("got error uploading file : ", error);
    return { success: false, msg: error.message || "Could not upload file." };
  }
};

export const getProfileImage = (file: any) => {
  if (file && typeof file == "string") return file;
  if (file && typeof file == "object") return file.uri;

  return require("../public/images/defaultAvatar.png");
};

export const getFilePath = (file: any) => {
  if (file && typeof file == "string") return file;
  if (file && typeof file == "object") return file.uri;

  return null;
};
