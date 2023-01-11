// get express & make router
const express = require('express');
const router = express.Router();

const upload = require('./../config/multer');
const User = require('./../config/models/user');

var data = {};

// handle the traffic
router.get('/', async (req, res) => {
    const user = await User.findOne({username: req.user.username});
    data.user = user;
    res.render('mint/index', data);
});

// handle the upload POST request
router.post('/', upload.single('user_file'), async (req, res) => {
    
    // console.log(req.file, req.user, req.body);
    if(req.file) {
        const tempUser = await User.findOne({username: req.user.username});
        if(!tempUser) {
            data.user = tempUser;
            res.render('mint/index', data);
            return;
        }
        var newFile = {
            'originalName' : req.file.originalname,
            'storedName' : req.body.storedName,
            'owner' : req.user.username,
            'type' : req.file.mimetype,
            'isMinted' : false
        };
        tempUser.files.push(newFile);
        await tempUser.save();
    }
    
    res.redirect('/mint');
    return;
});

// export the router
module.exports = router;
