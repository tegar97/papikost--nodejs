const mongoose = require('mongoose')

const connectDb = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            usindAndModify: true
        })
        console.log(`MONGO DB CONNECT: ${conn.connection.host} `)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

module.exports = connectDb