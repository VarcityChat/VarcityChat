import { useState } from "react";
import { useToast } from "../use-toast";
import { uploadAudioToCloudinary } from "@/core/upload-utils";

export const useAudioUpload = () => {
  const { showToast } = useToast();
  const [uploadingAudio, setUploadingAudio] = useState<{
    uri: string;
    progress: number;
    error: boolean;
    url?: string;
    abortController?: AbortController;
  } | null>(null);

  const handleUploadAudio = async (audioUri: string) => {
    const newAudio = {
      uri: audioUri,
      progress: 0,
      error: false,
      abortController: new AbortController(),
    };
    setUploadingAudio(newAudio);

    try {
      const uploadUrl = await uploadAudioToCloudinary({
        uri: audioUri,
      });

      if (uploadUrl) {
        setUploadingAudio((prev) => ({
          ...prev!,
          url: uploadUrl,
          progress: 100,
          error: false,
        }));
        return { success: true, url: uploadUrl };
      }
      return { success: false };
    } catch (error: any) {
      if (error.message === "Upload cancelled") {
        setUploadingAudio(null);
        return { success: false, cancelled: true };
      } else {
        setUploadingAudio((prev) => ({
          ...prev!,
          error: true,
        }));

        showToast({
          type: "error",
          text1: "Error",
          text2: "Error uploading audio message",
        });

        return {
          success: false,
          error: true,
          message: error?.message || "Failed to upload audio",
        };
      }
    }
  };

  const handleCancelAudioUpload = () => {
    if (uploadingAudio?.abortController) {
      uploadingAudio.abortController.abort();
    }
    setUploadingAudio(null);
  };

  return { uploadingAudio, handleUploadAudio, handleCancelAudioUpload };
};
