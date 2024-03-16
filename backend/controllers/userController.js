import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

// @desc Auth user/ set token
// route POST /api/user/auth
// @access public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email:email });

    //ToDo: Check if user already logged in

    //check if created
    if(user && (await user.matchPassword(password))){
        generateToken(res, user._id);
        //send status
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
        })
    }
    
    else{
        res.status(400);
        throw new Error("Invalid email or password.")
    }
});

// @desc Reg new user
// route POST /api/users
// @access public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    //check if current user
    const userExists = await User.findOne({email:email});
    if(userExists){
        res.status(400);
        throw new Error("User already exists!");
    }

    //Create user
    const user = await User.create({
        name, email, password
    });

    //check if created
    if(user){
        generateToken(res, user._id);
        //send status
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
        })
    }
    //
    else{
        res.status(400);
        throw new Error("Invalid user")
    }

    res.status(200).json({message: `Register User`})
});


// @desc log out user
// route POST /api/logout
// @access public
const logoutUser = asyncHandler(async (req, res) => {
    //Make cookie empty string, expires immediately
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0)
    })

    res.status(200).json({message: `User now loged out.`})
});


// @desc get profile
// route GET /api/users/profile
// @access private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email
    }
    res.status(200).json(user);
});

// @desc update profile
// route PUT /api/users/profile
// @access private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user){
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if(req.body.password){
            user.password = req.body.password;
        }
        const updatedUser = await user.save();
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
        })
    }
    else{
        res.status(404);
        throw new Error("User not found.");
    }
    res.status(200).json({message: `Update User Profile`})
});



export {
    authUser, 
    registerUser, 
    logoutUser, 
    getUserProfile, 
    updateUserProfile
};