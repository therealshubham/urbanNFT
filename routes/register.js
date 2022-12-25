// get express & make router
const express = require('express');
const router = express.Router();
const utils = require('./../models/utils');

const User = require('./../config/models/user');

// handle the traffic
router.get('/', (req, res) => {
    res.render('register/index');
});

router.post('/', (req, res) => {
    
    console.log(req.body);
    const saltHash = utils.genPassword(req.body.password);
    
    const salt = saltHash.salt;
    const hash = saltHash.hash;

    const newUser = new User({
        username: req.body.username,
        hash: hash,
        salt: salt
    });

    newUser.save().then((user) => {
        console.log(user);
    });

    res.redirect('/login');
});

// export the router
module.exports = router;
