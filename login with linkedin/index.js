const express = require("express");
const expressSession = require("express-session");
const passport = require("passport");
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;

const app = express();
app.set('view engine', 'ejs');
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

app.use(expressSession({ secret: "session_secret" }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

passport.use(
  new LinkedInStrategy(
    {
      clientID: "77k4jjjwmlajne",
      clientSecret: "YwN17LKoHqJIK8V0",
      callbackURL: "http://localhost:3002/auth/linkedin/callback",
      scope: ["r_emailaddress", "r_liteprofile"],
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

app.get('/', function (req, res) {
  res.render('index.ejs');
});

app.get('/profile', isLoggedIn, function (req, res) {
  res.render('profile.ejs', {
    user: req.user
  });
});

app.get(
  "/auth/linkedin",
  passport.authenticate("linkedin", { scope: ['r_emailaddress', 'r_liteprofile'] })
);


app.get(
  "/auth/linkedin/callback",
  passport.authenticate("linkedin", {
    successRedirect: "/profile",
    failureRedirect: "/login",
  })
);

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
}
app.get('/logout', function (req, res) {
  req.logout(req.user, async err => {
    if (err) return next(err);
    res.redirect('/');
  });
});

app.listen(6001, () => {
  console.log("server is started");
});
