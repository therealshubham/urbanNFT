// get express & make router
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const User = require('./../config/models/user');

// handle the traffic
router.get('/', (req, res) => {
    res.json({"error" : 0, "note" : "invalid endpoint"});
});

router.post('/delete', async (req, res) => {
    try {
        const user = await User.findOne({hash: req.body.hash});
        tempArr = user.files;
        var toDeleteIdx = -1;
        for(var i = 0; i < tempArr.length; i++) {
            if(tempArr[i].storedName === req.body.id) {
                toDeleteIdx = i;
                break;
            }
        }

        if(toDeleteIdx != -1) {
            tempArr.splice(toDeleteIdx, 1);
            user.files = tempArr;
            fs.unlinkSync(path.resolve('.') + `/public/assets/${req.body.id}`);
            await user.save();
            res.json({"error" : 0, "note" : `deleted image!`});
            return;
        }

        res.json({"error" : 1, "note" : `could not delete :/`});
        return;

    } catch(e) {
        console.log(e);
        res.json({"error" : 1, "note" : `${e}`});
        return;
    }
});


// export the router
module.exports = router;
