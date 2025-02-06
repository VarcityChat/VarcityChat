import cloudinary, { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';

export type UploadReturnType = UploadApiResponse | UploadApiErrorResponse | undefined;

export function uploadFile(
  file: string,
  folder?: string,
  public_id?: string,
  overwrite?: boolean,
  invalidate?: boolean
): Promise<UploadReturnType> {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(
      file,
      {
        folder: folder || '',
        invalidate,
        overwrite,
        public_id,
        use_filename: true,
        resource_type: 'auto'
      },
      (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
  });
}

export const uploadMultiple = async (
  files: string[],
  folder?: string,
  public_id?: string,
  invalidate?: boolean,
  overwrite?: boolean
): Promise<UploadReturnType[]> => {
  const promises = files.map((file) => uploadFile(file, folder, public_id, overwrite, invalidate));
  const results: UploadReturnType[] = await Promise.all(promises);
  return results;
};
