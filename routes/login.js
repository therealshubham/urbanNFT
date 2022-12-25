// get express & make router
const express = require('express');
const passport = require('passport');
const router = express.Router();
const utils = require('./../models/utils');

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

    res.render('login/index', data);
});

router.post('/', passport.authenticate('local', { 
    failureRedirect: '/login?error=1', 
    successRedirect: '/dashboard'
}));

// export the router
module.exports = router;
