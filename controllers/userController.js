const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const authenticate = (req, res, user) => {

    bcrypt.compare(req.body.password, user.password).then((result)=>{
        if(result==false){
            res.json({ status: 404, message: "Username or password is wrong" });
        } else{
            const payload = { username: user.username };
            const token = jwt.sign(payload, process.env.API_KEY, { expiresIn: 1800 });
            res.json({ status: true, token });
        }
    }).catch(err => console.log('bcrypt error'))
}

module.exports = { authenticate }