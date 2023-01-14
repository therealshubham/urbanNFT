// get express & make router
const express = require('express');
const router = express.Router();
const utils = require('./../models/utils');

const User = require('./../config/models/user');

// handle the traffic
router.get('/', (req, res) => {
    var data = {
        'error' : {
            'display' : 'none',
            'data' : ''
        }
    };

    if(req.query.error) {
        data['error'] = utils.errorViewHandler({'name' : 'error', 'code' : req.query.error});
    }

    console.log(req.body);

    res.render('register/index', data);
});

router.post('/', async (req, res) => {

    if(!req.body.username || !req.body.name || !req.body.password) {
        res.redirect('/register?error=4');
        return;
    }

    if(req.body.password != req.body.cpassword) {
        res.redirect('/register?error=3'); 
        return;
    }

    const tempUser = await User.findOne({username: req.body.username});
    if(tempUser) {
        res.redirect('/register?error=2'); 
        return;
    }

    const saltHash = utils.genPassword(req.body.password);
    const salt = saltHash.salt;
    const hash = saltHash.hash;

    const newUser = new User({
        username: req.body.username,
        hash: hash,
        salt: salt,
        name: req.body.name,
        mintTokens: 3
    });

    newUser.save().then((user) => {
        console.log("New User:", user);
    });

    res.redirect('/login');
});

// export the router
module.exports = router;
