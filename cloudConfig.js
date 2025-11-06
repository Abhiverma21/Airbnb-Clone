const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Validate environment variables for cloudinary
if (!process.env.CLOUD_NAME || !process.env.API_KEY || !process.env.API_SECRET) {
  console.warn('[cloudConfig] CLOUD_NAME, API_KEY or API_SECRET not set. Cloudinary uploads will fail without these.');
}

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'HotelVault_development',
      allowed_formats: ["png", "jpeg", "jpg"],
      transformation: [{ width: 1000, height: 1000, crop: "limit" }]
    },
  });

  module.exports = {
    storage,
    cloudinary  
  }