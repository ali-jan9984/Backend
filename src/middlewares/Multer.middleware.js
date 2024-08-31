import multer from "multer";

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        // Set the destination folder where files will be uploaded
        cb(null, "./pictures");
    },
    filename: function(req, file, cb) {
        // Set the uploaded file's name
        cb(null, file.originalname); // Optionally, you can prepend Date.now() to avoid name collisions
    }
});

export const upload = multer({ storage: storage });
