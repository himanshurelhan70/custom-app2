const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();


//signup - creates an entry in DB
exports.signup = async (req, res) => {
    try {
        //get data
        const { name, email, password, state } = req.body;
        console.log(name, email, password, state);
        //check if user already exist
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already Exists',
            });
        }

        //secure password
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                message: 'Error in hashing Password',
            });
        }

        //create entry for User
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            state: state
        })

        return res.status(200).json({
            success: true,
            message: 'User Created Successfully',
        });

    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'User cannot be registered, please try again later',
        });
    }
}

//login the user
exports.login = async (req, res) => {

    try {

        //data fetch
        const { email, password } = req.body;
        console.log(email, password);
        //validation on email and password
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'PLease fill all the details carefully',
            });
        }

        //check for registered user
        let user = await User.findOne({ email });
        //if not a registered user
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User is not registered',
            });
        }

        //verify password & generate a JWT token
        if (await bcrypt.compare(password, user.password)) {
            //password matched

            const payload = {
                email: user.email,
                id: user._id,
                role: user.role,
                state: user.state
            };

            let token = jwt.sign(payload,
                process.env.JWT_SECRET,
                {
                    expiresIn: "2h",
                });


            user = user.toObject();
            user.token = token;
            user.password = undefined;


            const options = {
                expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                // httpOnly: true, // accessible only by web server
                secure: true, // https
                sameSite: 'None', // cross site cookie
            }

    
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: 'User Logged in successfully',
            });

        }
        else {
            //passwsord do not match
            return res.status(403).json({
                success: false,
                message: "Password Incorrect",
            });
        }

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Login Failure',
        });

    }
}


//logout the user
exports.logout = async (req, res) => {
    try {
        console.log("logging out");
        res.clearCookie('token'); 
        res.status(200).json({ 
            success: true,
            message: 'Logout successful' 
        });
        
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Logout Failure',
        });

    }
}