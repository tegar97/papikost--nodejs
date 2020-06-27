const Kost = require('./../models/kostModels')
const catchAsync = require('../utils/catchAsync')
const multer = require('multer')
const sharp = require('sharp');
const AppError = require('../utils/appError');
const crpyto = require('crypto');
const { promises } = require('fs');
const fs = require('fs-extra')
const path = require('path')

const multerStorage = multer.memoryStorage();


const multerFilter = (req,file,cb) => {
    if(file.mimetype.startsWith('image')) {
        cb(null,true)
    }else{
        cb(new AppError('Not image ! ,please upload image only',400),false)

    }
}

const upload = multer({
    storage : multerStorage,
    fileFilter : multerFilter
})

exports.uploadKostImage = upload.fields([
    {name : 'imageCover',maxCount  : 1},
    {name : 'images',maxCount: 3}
])


exports.resizeTourImage = catchAsync(async(req,res,next) => {
     if(!req.files.imageCover || !req.files.images ) return next()

    //1)Cover image
    req.body.imageCover = `kost-imgCover-${Date.now()}-${crpyto.randomBytes(12).toString('hex')}.jpeg`
    await sharp(req.files.imageCover[0].buffer)
          .resize(500,500)
          .toFormat('jpeg')
          .jpeg({quality: 90})
          .toFile(`public/img/kost/imageCover/${req.body.imageCover}`)

    //2)multiple images
    req.body.images = [];
    await Promise.all(
        req.files.images.map(async(file,i) =>{
            const fileName = `kost-${Date.now()}-${crpyto.randomBytes(12).toString('hex')}.jpeg`

            await sharp(file.buffer)
                 .resize(500,500)
                 .toFormat('jpeg')
                 .jpeg({quality: 90})
                 .toFile(`public/img/kost/images/${fileName}`)

            req.body.images.push(fileName)
        })
    )
    next()

})
exports.getAllkost = catchAsync(async(req,res) => {
    const kostData = await Kost.find()

    res.status(200).json({
        message : 'succes',
        totalKost : kostData.length,
        data : kostData
    })
})


exports.getKost = catchAsync(async(req,res) => {
    const kostData = await Kost.findOne({_id : req.params.id})

    res.status(200).json({
        message : 'Success',
        data : kostData
    })
   
})

exports.addKost = catchAsync(async(req,res) => {
    const kostData = await Kost.create({
        name : req.body.name,
        roomAvailable : req.body.roomAvailable,
        price  : req.body.price,
        deskripsi : req.body.deskripsi,
      
        location  :{
            coordinates : req.body.coordinates,
            address : req.body.address
        },
        imageCover : req.body.imageCover,
        images : req.body.images,
        roomsize : '3x4',
        roomGender : req.body.roomGender
    })
    console.log(req.body.imageCover)
    res.status(200).json({
        message : 'Success',
        data : kostData
    })
})

exports.updateKost = catchAsync(async(req,res) =>{
    if(!req.files.imageCover || !req.files.images) {
        const kostData = await Kost.findByIdAndUpdate(req.params.id,req.body,{
            new : true,
            runValidators : true
        })
       
        res.status(201).json({
            message : 'Success',
            data : {
                kostData
            }
        })
    }else{
        const kostData = await Kost.findById({_id : req.params.id})
         fs.unlink(path.join(`public/img/kost/imageCover/${kostData.imageCover}`))
         
        for(let i = 0 ; i < kostData.images[i].length; i++) {
            fs.unlink(path.join(`public/img/kost/images/${kostData.images[i]}`))
            await kostData.update({
                name : req.body.name,
                roomAvailable : req.body.roomAvailable,
                price  : req.body.price,
                deskripsi : req.body.deskripsi,
            
                location  :{
                    coordinates : req.body.coordinates,
                    address : req.body.address
                },
                imageCover : req.body.imageCover,
                images : req.body.images,
                roomsize : '3x4',
                roomGender : req.body.roomGender
            })
    
            res.status(201).json({
                message : 'Success',
                data : {
                    kostData
                }
            })
        }
       
    }


    

})
exports.deleteKost = catchAsync(async(req,res) => {
    const {id} = req.params
    const kostData = await Kost.findOne({_id : id})
    fs.unlink(path.join(`public/img/kost/imageCover/${kostData.imageCover}`))
    for(let i = 0 ; i < kostData.images[i].length; i++) {
         fs.unlink(path.join(`public/img/kost/images/${kostData.images[i]}`))
         await kostData.remove()
         res.status(204).json({
            message: 'success'
        })
        
        
     
    }
  
    
   

  
})