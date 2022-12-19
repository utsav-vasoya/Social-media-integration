const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});
passport.use(new TwitterStrategy({
  consumerKey: "6a9csCvUaMTx9c63LnWHL8taI",
  consumerSecret: "avlRHyydSyPjzOdzMtH5vJx8t31zg7CbJRqudpqEVPuF7YcpQZ",
  callbackURL: "http://localhost:8000/auth/twitter/callback",
},
function(accessToken, refreshToken, profile, done) {
  return done(null, profile);
}
));