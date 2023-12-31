const Post = require("../models/post");
const User = require("../models/user");

// module.exports.actionName=function(req,res){}

module.exports.home = async function (req, res) {
  try {
    let posts = await Post.find({})
      .sort("-createdAt")
      .populate("user")
      .populate({
        path: "comments",
        populate: {
          path: "user"
        },
       
      });

    let users = await User.find({});
    return res.render("home", {
      title: "Codeial | Home",
      posts: posts,
      all_user: users,
    });
  } catch (error) {
    console.log(error);
    return;
  }
};
