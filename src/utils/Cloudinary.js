import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
    cloud_name: "donys7nlc",
    api_key: "179498624617529",
    api_secret: "A_1OAupKeXwh07YVNwD9m3uLnGY",
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        fs.unlink(localFilePath, (err) => {
            if (err) console.error("Error deleting local file:", err);
        });
        return null;
    }
};

export { uploadOnCloudinary };
