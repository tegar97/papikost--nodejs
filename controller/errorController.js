const AppError = require('./../utils/appError')

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
       

        sendErrorProd(error,req,res)
    }
}