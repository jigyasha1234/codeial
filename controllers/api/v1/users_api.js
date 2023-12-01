const User = require('../../../models/user');
const jwt = require('jsonwebtoken');

module.exports.createSession =async function (req, res) {
  try{
    let user = User.findOne({email: req.body.email});
    if(!user || user.password != req.body.password){return}
  }catch(error) {
    console.error(error,"----===---:(");
    return res.status(500).send("Internal server error");
  }
};