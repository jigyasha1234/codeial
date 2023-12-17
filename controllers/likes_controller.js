const Like = require("../models/like");
const Post = require("../models/post");
const Comment = require("../models/comment");

module.exports.toggleLike = async function (req, res) {
  try {
    // likes/toggle/?id=abcd&type=Post
    let likeable;
    let deleted = false;
    if (req.query.type === "Post") {
      likeable = await Post.findById(req.query.id).populate("likes");
    } else {
      likeable = await Comment.findById(req.query.id).populate("likes");
    }

    //check if like already exists or not
    let existingLike = await Like.findOne({
      likeable: req.query.id,
      onModel: req.query.type,
      user: req.user._id,
    });

    if (existingLike) {
      //if like already exist
      // we use pull to remove the likes from comment and post model
      likeable.likes.pull(existingLike._id);
      likeable.save();
      existingLike.remove();
      deleted = true;
    } else {
      // else create a new like
      let newLike = await Like.create({
        user: req.user._id,
        likeable: req.query.id,
        onModel: req.query.type,
      });
      likeable.likes.push(like._id);
      likeable.save();
    }
    return res.json(200,{
        message: "Request successful!",
        data:{
            deleted: deleted
        }
    });
  } catch (error) {
    console.log(error);
    return res.json(500, { message: "Internal Server Error" });
  }
};
