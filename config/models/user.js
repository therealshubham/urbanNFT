const mongoose = require('mongoose');

// Creates simple schema for a User. 
const UserSchema = new mongoose.Schema({
    username: String,
    hash: String,
    salt: String,
    name: String,
    files: [
        {
            originalName: String,
            storedName: String,
            owner: String,
            type: String
        }
    ]
}, {typeKey: '$type'});

const User = mongoose.model('User', UserSchema);

// Expose the connection
module.exports = User;
