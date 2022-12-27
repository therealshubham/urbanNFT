// get express & make router
const express = require('express');
const router = express.Router();

const upload = require('./../config/multer');

// handle the traffic
router.get('/', (req, res) => {
    res.render('mint/index');
});

router.post('/', upload.single('user_file'), (req, res) => {
    console.log(req.file, req.body);
    res.render('mint/index');
});

// export the router
module.exports = router;
