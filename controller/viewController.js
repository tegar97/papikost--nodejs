const City = require('./../models/cityModels')
const Kost = require('../models/kostModels')

exports.getLanding = async(req,res) => {
    const cityData = await City.find()
    res.status(200).render('index',{
        title : 'TEMPAT PENCARIAN KOST',
        cityData
    })
}

exports.getArea = async(req,res) => {
    const cityData = await City.find()
    
    res.status(200).render('area',{
        title : 'AREA TERSEDIA',
        cityData
        
     
    })
}

exports.getAreaDetail = async(req,res) => {
    const cityData = await City.findOne({slug : req.params.slug}).populate({path: 'Kost',select : '-__v'})
    
    res.status(200).render('areaDetail',{
        title : 'DETAIL AREA',
        cityData
     
    })
}

exports.getkostDetail = async(req,res) => {
    const kostData = await Kost.findOne({slug : req.params.slug}).populate({path : 'facilities',select: '-__v'})
    const kostDataDetail = kostData.facilities
    for(let i = 0; i < kostDataDetail.length; i++) {
        console.log(kostDataDetail[i].iconName)
    }
    
    res.status(200).render('kostDetail',{
        title : 'KOST PAK UDIN',
        kostData
     
    })
}

exports.getLogin = async(req,res) => {
    res.status(200).render('login',{
        title : 'SIGNIN',
     
    })
}