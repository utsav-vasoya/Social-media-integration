const express = require("express");
const app = express();
const passport = require("passport");
const InstagramStrategy = require("passport-instagram").Strategy;


app.use(passport.initialize());
passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});



passport.use(new InstagramStrategy({
    clientID: "680391643618765",
    clientSecret: "4b1f615d79b0e7a5f9dca7207f49e7a3",
    callbackURL: "http://127.0.0.1:3002/auth/instagram/callback"
},
    function (accessToken, refreshToken, profile, done) {
        User.findOrCreate({ instagramId: profile.id }, function (err, user) {
            return done(err, user);
        });
    }
));
app.get('/auth/instagram',
    passport.authenticate('instagram'));

app.get('/', function (req, res) {
    res.send('index.ejs');
});

app.get('/login', function (req, res) {
    res.send('sds.ejs');
  });
app.get('/auth/instagram/callback',
    passport.authenticate('instagram', { failureRedirect: '/login' }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    });


app.listen(6006, () => {
    console.log("server is started");
});