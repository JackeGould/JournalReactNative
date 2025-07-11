import multer from "multer";
import path from "path";

// 📦 Configure disk storage for uploaded files
const storage = multer.diskStorage({
  // 📂 Set the destination folder where files will be saved
  destination: function (_req, _file, cb) {
    cb(null, path.join(__dirname, "..", "uploads")); // ../uploads relative to this file
  },

  // 🏷️ Define the naming convention for uploaded files
  filename: function (_req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // e.g., 1720798451221-profile.jpg
  },
});

// 🧰 Export the configured multer instance for use in route handlers
export const upload = multer({ storage });

