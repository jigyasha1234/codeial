const User = require("../models/user");
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const queue = require('../config/kue');
const userEmailWorker = require('../workers/user_email_worker');

// module.exports.actionName=function(req,res){}

module.exports.profile = function (req, res) {
  User.findById(req.params.id).then(
    function(user){
      return res.render("user_profile", {
        title: "Users profile",
        profile_user: user,
      });
    }
  )
};

module.exports.update = async function (req, res) {
  if(req.user.id == req.params.id){
   try{
    let user = await User.findById(req.params.id);
    User.uploadedAvatar(req,res,function(error){
      console.log(req.file);
      user.name = req.body.name;
      user.email = req.body.email;
      if(req.file){
        if(user.avatar){
          fs.unlinkSync(path.join(__dirname,'..',user.avatar));
        }
        user.avatar = User.avatarPath+'/'+req.file.filename;
      }
      user.save();
      return res.redirect('back');  
    });         
    }
    catch(error) {
      console.error(error);
      return res.status(500).send("Internal server error");
    }
  }
  else{
    return res.status(401).send('unauthorized');
  }

};

//render the sign up page
module.exports.signUp = function (req, res) {
  if(req.isAuthenticated()){
    return res.redirect('/users/profile');
  }else{
  return res.render("user_sign_up", {
    title: "codeial || signUp",
  });
}
};

//render the sign in page
module.exports.signIn = function (req, res) {
  if(req.isAuthenticated()){
    return res.redirect('/users/profile');
  }else{
  return res.render("user_sign_in", {
    title: "codeial || signIn",
  });
}
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

// sign in data and create session for the user
module.exports.createSession = function (req, res) {
  req.flash('success', 'logged in successfully');
  return res.redirect('/');
};

module.exports.destroySession = function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    req.flash('success','you have logged out!');
    res.redirect('/');
  });
}

module.exports.resetPassword = function(req, res)
{
    return res.render('reset_password',
    {
        title: 'Reset Password',
        access: false
    });
}

module.exports.resetPassMail = function(req, res)
{
    User.findOne({email: req.body.email}).then( function(user)
    {
       
        if(user)
        {
            if(user.isTokenValid == false)
            {
                user.accessToken = crypto.randomBytes(30).toString('hex');
                user.isTokenValid = true;
                user.save();
                console.log('is email visible');
            }

            let job = queue.create('user-emails', user).save(function(err)
            {
                if(err)
                {
                    console.log('Error in sending to the queue', err);
                    return;
                }
                // console.log('Job enqueued', job.id);
            });

            req.flash('success', 'Password reset link sent. Please check your mail');
            return res.redirect('/');
        }
        else
        {
            req.flash('error', 'User not found. Try again!');
            return res.redirect('back');
        }
    });
}

module.exports.setPassword = function(req, res)
{
    User.findOne({accessToken: req.params.accessToken}).then(function(user)
    {
        if(user.isTokenValid)
        {
            return res.render('reset_password',
            {
                title: 'Reset Password',
                access: true,
                accessToken: req.params.accessToken
            });
        }
        else
        {
            req.flash('error', 'Link expired');
            return res.redirect('/users/reset-password');
        }
    });
}

module.exports.updatePassword = function(req, res)
{
    User.findOne({accessToken: req.params.accessToken}).then(function( user)
    {
        
        if(user.isTokenValid)
        {
            if(req.body.newPass == req.body.confirmPass)
            {
                user.password = req.body.newPass;
                user.isTokenValid = false;
                user.save();
                req.flash('success', "Password updated. Login now!");
                return res.redirect('/users/sign-in') 
            }
            else
            {
                req.flash('error', "Passwords don't match");
                return res.redirect('back');
            }
        }
        else
        {
            req.flash('error', 'Link expired');
            return res.redirect('/users/reset-password');
        }
    });
}