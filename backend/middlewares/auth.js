// auth, isStudent,isAdmin, isVisitor

const jwt = require("jsonwebtoken");
require("dotenv").config();

// authentication
exports.auth = (req, res, next) => {
    try {
        //extract JWT token
        console.log("cookie", req.cookies.token);
        console.log("body", req.body.token);
        console.log("header", req.header("Authorization"));

        const token = req.cookies.token || req.body.token || req.header("Authorization")?.replace("Bearer ", "");

        if (!token || token === undefined) {
            return res.status(401).json({
                success: false,
                message: 'Token Missing',
            });
        }

        //verify the token
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            console.log('payload', payload);
            req.user = payload;
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'token is invalid',
            });
        }
        next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Something went wrong, while verifying the token',
            error: error.message,
        });
    }

}

// authorization of manager role
exports.isManager = (req, res, next) => {
    try {
        if (req.user.role !== "Manager") {
            return res.status(401).json({
                success: false,
                message: 'THis is a protected route for Managers only',
            });
        }
        next();
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'User Role is not matching',
        })
       
    }
}

// authorization of admin role
exports.isAdmin = (req, res, next) => {
    try {
        if (req.user.role !== "Admin") {
            return res.status(401).json({
                success: false,
                message: 'THis is a protected route only for admin',
            });
        }
        next();
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'User Role is not matching',
        })
    }
}


// authorization of visitor role
exports.isVisitor = (req, res, next) => {
    try {
        if (req.user.role !== "Visitor") {
            return res.status(401).json({
                success: false,
                message: 'THis is a protected route only for admin',
            });
        }
        next();
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'User Role is not matching',
        })
    }
}