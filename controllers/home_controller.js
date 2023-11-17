const Post = require('../models/post');
const User = require('../models/user');

// module.exports.actionName=function(req,res){}

module.exports.home = function(req,res){
    Post.find({}).sort('-createdAt').populate('user').populate({
        path: 'comments',
        populate: {
            path:'user'
        }
    })
    .exec().then(
        function(posts){
            User.find({}).then(
                function(users){
                    return res.render('home', {
                        title: "Codeial | Home",
                        posts: posts,
                        all_user: users,
                    });
                }
            )
        }
    );
    
}