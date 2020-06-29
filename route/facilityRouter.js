const express = require('express')
const router = express.Router()
const facilityController = require('../controller/facilityController')
const authController =require('./../controller/authController')
router
    .route('/')
    .get(facilityController.getAllFacility)
    .post(authController.protect,authController.allowFor('admin'),facilityController.addFacility)

router
    .route('/:id')
    .get(facilityController.getFacility)
    .patch(authController.protect,authController.allowFor('admin'),facilityController.updateFacility)
    .delete(authController.protect,authController.allowFor('admin'),facilityController.deleteFacility)
module.exports = router