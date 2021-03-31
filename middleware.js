const jwt = require("jsonwebtoken");
const Config = require("./config");
exports.authenticate=async(req,res,next)=>{
 
    let token = req.headers.authorization;
    jwt.verify(token, Config.jwtsecret, (err, decoded) => {
        if (err){
           res.status(401).send({message:"Authorization information is missing or invalid"});
           return;
        } 
        else 
        next();
        
      });

}