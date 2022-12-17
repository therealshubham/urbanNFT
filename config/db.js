const mongoose = require('mongoose');
require('dotenv').config();

const conn = 'mongodb://shubham:Sg1253***@http://156.67.210.61:27017/urbannft';

const connection = mongoose.createConnection(conn, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Creates simple schema for a User.  The hash and salt are derived from the user's given password when they register
const UserSchema = new mongoose.Schema({
    username: String,
    hash: String,
    salt: String
});

const User = connection.model('User', UserSchema);

// Expose the connection
module.exports = connection;
