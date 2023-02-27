const jwt = require("jsonwebtoken");

const verifyToken = (req,res,next) =>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded)=>{
        if(err) return res.status(401).json({
            messsage : "Your login session ended, please Login again"
        });
        req.email = decoded.email;
        next();
    })
}

module.exports = verifyToken;