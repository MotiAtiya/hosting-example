
const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const app = express();
const db = require('./models/index');
const adminController = require('./controllers/admin')

/* include my routes */
const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const newAdRouter = require('./routes/new-ad');
const adminRouter = require('./routes/admin');
const apiRouter = require('./routes/api');
const errorRouter = require('./routes/error');
/* end of my routes */

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// create session for every connection.
app.use(session({
    secret: 'DavidAndMotiYad2Website',
    cookie: { maxAge: 24*60*60*1000 }  // day time in milliseconds.
}));

/* use my routes */
app.use('/', indexRouter);
app.use('/login', adminController.checkIfLoggedIn); //middleware to check if user already logged in
app.use('/login', loginRouter);
app.use('/admin', adminController.checkIfNotLoggedIn); //middleware to check if user not logged in yet
app.use('/admin', adminRouter);
app.use('/api', adminController.checkIfNotLoggedIn); //middleware to check if user not logged in yet
app.use('/api', apiRouter);
app.use('/new-ad', newAdRouter);
app.use('/error', errorRouter);
/* end of my routes */

// create the admins if they don't exist
db.sequelize.sync()
    .then(() => {
        console.log('Database Synced 1');
        return Promise.all([
            db.User.findOrCreate({
                where: {login: 'admin'},
                defaults: {login: 'admin', password: 'admin'}
            })]
        );
    }).then(() => {
        console.log('Database Synced 2');
        return Promise.all([
            db.User.findOrCreate({
                where: {login: 'admin2'},
                defaults: {login: 'admin2', password: 'admin2'}
            })]
        );
    }).then(() => {
        console.log('2 Admin user created');
    }).catch((err) => {
        console.log('Error syncing database or creating admin users');
        console.log(err);
    });

module.exports = app;
