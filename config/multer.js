const multer = require('multer');
const path = require('path');

const User = require('./models/user');

// set up file upload handler
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/assets/');
    },
    filename: async (req, file, cb) => {
        const storedName = req.user.username + '-' + Date.now() + path.extname(file.originalname);
        req.body.storedName = storedName;
        cb(null, storedName);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    },
    limits: { 
        fileSize: 4 * 1024 * 1024 
    }
});

module.exports = upload
