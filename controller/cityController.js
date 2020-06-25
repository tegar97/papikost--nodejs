const catchAsync = require('./../utils/catchAsync')
const City = require('./../models/cityModels')
const appError = require('./../utils/appError')
const multer = require('multer')
const sharp = require('sharp')
const path = require('path')
const AppError = require('./../utils/appError')
const fs = require('fs-extra')
const crypto = require('crypto')
const multerStorage = multer.memoryStorage()

const multerFilter = (req,file,cb)  =>{
    if(file.mimetype.startsWith('image')) {
        cb(null,true)
    }else{
        cb(new AppError('Not Image ! please upload only images',400),false)
    }
}

const upload = multer({
    storage  : multerStorage,
    fileFilter : multerFilter
})

exports.uploadUserPhoto = upload.single('image')

exports.resizePhoto = catchAsync(async(req,res,next) => {
    if(!req.file) return next();
    req.file.filename = `city-${Date.now()}-${crypto.randomBytes(12).toString('hex')}.jpeg`;
    console.log(req.file.filename)
    console.log(req.file.buffer)

    await sharp(req.file.buffer).resize(300,300).toFormat('jpeg').jpeg({quality : 90}).toFile(`public/img/city/${req.file.filename}`)
    next()
})

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
        image : req.file.filename

    })
 
    res.status(201).json({
        message : 'Success',
        data :  cityData
        
    })

})

exports.updateCity  = catchAsync(async(req,res,next) => {
    if(!req.file) {
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
    }else{
        const cityData = await City.findById({_id : req.params.id})
        await fs.unlink(path.join(`public/img/city/${cityData.image}`))
        await cityData.update({
            cityName : req.body.cityName || cityData.cityName,
            cityProvince : req.body.cityProvince || cityData.cityProvince,
            image : req.file.filename
        })

        res.status(201).json({
            message : 'Success',
            data : {
                cityData
            }
        })
    }
 
    
 


})


exports.deleteCity= catchAsync(async(req,res) =>{
    const cityData = await City.findOne({_id : req.params.id }) 
    await fs.unlink(path.join(`public/img/city/${cityData.image}`))
    await cityData.remove()

    res.status(204).json({
        message: `success delete`,
    })

    
})
