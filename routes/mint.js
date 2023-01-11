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
    // console.log(req.file, req.body);
    const user = await User.findOne({username: req.user.username});
    data.user = user;
    res.render('mint/index', data);
});

// export the router
module.exports = router;
