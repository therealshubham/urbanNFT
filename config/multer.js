const multer = require('multer');
const path = require('path');

const User = require('./models/user');

// set up file upload handler
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/assets/');
    },
    filename: async (req, file, cb) => {
        const tempUser = await User.findOne({username: req.user.username});
        if(!tempUser) cb(new Error("User not found, please log out and try again!"), 'null');
        
        const storedName = req.user.username + '-' + Date.now() + path.extname(file.originalname);
        var newFile = {
            'originalName' : file.originalname,
            'storedName' : storedName,
            'owner' : req.user.username,
            'type' : file.mimetype,
            'isMinted' : false
        };

        tempUser.files.push(newFile);
        tempUser.save();

        cb(null, storedName);
    }
});

const upload = multer({
    storage: storage
});

module.exports = upload
