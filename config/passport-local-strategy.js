const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

passport.use(new LocalStrategy({
  usernameField: 'email'
},
  async (email, password, done) => {
    try {
      let user = await User.findOne({ email })

      if (!user || user.password !== password) {
        console.log("Invalid Username/Password");
        return done(null, false);
      }

      console.log("User Validated!", user);
      return done(null, user);

    } catch (error) {
      console.log("Error in Finding user!!", error);
      return done(err);
    }
  }
));

// Serialize User to decide which key to be kept in Cookie
passport.serializeUser(function (user, done) {
  done(null, user.id)
});

// Desrialize User from the key in cookies
passport.deserializeUser(function (id, done) {
  User.findById(id)
    .then((user) => {
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    })
    .catch((err) => {
      console.log("Error Finding User!!");
      return done(err);
    });
});

passport.checkAuthentication = function(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
}

passport.setAuthenticatedUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    //req.user contains signed in user from
    res.locals.user = req.user;
  }
  next();
}

module.exports = passport;