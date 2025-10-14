import cloudinary from '../config/cloudinary';

export function uploadToCloudinary(
  buffer: Buffer,
  options: { folder?: string; overwrite?: boolean } = {}
): Promise<{ secure_url: string; public_id: string }> {
  const { folder = 'reservations/proofs', overwrite = true } = options;

  return new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      { folder, overwrite, resource_type: 'image' },
      (error: any, result: any) => {
        if (error || !result) return reject(error);
        resolve({ secure_url: result.secure_url, public_id: result.public_id });
      }
    );
    upload.end(buffer);
  });
}

export async function deleteFromCloudinary(publicId: string) {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
  } catch (err) {
    // Log and continue; not fatal
    console.warn('Cloudinary delete warning:', err);
  }
}
