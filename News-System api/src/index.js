const express = require('express')
const app = express()
const reporterRouter = require('./routers/reporters')
const newsRouter = require('./routers/news')
const news= require('./models/news')
const reporters = require('./models/reporters')
require('./db/mongos')

app.use(express.json())
app.use(reporterRouter)
app.use(newsRouter)


const port = 3000

app.listen(port,()=>{
    console.log('Server is running')
})
