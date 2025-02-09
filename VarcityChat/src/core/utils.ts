import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { ExtendedMessage } from "@/api/chats/types";
import { IMessage } from "react-native-gifted-chat";

export const trimText = (text: string, maxLength: number = 20) => {
  return text.length > maxLength
    ? text.slice(0, maxLength - 3) + "..."
    : text.slice(0, maxLength);
};

export const capitalize = (text: string): string => {
  if (!text) return "";
  if (text.length === 0) return "";
  if (text.length === 1) return text[0].toUpperCase();
  return text[0].toUpperCase() + text.substring(1);
};

export const formDataFromImagePicker = (
  assets: ImagePicker.ImagePickerAsset[]
) => {
  const formData = new FormData();
  for (const index in assets) {
    const asset = assets[index];
    if (!asset) continue;
    // @ts-expect-error: special react native format for form data
    formData.append(`images`, {
      uri: asset.uri,
      name: asset.fileName ?? asset.uri.split("/").pop(),
      type: asset.mimeType,
    });
  }
  return formData;
};

const MAX_RETRIES = 2;
export const uploadToCloudinary = async (
  cloudinaryConfig: {
    preset: string;
  },
  asset: ImagePicker.ImagePickerAsset,
  retryCount = 0
): Promise<string | null> => {
  try {
    const base64 = await FileSystem.readAsStringAsync(asset.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const mimeType = asset?.mimeType || "image/jpeg";

    const cloudinaryData = new FormData();
    cloudinaryData.append("file", `data:${mimeType};base64,${base64}`);
    cloudinaryData.append("upload_preset", cloudinaryConfig.preset);
    cloudinaryData.append("cloud_name", "dvjr6r50f");
    cloudinaryData.append("api_key", "159348833879711");

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/dvjr6r50f/image/upload`,
      {
        method: "POST",
        body: cloudinaryData,
      }
    );

    const responseJson = await response.json();
    if (responseJson?.secure_url) return responseJson.secure_url;
    return null;
  } catch (error) {
    console.error(`Cloudinary upload failed for ${asset.uri}`, error);

    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying upload (${retryCount + 1}/${MAX_RETRIES})...`);
      return await uploadToCloudinary(cloudinaryConfig, asset, retryCount + 1);
    } else {
      console.warn(`Upload failed after ${MAX_RETRIES} attempts`, asset.uri);
      return null;
    }
  }
};

export const uploadToCloudinarySigned = async (
  cloudinaryConfig: {
    url: string;
    apiKey: string;
    timestamp: string;
    signature: string;
    folder: string;
  },
  asset: ImagePicker.ImagePickerAsset,
  retryCount = 0
): Promise<string | null> => {
  if (!cloudinaryConfig.url) return null;
  try {
    const base64 = await FileSystem.readAsStringAsync(asset.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const mimeType = asset?.mimeType || "image/jpeg";

    const cloudinaryData = new FormData();
    cloudinaryData.append("file", `data:${mimeType};base64,${base64}`);
    cloudinaryData.append("api_key", cloudinaryConfig.apiKey);
    cloudinaryData.append("timestamp", cloudinaryConfig.timestamp);
    cloudinaryData.append("signature", cloudinaryConfig.signature);

    const response = await fetch(cloudinaryConfig.url, {
      method: "POST",
      body: cloudinaryData,
    });

    const responseJson = await response.json();
    if (responseJson?.secure_url) return responseJson.secure_url;
    return null;
  } catch (error) {
    console.error(`Cloudinary upload failed for ${asset.uri}`, error);

    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying upload (${retryCount + 1}/${MAX_RETRIES})...`);
      return uploadToCloudinarySigned(cloudinaryConfig, asset, retryCount + 1);
    } else {
      console.warn(`Upload failed after ${MAX_RETRIES} attempts`, asset.uri);
      return null;
    }
  }
};

export const convertToGiftedChatMessage = (
  message: ExtendedMessage
): IMessage => {
  return {
    _id: message._id.toString(),
    text: message.content || "",
    createdAt: message.createdAt,
    user: {
      _id: message.sender,
    },
    sent: message.deliveryStatus === "sent",
    received: message.deliveryStatus === "delivered",
    pending: message.deliveryStatus === "pending",
  };
};

export const convertGiftedMessages = (
  messages: ExtendedMessage[]
): IMessage[] => {
  return messages.map(convertToGiftedChatMessage);
};
