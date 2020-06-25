const catchAsync = require('./../utils/catchAsync')
const City = require('./../models/cityModels')
const appError = require('./../utils/appError')
exports.getCity = catchAsync(async(req,res) => {
    const cityData =  await City.find()


    res.status(200).json({
        message : 'Success',
        total : cityData.length + ' city found',
        data : cityData
    })

})

exports.addCity = catchAsync(async(req,res,next)  =>{
    const cityData = await City.create({
        cityName : req.body.cityName,
        cityProvince : req.body.cityProvince,
        image : 'bandung.jpg'

    })
 
    res.status(201).json({
        message : 'Success',
        data :  cityData
        
    })

})

exports.updateCity  = catchAsync(async(req,res,next) => {
    const cityData = await City.findByIdAndUpdate(req.params.id,req.body,{
        new : true,
        runValidators : true
    })
    res.status(201).json({
        message : 'Success',
        data : {
            cityData
        }
    })


})


exports.deleteCity= catchAsync(async(req,res) =>{
    const cityData = await City.findByIdAndDelete(req.params.id) 

    res.status(204).json({
        message: `success delete`,
   


    })

    
})
