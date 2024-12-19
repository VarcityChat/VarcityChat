import cloudinary, { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';

export type UploadReturnType = UploadApiResponse | UploadApiErrorResponse | undefined;

export function uploadFile(
  file: string,
  public_id?: string,
  overwrite?: boolean,
  invalidate?: boolean
): Promise<UploadReturnType> {
  return new Promise((resolve) => {
    cloudinary.v2.uploader.upload(
      file,
      {
        invalidate,
        overwrite,
        public_id,
        use_filename: true
      },
      (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        if (error) resolve(error);
        resolve(result);
      }
    );
  });
}

export const uploadMultiple = async (
  files: string[],
  public_id?: string,
  invalidate?: boolean,
  overwrite?: boolean
): Promise<UploadReturnType[]> => {
  const promises = files.map((file) => uploadFile(file, public_id, overwrite, invalidate));
  const results: UploadReturnType[] = await Promise.all(promises);
  return results;
};
