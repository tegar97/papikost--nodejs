const express =require('express')
const router = express.Router()
const kostController = require('./../controller/kostController')

router
    .route('/')
    .get(kostController.getAllkost)
    .post(kostController.uploadKostImage,kostController.resizeTourImage,kostController.addKost)

router
    .route('/:id')
    .get(kostController.getKost)
    .patch(kostController.uploadKostImage,kostController.resizeTourImage,kostController.updateKost)
    .delete(kostController.deleteKost)
module.exports = router