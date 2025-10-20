"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToCloudinary = uploadToCloudinary;
exports.deleteFromCloudinary = deleteFromCloudinary;
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
function uploadToCloudinary(buffer, options = {}) {
    const { folder = 'reservations/proofs', overwrite = true } = options;
    return new Promise((resolve, reject) => {
        const upload = cloudinary_1.default.uploader.upload_stream({ folder, overwrite, resource_type: 'image' }, (error, result) => {
            if (error || !result)
                return reject(error);
            resolve({ secure_url: result.secure_url, public_id: result.public_id });
        });
        upload.end(buffer);
    });
}
async function deleteFromCloudinary(publicId) {
    if (!publicId)
        return;
    try {
        await cloudinary_1.default.uploader.destroy(publicId, { resource_type: 'image' });
    }
    catch (err) {
        // Log and continue; not fatal
        console.warn('Cloudinary delete warning:', err);
    }
}
//# sourceMappingURL=cloudinaryUpload.js.map