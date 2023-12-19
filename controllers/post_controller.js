// module.exports.actionName=function(req,res){}

const Post = require("../models/post");
const Comment = require("../models/comment");
const Like = require("../models/like");

module.exports.create = async function (req, res) {
  try {
    let post = await Post.create({
      content: req.body.content,
      user: req.user._id,
    });
    if (req.xhr) {
      return res.status(200).json({ 
        data: { post: post },
        message: 'post created!'
       });
    }
    req.flash("success", "post created successfuly");
    return res.redirect("back");
  } catch (err) {
    req.flash("error", err);
    return res.redirect("back");
  }
};

module.exports.destroy = async function (req, res) {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send("Post not found");
    }
    if (post.user == req.user.id) {

      // await Like.deleteMany({likeable: post, onmodel: 'Post'});
      // await Like.deleteMany({_id: {$in: post.comments}});

      await post.deleteOne();
      await Comment.deleteMany({ post: req.params.id });
      
      if(req.xhr){
        return res.status(200).json({
          data: {
            post_id: req.params.id
          },
          message: "Post deleted"
        });
      }

      req.flash("error", "post deleted successfuly");
      return res.redirect("back");
    } else {
      return res.redirect("back");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal server error");
  }
};
