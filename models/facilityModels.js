const  mongoose  = require('mongoose')


const facilitySchema =  new mongoose.Schema({
    iconName : {
        type: String,
        require: true
    },
    iconCode : {
        type: String,
        require: true
    }
})
const facility = mongoose.model('Facility',facilitySchema)

module.exports = facility