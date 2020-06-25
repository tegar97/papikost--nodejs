const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema
const slugify = require('slugify')


const citySchema = new mongoose.Schema({
    cityName  : {
        type : String,
        require: true,
    },
    cityProvince : {
        type : String,
        required : true
    },
    kostId : {
        type : ObjectId,
        ref : 'Kost'
    },
    image : {
        type: String,
        required: true
    },
    slug : String
})
citySchema.pre('save',function(next) {
    this.slug = slugify(this.cityName,{lower: true})
    next()
})
const City = mongoose.model('City',citySchema)

module.exports = City