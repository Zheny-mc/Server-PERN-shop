require('dotenv').config()
const express = require('express') || 5000
const sequelize = require('./db')
const models = require('./db')
const PORT = process.env.port
const cors = require('cors')
const fileUpload = require('express-fileupload')
const router = require('./routes/index')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const path = require('path')


const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))
app.use('/api', router)

app.use(errorHandler)

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => {console.log(`Server started http://localhost:${PORT}/`)})
    } catch (e) {
        console.error(e)
    }
}

start()

