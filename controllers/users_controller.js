const User = require("../models/user");

// module.exports.actionName=function(req,res){}

module.exports.profile = function (req, res) {
  return res.render("user_profile", {
    title: "Users profile",
  });
};
//render the sign up page
module.exports.signUp = function (req, res) {
  return res.render("user_sign_up", {
    title: "codeial || signUp",
  });
};

//render the sign in page
module.exports.signIn = function (req, res) {
  return res.render("user_sign_in", {
    title: "codeial || signIn",
  });
};

// get the sign up data
module.exports.create = function (req, res) {

  if (req.body.password !== req.body.confirm_password) {
    return res.redirect("back");
  }

  User.findOne({ email: req.body.password }).then((user) => {
    if (!user) {
      User.create(req.body).then((user) => {
        console.log(user);
        return res.redirect("/users/sign-in");
      });
    } else {
      return res.redirect("back");
    }
  });

};

// get the sign in data and create session
module.exports.createSession = function (req, res) {
  //TODO later
};
