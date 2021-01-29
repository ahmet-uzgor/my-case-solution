const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const authenticate = (req, res, user) => {
    if(!user.password) res.json({ status: 404, messsage: 'Heyy no user in userController' })

    bcrypt.compare(req.body.password, user.password).then((result)=>{
        if(result==false){
            res.json({ status: 404, message: "Password is wrong" });
        } else{
            const payload = { username: user.username };
            const token = jwt.sign(payload, process.env.API_KEY, { expiresIn: 60 });
            res.json({ status: true, token });
        }
    }).catch(err => console.log(err))
}

module.exports = { authenticate }