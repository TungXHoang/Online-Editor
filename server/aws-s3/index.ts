import multer from "multer";
import { S3Client } from "@aws-sdk/client-s3";
import multerS3 from "multer-s3";

// if (process.env.NODE_ENV !== "production") {
//     import("dotenv").then((dotenv) => dotenv.config());
// }
import dotenv from "dotenv"

dotenv.config();


const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
    },
    region: process.env.AWS_BUCKET_REGION,
});

const s3Storage = multerS3({
    s3, // s3 instance
    bucket: process.env.AWS_BUCKET_NAME,
    acl: "public-read", // storage access type
    metadata: (_req, file, cb) => {
        cb(null, {
            fieldname: file.fieldname,
        });
    },
    key: (_req, file, cb) => {
        const fileName =
            Date.now() + "_" + file.fieldname + "_" + file.originalname;
        cb(null, fileName);
    },
});

const uploadImage = multer({
    storage: s3Storage,
    fileFilter: (_req, file, cb) => {
        if (
            file.mimetype == "image/png" ||
            file.mimetype == "image/jpg" ||
            file.mimetype == "image/jpeg"
        ) {
            cb(null, true);
        } else {
            cb(null, false);
            const err = new Error("Only .png, .jpg and .jpeg format allowed!");
            err.name = "ExtensionError";
            return cb(err);
        }
    },
});

export { uploadImage, s3 };
