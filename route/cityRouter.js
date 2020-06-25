const express = require('express')
const router =  express.Router()
const cityController = require('./../controller/cityController')

router
    .route('/')
    .get(cityController.getCity)
    .post(cityController.addCity)
router
    .route('/:id')
    .put(cityController.updateCity)
    .delete(cityController.deleteCity)

module.exports  = router