const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.headers['x-access-token'] || req.body.token 

    if(token){
        jwt.verify(token,process.env.API_KEY,(err,decoded)=>{
            if(err){
                res.json({
                    status:false,
                    message:"Wrong token is provided"
                });
            }else{
                req.decode = decoded,
                next();
            }

        });

    }else {
        res.json({
            status: false ,
            message: 'Token is not provided'
        })
    }
}