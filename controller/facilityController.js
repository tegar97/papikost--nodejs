const Facility = require('../models/facilityModels')
const catchAsync = require('./../utils/catchAsync')
exports.getAllFacility =  catchAsync(async(req,res) =>{
    const facilityData = await Facility.find()

    res.status(200).json({
        message : 'success',
        total : facilityData.length + 'facility',
        data : facilityData
    })
})
exports.getFacility = catchAsync(async(req,res) =>{
    const facilityData = await Facility.findOne({_id : req.params.id})
    res.status(200).json({
        message : 'success',
        data : facilityData
    })
})

exports.addFacility = catchAsync(async(req,res) =>{
    const facilityData = await Facility.create({
        iconName  : req.body.iconName,
        iconCode : req.body.iconCode
    })
    res.status(201).json({
        message : 'success',
        data : facilityData
    })
})

exports.updateFacility = catchAsync(async(req,res) =>{
    const facilityData = await Facility.findByIdAndUpdate(req.params.id,req.body,{
        new : true,
        runValidators : true
    })
    res.status(201).json({
        message : 'success',
        data : facilityData
    })
})

exports.deleteFacility = catchAsync(async(req,res) => {
    const facilityData = await Facility.findByIdAndDelete({_id : req.params.id})
    res.status(204).json({
        message :'success'
    })
})
