var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var Strategy = require('passport-twitter').Strategy;
var session = require('express-session');
const ejs = require('ejs');
passport.use(new Strategy({
    consumerKey: '',
    consumerSecret: '',
    callbackURL: 'http://localhost:3000/twitter/return'
}, function (token, tokenSecret, profile, callback) {
    return callback(null, profile);
}));

passport.serializeUser(function (user, callback) {
    callback(null, user);
})

passport.deserializeUser(function (obj, callback) {
    callback(null, obj);
})

var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'whatever', resave: true, saveUninitialized: true }))
app.use(passport.initialize())
app.use(passport.session())

app.get('/', function (req, res) {
    res.render('home.ejs');
})

app.get('/login', function (req, res) {
    res.render('index.ejs', { user: req.user });
})

app.get('/auth/error', (req, res) => res.send('Unknown Error'))

app.get('/twitter/login', passport.authenticate('twitter'))

app.get('/twitter/return', passport.authenticate('twitter', {
    failureRedirect: '/auth/error'
}), function (req, res) {
    res.redirect('/login')
})

app.get("/logout", (req, res) => {
    req.logout(req.user, async err => {
        if (err) return next(err);
        res.redirect('/');
    });
});

app.listen(3000, () => {
    console.log('Server is up and running at the port 3000')
})