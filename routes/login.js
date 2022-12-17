// get express & make router
const express = require('express');
const router = express.Router();

// handle the traffic
router.get('/', (req, res) => {
    var data = {
        'name' : 'Varun'
    };
    res.render('login/index', data);
});

// export the router
module.exports = router;
