const axios = require('axios');
const User = require('../models/User');

// Get all Users from MongoDB
exports.getAllUsers = async (req, res) => {
    try{
        const data = await User.find({});
        console.log(data);

        res.status(200).json({
            success: true,
            message: "Successfully fetched users data",
            data: data
        });
    }
    catch(error){
        console.log("Couldn't fetched users data");
        res.status(400).json({
            success: false,
            message: "Couldn't fetched users data"
        });
    }
}

// Update User's role in MongoDB
exports.updateUserRole = async (req, res) => {
    try{
        const userId = req.params.id;
        const userRole = req.body.role;

        console.log(userId);
        console.log(userRole);


        const data = await User.findByIdAndUpdate(userId, {role: userRole}, {new: true});
        console.log(data);

        res.status(200).json({
            success: true,
            message: "Successfully updated user's role",
            data: data
        });
    }
    catch(error){
        console.log("Couldn't updated user's role");
        res.status(400).json({
            success: false,
            message: "Couldn't updated user's role"
        });
    }
}