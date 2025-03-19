const { S3Client, GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const multer = require("multer");
const multerS3 = require("multer-s3");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

// Initialize AWS S3 Client (AWS SDK v3)
const s3 = new S3Client({
    region: process.env.REGION,
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_KEY,
    },
});

// Allowed image types
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp"];

// Multer S3 storage for direct file upload
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.BUCKET,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.originalname });
        },
        key: function (req, file, cb) {
            const timestamp = Date.now(); // Get current timestamp
            const fileExt = file.mimetype.split("/")[1]; // Extract file extension
            const fileName = file.originalname.replace(/\s+/g, "-").split(".")[0]; // Remove spaces from original filename
            
            // Final stored filename: "uploads/originalname-1710776258000.jpg"
            const finalFileName = `uploads/${fileName}-${timestamp}.${fileExt}`;
            cb(null, finalFileName);
        },
    }),
    fileFilter: function (req, file, cb) {
        if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
            return cb(new Error("Only image files are allowed!"), false);
        }
        cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Generate a pre-signed URL for frontend direct upload
const getSignedUrlHandler = async (req, res) => {
    try {
        const { fileType } = req.query;
        if (!ALLOWED_IMAGE_TYPES.includes(fileType)) {
            return res.status(400).json({ error: "Invalid file type. Only images are allowed!" });
        }

        const fileExt = fileType.split("/")[1];
        const fileName = `uploads/${uuidv4()}.${fileExt}`;

        const command = new PutObjectCommand({
            Bucket: process.env.BUCKET,
            Key: fileName,
            ContentType: fileType,
        });

        const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 });

        return res.status(200).json({ signedUrl, fileName });
    } catch (error) {
        console.error("Error generating signed URL:", error);
        return res.status(500).json({ error: "Could not generate signed URL" });
    }
};

module.exports = { upload: upload.single("profileImage"), getSignedUrl: getSignedUrlHandler };
