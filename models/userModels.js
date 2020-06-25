const mongoose = require('mongoose')
const validator  = require('validator')
const bcrypt = require('bcryptjs')
const userSchema  = new mongoose.Schema({
    name : {
        type: String,
        required : true
    },
    email : {
        type: String,
        required: [true,'please provide your email'],
        unique: true,
        lowercase:true,
        validate: [validator.isEmail]
    },
    photo : {
        type: String,
        default : 'default.png'
    },
    role : {
        type: String,
        enum: ['admin','kostOwner','user'],
        default : 'user'
    },
    password : {
        type: String,
        required: [true,'please confirm your password'],
        minLenght: 8,
        select: false
    },
    passwordConfirm : {
        type: String,
        required : [true,'please confirm your password'],
        validate : {
            validator : function(el) {
                return el === this.password
            },
            message: "password are not the same"
        },
        select: false
    },
    notelp:  {
        type: Number,
        required : [true,'please tell us your number'],
        minLenght : 10
        
    },
    passwordChangeAt : Date,
    passwordResetToken : String,
    passwordResetExpire : Date,
    passwordChangeAt : Date,
    passwordResetToken : String,
    passwordResetExpire : Date,
    isActive : {
        type : Boolean,
        default : true,
        select : false
    },
    isVerif : {
        type: Boolean,
        default :false
    },
    emailVerifyToken : String,
    emailVerifyExpires : Date
})


userSchema.pre('save',async function(next) {
    if(!this.isModified('password')) next();

    this.password = await bcrypt.hash(this.password,12)
    this.passwordConfirm = undefined

    next()
})
userSchema.methods.correctPassword = async function(cadidatePassword,userPassword) {
    return await bcrypt.compare(cadidatePassword,userPassword)
    console.log(cadidatePassword,userPassword)
}
const User = mongoose.model('User',userSchema)

module.exports = User