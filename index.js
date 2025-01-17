require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const PORT = process.env.PORT
const models = require('./db')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const router = require('./routes/index')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const path = require('path')


const app = express()
app.use(cors({origin: "https://client-pern-shop.onrender.com"}))
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))
app.use('/api', router)

app.use(errorHandler)

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => {console.log(`Server listening on port ${PORT}`)})
    } catch (e) {
        console.error(e)
    }
}

start()

