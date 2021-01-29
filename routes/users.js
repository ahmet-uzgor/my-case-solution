const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // Password hashing
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const { authenticate } = require('../controllers/userController');
const { createUser, findByUsername } = require('../services/userListDB');

//urlencodedParser
const urlencodedParser = express().use(bodyParser.urlencoded({extended: false}))

// users/ GET user register or login page 
router.get('/', (req, res)=> {
  res.render('users', { message: "Please register firstly", title: 'Bitaksi Backend Coding Challenge' });
});

// users/register POST. it creates a new user with specifed username & password
router.post('/register', (req,res)=>{
  const {username , password} = req.body;
  if (!username || !password) res.json({ message: "Username or password is not specified" });
  bcrypt.hash(password,10).then((hash)=>{

    // it creeates user on userList array which is like small Db to keep all users infos and passwords with hash  
    const userCreated = createUser(username, hash).then(user => {
      if(!user) res.json({ message: 'User not found' })
      else {
        res.json({ status:'OK', response:'User created' })
      }
    }).catch(err => console.log(err))

  }).catch((err)=>{
    console.log("Hashing ERROR", err);
  });
});

// users/authenticate POST user with its name & password and JWT creates and compare of user info's
router.post('/authenticate', urlencodedParser, (req,res)=>{
  const {username , password} = req.body;
  const api_secret_key =  process.env.API_KEY
  
  if (!username || !password) res.json({ message: 'Username or password is null' })
  const user = findByUsername(username)
  if (!user) res.json('User not found')
  else authenticate(req, res, user)

});

module.exports = router;