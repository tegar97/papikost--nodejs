const mongoose = require('mongoose')
const { default: validator } = require('validator')
const slugify = require('slugify')
const {ObjectId} = mongoose.Schema

const kostSchema = new mongoose.Schema({
    name : {
        type: String,
        required : [true,'kost must have name'],
        unique : true,
        trim : true,
        validate : validator.isAlpha
    },
    slug: String,
    roomAvailable : Number,
    price:  {
        type : Number,
        required : [true,'kost must have price']

    },
    deskripsi : {
        type: String,
        require : [true,'kost must have deskripsi']
    },
    location :{
        type : {
            type : String,
            default : 'Point',
            enum : ['Point']

        },
        coordinates : [Number],
        address : String,
        description : String,
        
    },
    imageCover :  {
        type  : String,
        required : true
    },
    images  : [String],
    roomSize : String, 
    facilities : {
        type : ObjectId,
        ref : 'Facilities'

    },
    reviews : {
        type: ObjectId,
        ref : 'Reviews'
    }




})