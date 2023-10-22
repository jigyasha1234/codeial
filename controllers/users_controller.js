// module.exports.actionName=function(req,res){}

module.exports.profile = function(req,res){
    return res.render('user_profile', {
        'title': "Users profile"
    })
}
//render the sign up page
module.exports.signUp = function(req,res){
    return res.render('user_sign_up', {
        'title': "codeial || signUp"
    })
}

//render the sign in page
module.exports.signIn = function(req,res){
    return res.render('user_sign_in', {
        'title': "codeial || signIn"
    })
}

// get the sign up data
module.exports.create = function(req,res){
    //TODO later
}

// get the sign in data and create session
module.exports.createSession = function(req,res){
    //TODO later
}