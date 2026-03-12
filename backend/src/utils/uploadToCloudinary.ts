import cloudinary from '../config/cloudinary.ts';

export const uploadToCloudinary = (buffer: Buffer, filename: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: 'video', // Cloudinary uses 'video' for audio files too
        folder: '/voice-memo',
        public_id: filename,
        format: 'mp3',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result!.secure_url); // returns the URL of uploaded file
      }
    ).end(buffer); // feed the compressed buffer in
  });
};