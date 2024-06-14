const express = require('express')
const errorHandler = require('./middleware/errorHandler')
const colors = require('colors')
const createAdmin = require('./utils/createAdmin')
const createMinimum = require('./utils/create.minimum')
const cors = require('cors')
const db = require('./models/index')

const dotenv = require('dotenv')
dotenv.config()


const app = express()

app.use(express.json())
app.use(express.urlencoded({extended : false}))
app.use(cors())


const PORT = process.env.PORT || 3000

app.use('/auth', require('./router/auth.router'))
app.use("/rank", require("./router/rank.router"))
app.use('/location', require('./router/location.router'))
app.use('/position', require('./router/position.router'))
app.use('/minimum', require('./router/minimum.router'))
app.use('/folder', require('./router/folder.router'))
app.use('/file', require("./router/file.router"))
app.use('/coctav', require('./router/coctav.router'))
app.use('/tip', require('./router/tip.router'))


app.use(errorHandler)

const start = async () => {
    try {
        await db.sequelize.sync() 
        
        await createMinimum()
        await createAdmin()
    app.listen(PORT, () => {
        console.log(`Server run on port : ${PORT}`.blue)
    })
    
    } catch (error) {
        console.log("bazaga ulanishda xatolik: ", error)
    }
}

start()


