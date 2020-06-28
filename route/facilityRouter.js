const express = require('express')
const router = express.Router()
const facilityController = require('../controller/facilityController')

router
    .route('/')
    .get(facilityController.getAllFacility)
    .post(facilityController.addFacility)

router
    .route('/:id')
    .get(facilityController.getFacility)
    .patch(facilityController.updateFacility)
    .delete(facilityController.deleteFacility)
module.exports = router