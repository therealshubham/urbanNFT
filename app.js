// get express & .env
require('dotenv').config();
const express = require('express');
const app = express();

// passport.js & session & db
const session = require('express-session');
const passport = require('passport');

// get ejs layouts
const expressLayouts = require('express-ejs-layouts');

// get routers from controllers (routes)
const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');

// setup basics
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'));

// some middlewares to parse POST data
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// sanity check for launch
console.log("Starting UrbanNFT...");

// send all traffic to index router in routes
app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);

// listen at the port, default to 3000
app.listen(process.env.PORT || 3000);
