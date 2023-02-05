const express = require("express");
const expressSession = require("express-session");
const passport = require("passport");
const jwt = require("jsonwebtoken")
const mongoose = require('mongoose');
const auth = require("./config/auth");
var cookieParser = require('cookie-parser')

const app = express();
app.use(cookieParser());
app.set('view engine', 'ejs');
mongoose.connect("mongodb://127.0.0.1:27017/linkedin", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("db is connected");
  }
});

app.use(expressSession({ secret: "session_secret" }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
require('./config/passport')(passport);

app.get('/', function (req, res) {
  res.render('index.ejs');
});

app.get('/profile', auth.verifyToken, function (req, res) {
  res.render('profile.ejs', {
    user: req.user.user
  });
});

app.get("/auth/linkedin", passport.authenticate("linkedin", { scope: ['r_emailaddress', 'r_liteprofile'] }));


app.get("/auth/linkedin/callback", passport.authenticate("linkedin", { session: false }), (req, res, next) => {
  if (req.isAuthenticated()) {
    jwt.sign({ user: req.user }, "secretKey", { expiresIn: "1h" }, (err, token) => {
      if (err) {
        return res.json({ token: null });
      }
      res.cookie('auth', token);
      res.redirect("/profile");
    })
  } else {
    res.send('Unauthorized');
  }
});

app.get('/logout', auth.verifyToken, function (req, res) {
  req.logout(req.user, async err => {
    if (err) return next(err);
    res.clearCookie("auth")
    res.redirect('/');
  });
});

app.listen(6001, () => {
  console.log("server is started");
});
