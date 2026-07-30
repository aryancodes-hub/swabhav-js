export const errorHandler = (error,req,res,next) => {
    console.log(error.cause?.code);
    const code = error.cause?.code;
    if(res.headerSent){
        return next(error);
    }
    if(code === "23505"){
        return res.status(409).json({
            success: false,
            message : "A record with the same unique value exists"
        })
    }
    if(code === "23502"){
        return res.status(400).json({
            success: false,
            message : "Not null value expected"
        })
    }
    if(code === "22P02"){
        return res.status(400).json({
            success: false,
            message : "Invalid value for database column"
        })
    }

    const statusCode = error.statusCode ?? 500;

    return res.status(statusCode).json({
        success:false,
        message: statusCode === 500 ? "internal server error" : error.message
    })

}