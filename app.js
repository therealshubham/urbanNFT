// get express & .env
require('dotenv').config();
const express = require('express');
const app = express();

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
        maxAge: 1000 * 60 * 60 * 24 * 1 // 1 day
    }
}));

// Need to require the entire Passport config module so app.js knows about it
require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

// sanity check for launch
console.log("Starting UrbanNFT...");

app.use((req, res, next) => {
    console.log(req.session);
    console.log(req.user);
    next();
});

// send all traffic to index router in routes
app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);

// listen at the port, default to 3000
app.listen(process.env.PORT || 3000);
