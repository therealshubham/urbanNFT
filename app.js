// get express & .env
require('dotenv').config();
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// listen at the port, default to 3000
app.listen(process.env.PORT || 3000);