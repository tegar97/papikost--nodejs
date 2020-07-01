const AppError = require('./../utils/appError')
const handleCastErrorDb = err =>{
    const message  = `invalid ${err.path} : ${err.value}`
    return new AppError(message,400)
}
const handleDuplicateFieldDb = err =>{
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0]

    const message = `Duplciate field  ${value},please use another value`
    return new AppError(message,400)
}
const handleValidation = err => {
    const errors = Object.values(err.errors).map(el => el.message)
    const message = `invalid input data,${errors.join('. ')}`
    return new AppError(message,400)
}
const handleJsonTokenError = () =>{
    const errors = 'invalid web token'
    const message = 'please login'
    return new AppError(message,400)
}
const handleTokenExpired = () => new AppError('Token expired',401)

const sendErrorDev = (err,req,res) =>{
    //Untuk PAGE API SAJA
    if(req.originalUrl.startsWith('/api')) {
        res.status(err.statusCode).json({
            status : err.status,
            error: err,
            message : err.message,
            stack: err.stack
        })
    //UNTUK HALAMAN VIEW
    }else{
        res.status(err.statusCode).json({
            title  : 'ups something error hire',
            msg: err.message
           
        })

    }
}

const sendErrorProd = (err,req,res) => {
    //HALAMAN API
    if(req.originalUrl.startsWith('/api')) {
        if(err.isOperational) {
            return res.status(err.statusCode).json({
                status : err.status,
                message : err.message
            })
        }
        //jika kesalahan bukan dari program /error tak terduga / error dari third party,dll
        res.status(500).json({
            status: 'ERROR',
            message: 'SOMETHING WENT ERROR , SOORY WE WIL FIX LATER'
        })
    }
    //untuk halaman views / render
    if(err.isOperational) {
        res.statis(err.statusCode).render('error',{
            title : 'Something went error',
            message : err.message
        })
    }
    res.status (err.statusCode).render('error',{
        title: 'Ups something error hire',
        message : 'try again later'
    })

}


module.exports = (err,req,res,next) => {
    err.statusCode = err.statusCode || 500
    err.status= err.status || 'error'

    if(process.env.NODE_ENV === 'development') {
        sendErrorDev(err,req,res)
    }else if(process.env.NODE_ENV ==='production' ) {
        let error = {...err}
        error.message = err.message

        if(error.name === 'CastError') error = handleCastErrorDb(error)
        if(error.code === 11000) error = handleDuplicateFieldDb(error)
        if(error.name === "ValidationError") error = handleValidation(error)
        if(error.name === "JsonWebTokenError") error = handleJsonTokenError()
        if(error.name === "TokenExpiredError") error = handleTokenExpired()

       

        sendErrorProd(error,req,res)
    }
}