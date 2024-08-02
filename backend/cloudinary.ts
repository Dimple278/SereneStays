// // src/config/cloudinary.ts
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { Options } from "multer-storage-cloudinary";

cloudinary.config({
  // cloud_name: "process.env.CLOUD_NAME",
  // api_key: "process.env.CLOUD_API_KEY",
  // api_secret: "process.env.CLOUD_API_SECRET",
  cloud_name: "dsmeertbs",
  api_key: "221857357232799",
  api_secret: "w5wQ4YxPjsdPsXVZy7lfd-4N-lE",
  transformation: [{ width: 200, height: 200, crop: "fill" }], // resize the
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "airbnb",
    allowedFormats: ["png", "jpg", "jpeg"],
  } as any,
});

const upload = multer({ storage });

const uploads = (file, folder) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(file, (result) => {
      resolve({
        url: result.url,
        id: result.public_id,
      });
    });
  });
};

export { cloudinary, storage, upload, uploads };
