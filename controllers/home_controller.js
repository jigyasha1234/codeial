
const Post = require('../models/post');

// module.exports.actionName=function(req,res){}

module.exports.home = function(req,res){
    // Post.find({}).then(function(post){
    //     return res.render('home', {
    //         title: "Codeial | Home",
    //         posts: post
    //     });
    // })

    Post.find({}).populate('user').populate({
        path: 'comments',
        populate: {
            path:'user'
        }
    })
    .exec().then(
        function(posts){
            return res.render('home', {
                title: "Codeial | Home",
                posts: posts
            });
        }
    );
    
}