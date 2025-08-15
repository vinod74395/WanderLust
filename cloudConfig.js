const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
cloudinary.config({
  cloud_name:process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY ,
  api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_DEV', // Change this to your target folder in Cloudinary
    allowedFormats: ['jpg', 'png', 'jpeg'], // Choose allowed formats as needed
// This lets Cloudinary decide the type based on the file
  },
});
module.exports={
    cloudinary,
    storage,
}