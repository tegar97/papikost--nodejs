const express = require('express')
const app = express()
const dotenv = require('dotenv');
const morgan = require('morgan')
const pug = require('pug')
const connectDb =  require('./config/server')
const path = require('path')
const globalErorrHandler = require('./controller/errorController')
const appError = require('./utils/appError')
const compression = require('compression')
const helmet = require('helmet')




app.use(express.json({limit : '10kb'}))

app.use(helmet())

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
app.use('/api/v1/users',require('./route/userRouter'))
app.use('/api/v1/city',require('./route/cityRouter'))

app.all('*',(req,res,next) => {
    next(new appError(`Can't find ${req.originalUrl} on this Server`,404))
})


app.use(globalErorrHandler)

app.listen(PORT,console.log(`SERVER RUNNING IN ${process.env.NODE_ENV} made on port ${PORT}`))