const passport = require('passport');
const moongose = require('mongoose');
const User = moongose.model('User');

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
