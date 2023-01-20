// get express & make router
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const User = require('./../config/models/user');
const web3utils = require('./../models/web3');
require('dotenv').config({ path: './../.env'});

// handle the traffic
router.get('/', (req, res) => {
    res.json({"error" : 0, "note" : "invalid endpoint"});
});

// to delete an image
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

// to mint an NFT
router.post('/mint', async (req, res) => {
    try {
        // check for account balance
        const user = await User.findOne({username: req.user.username});
        if(user.mintTokens <= 0) {
            res.json({"error" : 1, "note" : `Not enough mint tokens!`}); 
            return; 
        }
        user.mintTokens = user.mintTokens - 1;

        // check for valid addr format
        if(web3utils.checkAddress(req.body.addr) == false) {
            res.json({"error" : 1, "note" : `Invalid Address!`}); 
            return;
        }

        // create the json file
        // "https://images2.alphacoders.com/955/95580.jpg"
        var json = {
            "name": req.body.name,
            "image": process.env.BASE_URL + "/assets/" + req.body.id,
            "description": req.body.description
        };
        
        fs.writeFileSync(
            path.resolve('.') + `/public/json/${req.body.id + '.json'}`, 
            JSON.stringify(json), 
            'utf8'
        );

        var jsonUrl = process.env.BASE_URL + "/json/" + req.body.id + '.json';

        // mint the NFT
        var contract = web3utils.getSmartContract();
        const transaction = contract.methods.safeMint(req.body.addr, jsonUrl);
        var web3res = await web3utils.executeTransaction(transaction);
        // console.log(web3res);
        for(var i = 0; i < user.files.length; i++) {
            if(user.files[i].storedName === req.body.id) {
                user.files[i].isMinted = true;
                await user.save();
                break;
            }
        }

        await user.save();

        // respond
        res.json({"error" : 0, "note" : `Minted!!`}); 
        return;

    } catch(e) {
        res.json({"error" : 1, "note" : `${e}`}); 
        return;
    }
});

// export the router
module.exports = router;
