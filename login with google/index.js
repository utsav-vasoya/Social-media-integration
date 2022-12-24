const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const jwt = require("jsonwebtoken")
var cookieParser = require('cookie-parser')
const auth = require("./config/auth");
require('./config/passport')(passport);
const User = require('./models/User');
const bcrypt = require("bcryptjs");
const bp = require("body-parser");
const PORT = 6000;
var app = express();
app.use(cookieParser());
app.use(bp.json());
app.use(express.urlencoded({ extended: true }));
mongoose.connect("mongodb://127.0.0.1:27017/google-auth", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("db is connected");
    }
});


app.get("/profile", auth.verifyToken, (req, res) => {
    res.send("Welcome");
});
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
app.get('/auth/google/callback', passport.authenticate('google', { session: false }), (req, res, next) => {
    console.log(req.user, req.isAuthenticated());
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
})

app.post("/register-user", async (req, res) => {
    const { display_name, email, password } = req.body;
    if (!display_name || !email || !password) {
        return res.send("Please enter name,email and password")
    }
    const finduser = await User.findOne({ email })
    if (finduser) {
        return res.status(400).json({ message: "User Alredy Registerd!" });
    }
    const newUser = new User({
        display_name,
        email,
        password,
        login_type: "local"
    });
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);

    await newUser.save();
    return res.status(201).json({
        newUser,
        message: "You are successfully registred. Please nor login.",
        success: true
    });
})

app.post("/login-user", async (req, res) => {
    let { email, password } = req.body;
    if (!email || !password) {
        return res.send("Please enter name,email and password")
    }
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({
            message: "Username is not found. Invalid login credentials.",
            success: false
        });
    }
    if (user.login_type == 'google') {
        return res.status(404).json({
            message: "User Already Login.",
            success: false
        });
    }

    let ismatch = await bcrypt.compare(password, user.password);
    if (ismatch) {
        let token = jwt.sign(
            {
                user_id: user._id
            },
            "secretKey",
            { expiresIn: "1h" }
        );

        let result = {
            username: user.display_name,
            login_type: user.login_type,
            token: token,
        };
        res.cookie('auth', token);
        res.redirect("/profile");
        // return res.status(200).json({
        //     result,
        //     message: "You are now logged in.",
        //     success: true
        // });
    } else {
        return res.status(403).json({
            message: "Incorrect password.",
            success: false
        });
    }
});
app.listen(PORT, console.log(`listening at ${PORT}`));