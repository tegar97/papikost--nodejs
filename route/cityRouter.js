const express = require('express')
const router =  express.Router()
const cityController = require('./../controller/cityController')
const authController = require('./../controller/authController')
router
    .route('/')
    .get(authController.protect,cityController.getAllCity)
    .post(cityController.uploadUserPhoto,cityController.resizePhoto,cityController.addCity)
router
    .route('/:id')
    .get(cityController.getCity)
    .patch(cityController.uploadUserPhoto,cityController.resizePhoto,cityController.updateCity)
    .delete(cityController.deleteCity)

module.exports  = router