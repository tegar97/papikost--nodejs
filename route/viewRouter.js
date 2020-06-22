const express = require('express')
const router = express.Router()
const viewController = require('./../controller/viewController')


//landing page
router.get('/',viewController.getLanding)


module.exports = router