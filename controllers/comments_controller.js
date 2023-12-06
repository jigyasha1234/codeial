const Comment = require("../models/comment");
const Post = require("../models/post");
const commentsMailer = require('../mailers/comments_mailer');
const nodeMailer = require('../config/nodemailer');

module.exports.create = async function(req, res)
{
    try
    {
        let post = await Post.findById(req.body.post);
        if(post)
        {
            let comment = await Comment.create
            (
                {
                    content: req.body.content,
                    post: req.body.post,
                    user: req.user._id
                }
            );
            post.comments.push(comment);
            post.save();           

            // // when not using redis
            // commentsMailer.newComment(comment);

           let comt = await Comment.findById({_id: comment._id}).populate("user")
           .populate({
             path: "post",
             populate: {
               path: "user",
             },
           })

            commentsMailer.newComment(comt);

            if (req.xhr)
            {
                return res.status(200).json
                ({
                    data: 
                    {
                        comment: comment
                    },
                    message: "Comment created"
                });
            }

            req.flash('success', 'Comment Added');
            return res.redirect('back');
        }
    }
    catch(err)
    {
        req.flash('error', err);
        console.log(err);
        return res.redirect('back');
    }
}

module.exports.destroy = function (req, res) {
  Comment.findById(req.params.id).then(function (comment) {
    if (comment.user == req.user.id) {
      let postId = comment.post;
      comment.deleteOne();
      Post.findByIdAndUpdate(postId,{$pull: {comments: req.params.id}}).then(
        function(){
          return res.redirect('/');
        })
    }else{
      return res.redirect('/');
    }
  });
};
