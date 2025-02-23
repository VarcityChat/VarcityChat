import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { ExtendedMessage } from "@/api/chats/types";
import { IMessage } from "react-native-gifted-chat";

export const trimText = (text: string, maxLength: number = 20) => {
  if (typeof text !== "string") return;
  return text.length > maxLength
    ? text.slice(0, maxLength - 3) + "..."
    : text.slice(0, maxLength);
};

export const formatChatLastMessage = (text: any) => {
  if (typeof text !== "string") return "Send a message 👋";
  if (text.length === 0) return "Send a message 👋";
  return trimText(text, 70);
};

export const capitalize = (text: string): string => {
  if (!text) return "";
  if (typeof text !== "string") return "";
  if (text.length === 0) return "";
  if (text.length === 1) return text[0].toUpperCase();
  return text[0].toUpperCase() + text.substring(1);
};

export const formatLastMessageTime = (timestamp: Date | string | undefined) => {
  if (!timestamp) return "";

  const messageDate = new Date(timestamp);
  if (isNaN(messageDate.getTime())) return "";

  const now = new Date();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // if Message is from today, return time
  if (messageDate >= today) {
    return messageDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      // hour12: true,
    });
  }

  // if Message is from yesterday
  if (messageDate >= yesterday && messageDate < today) {
    return "Yesterday";
  }

  // if Message is from this week
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  if (messageDate >= weekStart) {
    return messageDate.toLocaleDateString("en-US", { weekday: "long" });
  }

  // If Message is older than a week
  return messageDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
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

export const uploadToCloudinaryWithProgress = async (
  image: { uri: string },
  onProgress: (progress: number) => void,
  abortController: AbortController
): Promise<string | null> => {
  const formData = new FormData();
  const ext = image.uri.split(".").pop();
  const fileName = `${Date.now()}.${ext}`;

  formData.append("file", {
    uri: image.uri,
    type: `image/${ext}`,
    name: fileName,
  } as any);

  // Change preset from "user_profiles" to "chats_media"
  formData.append("upload_preset", "user_profiles");
  formData.append("cloud_name", "dvjr6r50f");
  formData.append("api_key", "159348833879711");

  const xhr = new XMLHttpRequest();

  return new Promise((resolve, reject) => {
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = (event.loaded / event.total) * 100;
        onProgress(progress);
      }
    };

    xhr.open(
      "POST",
      "https://api.cloudinary.com/v1_1/dvjr6r50f/image/upload",
      true
    );

    // Handle abortion
    abortController.signal.addEventListener("abort", () => {
      xhr.abort();
      reject(new Error("Upload cancelled"));
    });

    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        onProgress(100);
        resolve(response.secure_url);
      } else {
        reject(new Error("Upload failed"));
      }
    };

    xhr.onerror = () => {
      reject(new Error("Upload failed"));
    };

    xhr.send(formData);
  });
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
): IMessage & { mediaUrls: string[] } => {
  return {
    _id: message._id.toString(),
    text: message.content || "",
    createdAt: message.createdAt,
    user: {
      _id: message.sender,
    },
    mediaUrls: message.mediaUrls || [],
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
