export interface ITyping {
  conversationId: string;
  userId: string;
  receiverId: string;
}

export interface UploadingImage {
  uri: string;
  progress: number;
  cloudinaryUrl?: string;
  error?: boolean;
  abortController?: AbortController;
}

export interface ICloudinaryResponse {
  asset_id: string;
  public_id: string;
  version_id: number;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  bytes: number;
  secure_url: string;
  original_filename: string;
}
