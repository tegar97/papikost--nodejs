const express =require('express')
const router = express.Router()
const kostController = require('./../controller/kostController')
const authController = require('./../controller/authController')
router
    .route('/')
    .get(kostController.getAllkost)
    .post(authController.protect,authController.allowFor('admin'),kostController.uploadKostImage,kostController.resizeTourImage,kostController.addKost)

router
    .route('/:id')
    .get(kostController.getKost)
    .patch(authController.protect,authController.allowFor('admin'),kostController.uploadKostImage,kostController.resizeTourImage,kostController.updateKost)
    .delete(authController.protect,authController.allowFor('admin'),kostController.deleteKost)
module.exports = router