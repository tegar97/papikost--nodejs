const mongoose = require('mongoose')
const validator  = require('validator')


const userSchena  = new mongoose.Schema({
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
        enum: ['admin','kostOwner','user']
    },
    password : {
        type: String,
        required: [true,'please confirm your password'],
        minLenght: 8,
        select: false
    },
    passwordConfirm : {
        type: String,
        required : [true,'please confirm your password']
    },
    notelp:  {
        type: Number,
        required : [true,'please tell us your number'],
        minLenght : 10
        
    },
    passwordChangeAt : Date,
    passwordResetToken : String,
    passwordResetExpire : Date,
})

const User = mongoose.model('User',userSchena)

module.exports = User