const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (obj, done) {
  done(null, obj);
});
passport.use(new FacebookStrategy({
  clientID: "508058174611964",
  clientSecret: "cb55e78e1fb433fbda21904c17091f62",
  callbackURL: "http://localhost:8000/auth/facebook/callback",
  profileFields: ['id', 'displayName']
},
  function (accessToken, refreshToken, profile, done) {
    console.log(accessToken, refreshToken, profile)
    const user = {

    }
    return done(null, user);
  }
));