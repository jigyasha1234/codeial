const User = require('../../../models/user');
const jwt = require('jsonwebtoken');

module.exports.createSession =async function (req, res) {
  try{
    let user = await User.findOne({email: req.body.email});
    if(!user || user.password != req.body.password){
      return res.status(422).json({
        message: "invalid username/password"
      }); }
    return res.status(200).json({
      message: "signn in successful, here is your token, please keep it safe",
      data: {
        token: jwt.sign(user.toJSON(), 'secret', {expiresIn: '10000000'})
      }
    })  
  }catch(error) {
    console.error(error,"----===---:(");
    return res.status(500).send("Internal server error");
  }
};