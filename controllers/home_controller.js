// module.exports.actionName=function(req,res){}

module.exports.home = function(req,res){
    return res.end('<h1> home controller is up and running</h1>');
}