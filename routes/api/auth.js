const express = require("express");
const router = express.Router();

//@route get api/auth
//test route
//access public
router.get('/', (req,res) => res.send('Auth route'));


module.exports = router;
