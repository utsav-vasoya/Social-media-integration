const express = require("express");
const expressSession = require("express-session");
const passport = require("passport");
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;

const app = express();
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
      clientID: "86ky3y2b86y7qy",
      clientSecret: "b8OcDKRvdMqTvzJn",
      callbackURL: "http://127.0.0.1:3002/auth/linkedin/callback",
      scope: ["r_emailaddress", "r_liteprofile"],
    },
    (accessToken, refreshToken, profile, done) => {
      process.nextTick(() => {
        return done(null, profile);
      });
    }
  )
);
app.get(
    "/auth/linkedin",
    passport.authenticate("linkedin", { state: "SOME STATE" })
  );
  
  
  app.get(
    "/auth/linkedin/callback",
    passport.authenticate("linkedin", {
      successRedirect: "/",
      failureRedirect: "/login",
    })
  );
  app.get("/", (req, res) => {
    if (req.user) {
      const name = req.user.name.givenName;
      const family = req.user.name.familyName;
      const photo = req.user.photos[0].value;
      const email = req.user.emails[0].value;
      res.send(
        `<center style="font-size:140%"> <p>User is Logged In </p>
        <p>Name: ${name} ${family} </p>
        <p> Linkedn Email: ${email} </p>
        <img src="${photo}"/>
        <button><a href="/logout">LogOut</a></button>
        </center>
        `
      )
    } else {
      res.send(`<center style="font-size:160%"> <p>This is Home Page </p>
      <p>User is not Logged In</p>
      <img style="cursor:pointer;"  onclick="window.location='/auth/linkedIn'" src="http://www.bkpandey.com/wp-content/uploads/2017/09/linkedinlogin.png"/>
    
      </center>
      `);
    }
  });
  app.get('/logout', function (req, res) {
    delete req.user
    res.send(`<center style="font-size:160%"> <p>This is Home Page </p>
      <p>User is not Logged In</p>
      <img style="cursor:pointer;"  onclick="window.location='/auth/linkedIn'" src="http://www.bkpandey.com/wp-content/uploads/2017/09/linkedinlogin.png"/>
    
      </center>
      `);
  });
app.listen(3002, () => {
  console.log("server is started");
});
