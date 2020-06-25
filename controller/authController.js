const jwt = require('jsonwebtoken')
const User = require('./../models/userModels')
const AppError = require('./../utils/appError')
const catchAsync = require('./../utils/catchAsync')
const crypto = require('crypto')
const Email = require('../utils/mail')



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
exports.signup = catchAsync(async(req,res) => {
        const newUser = await User.create({
            name : req.body.name,
            email : req.body.email,
            password : req.body.password,
            passwordConfirm : req.body.passwordConfirm,
            notelp: req.body.notelp
    
        })
        const url = `${req.protocol}`
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
exports.forgotPassword = catchAsync(async(req,res,next) =>{
    const user = await User.findOne({email : req.body.email})
    if(!user) {
        return next(new AppError('THERE IS NO USER WITH THAT EMAIL ADRESS',400))
    }
    




})