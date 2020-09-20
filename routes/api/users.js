const express = require("express");
const router = express.Router();
const gravatar = require ("gravatar");
const bcrypt = require ("bcryptjs");
const { check , validationResult } = require('express-validator/check');
const User = require('..//../models/User');
//@route get api/users
//register user
//access public
router.post('/',
[
  check('name', 'Name is required').not().isEmpty(),
  check('email', "Please enter a valid email").isEmail(),
  check('password', "Please enter a password with 6 or more characters").isLength({min:6}),
],

async(req,res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()){
    return res.status(400).json({errors: errors.array() });
  }

const {name, email, password} = req.body;

try{
  //see if user exists
  let user = await User.findOne({email});
  if (user){
    return res.status(400).json({errors: [{ msg: "user already exists "}]});
  }

  //get users' gravatar（头像）
  const avatar = gravatar.url(email, {
    s: '200',
    r: "pg",
    d: "mm"
  })

  user = new User({
    name,
    email,
    avatar,
    password
  });


//encrypt password

const salt = await bcrypt.genSalt(10); //数字越大，越安全
user.password = await bcrypt.hash(password, salt);
await user.save();



  //return jsonwebtoken (验证码）


  res.send('User registered');

}catch(err){
  console.log(err.message);
  res.status(500).send("server error");

}

});


module.exports = router;
