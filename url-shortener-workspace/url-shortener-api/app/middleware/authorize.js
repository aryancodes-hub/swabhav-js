const { ForbiddenError } = require("../lib/error.js");

const authorizeAdmin = (req, res, next)=>{
    if(!req.user || req.user.role !== "ADMIN"){
        return next(new ForbiddenError("Administrator permissions required."))
    }
    next();
};

const authorizeUser = (req, res, next)=>{
    if(!req.user || (req.user.role !== "ADMIN" && req.user.role !== "USER")){
        return next(new ForbiddenError("User permissions required."))
    }
    next();
};

module.exports = {
    authorizeAdmin,
    authorizeUser
};
