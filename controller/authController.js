const jwt = require('jsonwebtoken')
const User = require('./../models/userModels')
const AppError = require('./../utils/appError')
const catchAsync = require('./../utils/catchAsync')
const crypto = require('crypto')
const Email = require('../utils/mail')
const {promisify} = require('util')



const signToken= id =>{
    return jwt.sign({id},process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

const createSendToken = (user,statusCode,res) => {
    const token = signToken(user._id)
    const cookieoption = {
        expires : new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly :true
    }

        // if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
        res.cookie('jwt',token,cookieoption)
        user.password = undefined

        res.status(statusCode).json({
            status: 'success',
            token,
            data : {
                user
            }
        })
}
exports.signup = catchAsync(async(req,res,next) => {
        //1 membuat huruf random debgab croyto
        const verifyToken = crypto.randomBytes(32).toString('hex')
        //2.Menecrypt huruf tadi dengan sha256 untuk disimpan ke database
        const emailVerifyToken  = crypto.createHash('sha256').update(verifyToken).digest('hex')
        //set masa aktif token 
        const emailVerifyExpires = Date.now() + 10 * 60 * 1000 //10 menit
        if(!req.body.name && !req.body.email && !req.body.password || !req.body.passwordConfirm || !req.body.notelp) {
            return next(new AppError('Please provide field',400))
        }

        const newUser = await User.create({
            name : req.body.name,
            email : req.body.email,
            password : req.body.password,
            passwordConfirm : req.body.passwordConfirm,
            notelp: req.body.notelp,
            emailVerifyToken : emailVerifyToken,
            emailVerifyExpires : emailVerifyExpires
        })
       
        const url  =`${req.protocol}://${req.get("host")}/users/verifyEmail/${verifyToken}`
        await new Email(newUser,url).sendWelcome()
        createSendToken(newUser,201,res)
        
    
})


exports.login = catchAsync(async(req,res,next) => {


        const {email,password} = req.body

        //jika email dan password tidak diisi maka akan mengirim pesan peringatan
        if(!email || !password) {
            return next(new AppError('please provide email or password',400))
        }
        //mencari satu data user yang email nya sama dengan email yang di isi di request.body
        const user = await User.findOne({email}).select('password')
        //jika salah maka akan mengirim alert salah email
        if(!user) {
            return next(new AppError('incorrect email',400))

        }
        //membadingakan apakah password yang di isi user sama dengan password yang didatabase yang telah di encrypt
        const correct = await user.correctPassword(password,user.password)
         //jika salah maka akan mengirim alert salah password
        if(!correct) {
            return next(new AppError('incorrect password',400))

        }
        //jika benar maka akan mengirim token
        createSendToken(user,201,res)
})

exports.protect = catchAsync(async(req,res,next) =>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }else if(req.cookies.jwt && req.cookies.jwt !== 'loggedOut') {
        token = req.cookies.jwt
    }
    if(!token) {
        return next(new AppError('invalid token',401))
    }
    const decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET)
    //CEK APAKAH USER MASIH ADA ATAU TIDAK
    const currentUser = await User.findById(decoded.id)
    if(!currentUser) {
        return next(new AppError('The user belonging to this token does no longer exist',401))
    }

    if(currentUser.changePasswordAfter(decoded.iat)) {
        return next(new AppError('user recently change password! ,please log in again',401 ))
    }
    req.user = currentUser
    res.locals.user = currentUser;
    next()
})
exports.restrictTo = (...role) => {
    return (req,res,next) =>{
        //jika role tidak sama dengan yang dimasukan di parameter maka muncul kan pesan Yo dont have permission
        if(!role.includes(req.user.role)) {
            new AppError('YO DONT HAVE PERMISSION',403)
            next()
        }
    }
}
exports.verifyEmail = catchAsync(async(req,res,next) => {
    const token = req.params.token
    console.log(token)
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex') 
    console.log(hashedToken)

    const user = await User.findOne({emailVerifyToken : hashedToken ,emailVerifyExpires :{$gt: Date.now()}})
    if(!user) {
        return next(new AppError('token tidak ditemukan '))
    }
    user.isVerif = true
    user.emailVerifToken = undefined;
    user.emailVerifExpire = undefined
    await user.save()

    if(process.env.NODE_ENV == 'development') {
        res.status(200).json({
            message : 'email verify'
        })
    }else if(process.env.NODE_ENV == 'production'){
        res.redirect('/')
    //     if(req.cookies.jwt && req.cookies.jwt !== 'loggedout') {
    //         return res.redirect('/me')
    //   }else if(!req.cookies.jwt && req.cookies.jwt == 'loggedout'){
    //         return res.redirect('/login')
    //   }
   
    }

  

})