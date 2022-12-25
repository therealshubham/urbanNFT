// get express & make router
const express = require('express');
const passport = require('passport');
const router = express.Router();

// handle the traffic
router.get('/', (req, res) => {
    res.render('login/index');
});

router.post('/', passport.authenticate('local', { 
    failureRedirect: '/login', 
    successRedirect: '/dashboard' 
}));

// export the router
module.exports = router;
