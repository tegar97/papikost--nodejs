const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema

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
    image : String
})

const City = mongoose.model('City',citySchema)

module.exports = City