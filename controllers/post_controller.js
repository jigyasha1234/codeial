// module.exports.actionName=function(req,res){}

const Post = require("../models/post");
const Comment = require("../models/comment");

module.exports.create = function (req, res) {
  Post.create({
    content: req.body.content,
    user: req.user._id,
  });
  return res.redirect("/");
};

// module.exports.destroy = function (req, res) {
//   Post.findById(req.params.id).then(function (post) {
//     if(post.user == req.user.id){
//         post.remove();

//     Comment.deleteMany({post
//       : req.params.id}).then(function(){
//         return res.redirect('back');
//     })
// }else{
//     return res.redirect('back');
// }
//   });
// };


module.exports.destroy = async function (req, res) {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send('Post not found');
    }
    if (post.user == req.user.id) {
      await post.deleteOne();
      await Comment.deleteMany({ post: req.params.id });
      return res.redirect('back');
    } else {
      return res.redirect('back');
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal server error');
  }
};