const jwt = require("jsonwebtoken");
const {UnauthorizedError, ForbiddenError} = require("../lib/error.js");
const { User } = require("@url/url-shortener-data-model");

module.exports =async (req,res,next)=>{
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer")){
            throw new UnauthorizedError("Authentication token is missing.")
        }

        const token = authHeader.split(" ")[1];
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            throw new UnauthorizedError("Invalid or expired authentication token.")
        }

        const user = await User.findByPk(decoded.userId);
        if (!user) {
            throw new UnauthorizedError("User account no longer exists.")
        }
        if(user.status === "BLOCKED"){
            throw new ForbiddenError("Your account has been blocked by administrator.")
        }

        req.user = {
            id: user.id,
            userId: user.id,
            email: user.email,
            role: user.role,
            status: user.status
        };

        next()
    } catch (error) {
        next(error)
    }
};