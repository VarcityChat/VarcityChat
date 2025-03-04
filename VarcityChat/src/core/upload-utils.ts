import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { Image as ImageCompressor } from "react-native-compressor";

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
  try {
    const compressedImageUri = await ImageCompressor.compress(image.uri, {
      maxWidth: 1000,
    });

    const formData = new FormData();
    const ext = compressedImageUri.split(".").pop();
    const fileName = `${Date.now()}.${ext}`;

    formData.append("file", {
      uri: compressedImageUri,
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
  } catch (error) {
    console.log("Image compression failed:", error);
    throw error;
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

// Audio Upload
export const uploadAudioToCloudinary = async (
  audioFile: {
    uri: string;
    abortController: AbortController;
    fileName?: string;
  },
  retryCount = 0
): Promise<string | null> => {
  try {
    const fileExtension = audioFile.uri.split(".").pop() || "mp3";
    const fileName =
      audioFile.fileName || `audio_${Date.now()}.${fileExtension}`;

    const formData = new FormData();

    // Append the audio file to the form data
    formData.append("file", {
      uri: audioFile.uri,
      type: `audio/${fileExtension}`,
      name: fileName,
    } as any);

    // Use the appropriate preset for audio files
    formData.append("upload_preset", "user_profiles");
    formData.append("cloud_name", "dvjr6r50f");
    formData.append("api_key", "159348833879711");

    // Use the auto endpoint to let Cloudinary detect the resource type
    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dvjr6r50f/auto/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const responseJson = await response.json();
    if (responseJson?.secure_url) return responseJson.secure_url;
    return null;
  } catch (error) {
    console.error(`Audio upload failed for ${audioFile.uri}`, error);

    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying upload (${retryCount + 1}/${MAX_RETRIES})...`);
      return uploadAudioToCloudinary(audioFile, retryCount + 1);
    } else {
      console.warn(
        `Upload failed after ${MAX_RETRIES} attempts`,
        audioFile.uri
      );
      return null;
    }
  }
};
