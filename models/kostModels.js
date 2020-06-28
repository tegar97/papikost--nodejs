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
        address : String
        
    },
    imageCover :  {
        type  : String
    },
    images  : [String],
    roomSize : String, 
    roomGender : {
        type: String,
        enum : ['pria','perempuan','campur'],
        default : 'campur'

    },
    facilities : [{
        type : ObjectId,
        ref : 'Facility'

    }],
    reviews : {
        type: ObjectId,
        ref : 'Reviews'
    }
})
kostSchema.pre('save',function(next){
    this.slug  = slugify(this.name,{lower : true})
    next()
})
const Kost = mongoose.model('Kost',kostSchema)

module.exports = Kost