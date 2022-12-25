const mongoose = require('mongoose');
require('dotenv').config();

mongoose.set('strictQuery', false);
const conn = process.env.DB_STRING;

function mongoInitConnection() {
    mongoose.connect(conn).then(
        data => {
            console.log(`Connected to MongoDB: ${data.connection.host} @ ${data.connection.name}`);
        }
    ).catch(
        e => {
            console.log(e);
        }
    );
}

// Expose the connection function
module.exports.mongoInitConnection = mongoInitConnection;
