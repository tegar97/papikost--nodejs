const express = require('express')
const router = express.Router()
const viewController = require('./../controller/viewController')


//landing page
router.get('/',viewController.getLanding)
router.get('/area',viewController.getArea)
router.get('/area-detail',viewController.getAreaDetail)
router.get('/signin',viewController.getLogin)
router.get('/kost/:slug',viewController.getkostDetail)



module.exports = router