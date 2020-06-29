const express = require('express')
const router =  express.Router()
const cityController = require('./../controller/cityController')
const authController = require('./../controller/authController')
router
    .route('/')
    .get(authController.protect,authController.allowFor('admin'), cityController.getAllCity)
    .post(authController.protect,authController.allowFor('admin'),cityController.uploadUserPhoto,cityController.resizePhoto,cityController.addCity)
router
    .route('/:id')
    .get(cityController.getCity)
    .patch(authController.protect,authController.allowFor('admin'),cityController.uploadUserPhoto,cityController.resizePhoto,cityController.updateCity)
    .delete(authController.protect,authController.allowFor('admin'),cityController.deleteCity)

module.exports  = router