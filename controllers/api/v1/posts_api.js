const Post = require("../../../models/post");
const Comment = require("../../../models/comment");

module.exports.index = async function (req, res) {
  let posts = await Post.find({})
    .sort("-createdAt")
    .populate("user")
    .populate({
      path: "comments",
      populate: {
        path: "user",
      },
    });
  return res.json(200, {
    message: "List of posts",
    posts: posts,
  });
};

module.exports.destroy = async function (req, res) {
  try {
    let post = await Post.findById(req.params.id);
    if(post.user == req.user.id){
      await post.deleteOne();
      await Comment.deleteMany({ post: req.params.id });
      return res.status(200).json({
          message: "post and associated comments deleted successfully!",
        });
    }else{
      return res.status(200).json({
        message: "you can't not deleted this post !",
      });
    }
    
  } catch (error) {
    console.error(error);
    return res.json(500, {
      message: "internal sever error",
    });
  }
};
