// get express & .env
require('dotenv').config();
const express = require('express');
const app = express();
const utils = require('./models/utils');

// passport.js & session & db
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');

// get ejs layouts
const expressLayouts = require('express-ejs-layouts');

// get routers from controllers (routes)
const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');
const dashboardRouter = require('./routes/dashboard');
const myCollectionRouter = require('./routes/my-collection');
const mintRouter = require('./routes/mint');

// setup basics
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'));

// some middlewares to parse POST data
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// passport session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ 
        mongoUrl: process.env.DB_STRING, 
        collection: 'sessions' 
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    }
}));

// sanity check for launch
console.log("Starting UrbanNFT...");

// init the mongoDB connection
const db = require("./config/db");
db.mongoInitConnection();

// Need to require the entire Passport config module so app.js knows about it
require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    // console.log(req.user);
    next();
});

// send all traffic to index router in routes
app.use('/', indexRouter);
app.use('/login', utils.loggedInAlready, loginRouter);
app.use('/register', utils.loggedInAlready, registerRouter);
app.use('/dashboard', utils.ensureAuthenticated, dashboardRouter);
app.use('/my-collection', utils.ensureAuthenticated, myCollectionRouter);
app.use('/mint', utils.ensureAuthenticated, mintRouter);

app.get('/logout', (req, res) => {
    req.logout(
        (err) => {
            if (err) { 
                return next(err); 
            }
            res.redirect('/');
        }
    );
});

// listen at the port, default to 3000
app.listen(process.env.PORT || 3000);
