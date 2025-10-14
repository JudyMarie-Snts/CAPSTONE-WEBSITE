export declare function uploadToCloudinary(buffer: Buffer, options?: {
    folder?: string;
    overwrite?: boolean;
}): Promise<{
    secure_url: string;
    public_id: string;
}>;
export declare function deleteFromCloudinary(publicId: string): Promise<void>;
//# sourceMappingURL=cloudinaryUpload.d.ts.map