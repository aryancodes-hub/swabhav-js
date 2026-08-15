const path = require("path");
const multer = require("multer");
const { UnprocessableEntityError } = require("../lib/error");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/pjpeg",
    "image/png",
    "image/webp"
  ];

  const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];

  const mimeType = file.mimetype ? file.mimetype.toLowerCase() : "";
  const ext = path.extname(file.originalname).toLowerCase();

  const isValidMime = allowedMimeTypes.includes(mimeType);
  const isValidExt = allowedExtensions.includes(ext);

  // Accept if it's a valid MIME type OR if client sent generic binary with a valid image extension
  if (isValidMime || (mimeType === "application/octet-stream" && isValidExt)) {
    cb(null, true);
  } else {
    cb(
      new UnprocessableEntityError(
        `Invalid file type (${mimeType}). Only JPEG, PNG, and WebP images are allowed.`
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2 MB limit
  },
  fileFilter
}).single("avatar");

module.exports = (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return next(
          new UnprocessableEntityError("Avatar file size must not exceed 2 MB.")
        );
      }
      return next(new UnprocessableEntityError(err.message));
    } else if (err) {
      return next(err);
    }
    next();
  });
};