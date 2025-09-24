// const cloudinary = require('cloudinary').v2;

// // Ensure you configure cloudinary somewhere in your main app (e.g., server.js)
// // cloudinary.config({ cloud_name, api_key, api_secret });

// const imageUploader = async (file, folder, height, quality) => {
//   const options = { folder };
//   if (height) {
//     options.height = height;
//   }
//   if (quality) {
//     options.quality = quality;
//   }
//   options.resource_type = 'auto';
//   // console.log("request come to the uploaded section");
//   console.log(file.tempFilePath, "file path");
//   return await cloudinary.uploader.upload(file.tempFilePath, options);
// };

// module.exports = imageUploader ;




// const cloudinary = require('cloudinary').v2;

// // ✅ Configure Cloudinary with your credentials
// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.API_KEY,  // Changed from CLOUD_API_KEY
//   api_secret: process.env.API_SECRET,  // Changed from CLOUD_API_SECRET
// });

// const imageUploader = async (file, folder, resourceType = "auto", height = null, quality = null) => {
//   try {
//     // ✅ Verify Cloudinary config
//     console.log("Cloudinary config:", {
//       cloud_name: process.env.CLOUD_NAME,
//       api_key: process.env.API_KEY ? "***" + process.env.API_KEY.slice(-4) : "MISSING",
//       api_secret: process.env.API_SECRET ? "***" + process.env.API_SECRET.slice(-4) : "MISSING"
//     });

//     const options = {
//       folder,
//       resource_type: resourceType, // "image" | "video" | "auto"
//     };

//     // Only add image-specific options for images
//     if (resourceType === "image") {
//       if (height) options.height = height;
//       if (quality) options.quality = quality;
//     }

//     // ✅ Video-specific options
//     if (resourceType === "video") {
//       options.format = "mp4"; // Ensure consistent video format
//     }

//     // Convert Windows backslashes to forward slashes
//     const filePath = file.tempFilePath.replace(/\\/g, "/");

//     console.log("Uploading to Cloudinary:", filePath);
//     console.log("Upload options:", options);

//     const result = await cloudinary.uploader.upload(filePath, options);

//     console.log("✅ Cloudinary Upload Success:", result.secure_url);
//     return result;
//   } catch (err) {
//     console.error("❌ Cloudinary Upload Failed:", err);
//     throw new Error(`Cloudinary upload failed: ${err.message}`);
//   }
// };

// module.exports = imageUploader;




// In your uploader utility file (e.g., utils/uploader.js)

const cloudinary = require('cloudinary').v2;

const imageUploader = async (file, folder) => {
  // Determine resource_type based on mimetype
  const resourceType = file.mimetype.startsWith('video') ? 'video' : 'image';

  const options = {
    folder,
    resource_type: resourceType,
  };

  // For videos, specify chunk size for large files
  if (resourceType === 'video') {
    options.chunk_size = 6000000; // 6 MB chunks
  }

  try {
    // Fix Windows backslashes
    const filePath = file.tempFilePath.replace(/\\/g, "/");

    console.log("⬆️ Uploading to Cloudinary:", filePath, "as", resourceType);
    
    const result = await cloudinary.uploader.upload(filePath, options);
    
    console.log("✅ Upload success:", result.secure_url);
    return result;

  } catch (err) {
    console.error("❌ Cloudinary upload failed:", err);
    // It's good to log the whole error for more details
    console.error(JSON.stringify(err, null, 2)); 
    throw err;
  }
};

module.exports = imageUploader;