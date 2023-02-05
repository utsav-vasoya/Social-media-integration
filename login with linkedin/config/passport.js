const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
const User = require('../models/Users');

module.exports = function (passport) {
    passport.use(
        new LinkedInStrategy(
            {
                clientID: "77k4jjjwmlajne",
                clientSecret: "YwN17LKoHqJIK8V0",
                callbackURL: "http://localhost:6001/auth/linkedin/callback",
                scope: ["r_emailaddress", "r_liteprofile"],
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    let user = await User.findOne({ 'email': profile.emails[0].value });
                    if (user) {
                        return done(null, user);
                    } else {
                        const newUser = new User({
                            profile_id: profile.id,
                            image: profile.photos[2].value,
                            email: profile.emails[0].value,
                            display_name: profile.displayName
                        });
                        await newUser.save();
                        return done(null, newUser);
                    }
                } catch (err) {
                    console.error(err)
                }
            }
        )
    );

}