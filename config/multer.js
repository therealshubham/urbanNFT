const multer = require('multer');

// set up file upload handler
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './tmp/assets/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = req.user.username + '-' + Date.now();
        cb(null, uniqueSuffix + '-' + file.originalname)
    }
});

const upload = multer({
    storage: storage
});

module.exports = upload
