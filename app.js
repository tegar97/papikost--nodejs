const express = require('express')
const app = express()
const dotenv = require('dotenv');
const morgan = require('morgan')
const pug = require('pug')
const connectDb =  require('./config/server')
const path = require('path')


//LOAD CONFIG
dotenv.config({path: './config/config.env'})


connectDb()



//PUG /setting template engine
app.set('view engine','pug')
app.set('views',path.join(__dirname, 'views'))


//static file
app.use(express.static(path.join(__dirname,'public')))




//LOGGING 
if(process.env.NODE_ENV =='development') {
    app.use(morgan('dev'))
}


const PORT = process.env.PORT || 5000


//Routes
app.use('/',require('./route/viewRouter'))


app.listen(PORT,console.log(`SERVER RUNNING IN ${process.env.NODE_ENV} made on port ${PORT}`))