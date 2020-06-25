const express = require('express')
const app = express()
const connectDb =  require('./config/server')
const path = require('path')
//utils
const globalErorrHandler = require('./controller/errorController')
const appError = require('./utils/appError')
//library
const mongoSanitize = require('express-mongo-sanitize')
const pug = require('pug')
const morgan = require('morgan')
const helmet = require('helmet')
const dotenv = require('dotenv');
const xss = require('xss-clean')
const limitAccess = require('express-rate-limit')






//LIMIT DATA 10KB
app.use(express.json({limit : '10kb'}))
//helmet membantun untuk mengamankan aplikasi express kamu dengan cara setting various HTPP HEADERS
app.use(helmet())
//Mengatasi nosql query injection
app.use(mongoSanitize())  
//mengatasi  data html javascript 
app.use(xss())
//melimit pengunaan api agar terhindar dari serang ddos 
const limiter = limitAccess({
    max : 1000, //limit 1000 akses 
    windowMs : 60  * 60 * 1000 ,// 1 jam
    message : 'To many Request from this ip,please try again in a hour'
})
app.use('/api',limiter)



//LOAD CONFIG
dotenv.config({path: './config/config.env'})

//function untuk konek ke database
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