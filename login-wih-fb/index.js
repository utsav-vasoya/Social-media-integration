const express = require('express')
const app = express()
const passport = require('passport');
require('./passport')
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.send(`Hello world`)
})

app.get('/auth/error', (req, res) => res.send('Unknown Error'))

app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/auth/error' }),
  function (req, res) {
    console.log(req.user, req.isAuthenticated());
    res.redirect('/');
  });

app.get('/logout', (req, res) => {
  req.logout();
  res.clearCookie()
  console.log(req.isAuthenticated());
  res.send('user logout');
})

app.listen(6005, () => {
  console.log('Serve is up and running at the port 8000')
})