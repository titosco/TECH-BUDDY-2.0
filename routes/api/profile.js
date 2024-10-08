const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {check, validationResult} = require('express-validator');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route   GET api/profile/me
// @des     Get current users profile
// @access  private

router.get('/me', auth, async(req, res) => {
    // get profile of private user not all user
    try{
        const profile = await Profile.findOne({ user: req.user.id}).populate('user', ['name', 'avater']);

        if(!profile){
            return res.status(400).json({msg : 'there is no profile for this user'});
        }

         res.json(profile)
    } catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/profile
// @des    Create or update user profile
// @access  private
router.post('/', [auth, [
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skills is required').not().isEmpty()
]], async(req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()});
    }

    const{
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        x,
        instagram,
        linkedin
    } = req.body

    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if(company) profileFields.company = company;
    if(website) profileFields.website = website;
    if(location) profileFields.location = location;
    if(bio) profileFields.bio = bio;
    if(status) profileFields.status = status;
    if(githubusername) profileFields.githubusername = githubusername;
    if(skills){
        profileFields.skills = skills.split(',').map(skill => skill.trim());
    }

    // build social objsct
    profileFields.social = {}
    if (youtube) profileFields.social.youtube = youtube;
    if (x) profileFields.social.x = x;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    // console.log(profileFields.skills);

    // await Profile.save();
    try {
        let profile = await Profile.findOne({ user: req.user.id});

        if(profile){
            // update
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id},
                { $set: profileFields},
                {new: true}
            );
            return res.json(profile);    
        };
        // create
        profile = new Profile(profileFields);

        await profile.save();
        res.json(profile);
        
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error');
    }
});

// @route   GET api/profile
// @des    Get all profiles
// @access  pubilc
router.get('/', async(req, res) =>{
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

// @route   GET api/profile/user/:user_id
// @des    Get profile by user id
// @access  pubilc
router.get('/user/:user_id', async(req, res) =>{
    try {
        const profile = await Profile.findOne({user: req.params.user_id}).populate('user', ['name', 'avatar']);

        if(!profile) return res.status(400).json({msg: 'Profile not found'});
        res.json(profile)
    } catch (err) {
        console.error(err.message);
        if(err.kind == 'ObjectId'){
            return res.status(400).json({msg: 'Profile not found'});
        }
        res.status(500).send('Server Error')
    }
});

// @route   DELETE api/profile
// @des    Delete profiles, user & post
// @access  Private
router.delete('/', auth, async(req, res) =>{
    try {
        // @todo- remove user posts

        // Remove profile
        await Profile.findOneAndDelete({ user: req.user.id});
        // remove user
        await User.findOneAndDelete({ _id: req.user.id});

        res.json({ msg: 'User deleted' })
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

// @route   PUT api/profile/experience
// @des    Add profile experience
// @access  Private

module.exports = router;