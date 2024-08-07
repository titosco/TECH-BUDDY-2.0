const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

// @route   GET api/auth
// @des     Test route
// @access  public
router.get('/', auth, async(req, res) => {
    try{
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

// To login in a User

// @route   POST api/auth
// @des     Authenticate user and get token
// @access  public
router.post('/', [
    check('email', 'pls put a valid Email')
        .isEmail(),
    check('password', 'Password is required')
        .exists()
],
async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try{

    let user = await User.findOne({email});

    if(!user){
        return res
        .status(400)
        .json({ errors: [ { msg: 'Invalid Credentials'}] });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        return res
        .status(400)
        .json({ errors: [ { msg: 'Invalid Credentials'}] }   );
    }

    // Return jsonwebtoken
    const payload = {
        user: {
            id: user.id
        }
    }

    jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000},
        (err, token) =>{
            if(err) throw err;
            res.json({ token });
        });
    }catch(err){
        console.error(err.message);
        res.status(500).send('server error')
    }



    
});

module.exports = router;