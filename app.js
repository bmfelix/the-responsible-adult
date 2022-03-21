const express = require('express')

const app = express()
const errorhandler = require('errorhandler')
const path = require('path')
const router = require('./routes/index')
const config = require('./config.json')

app.use(express.json({type: 'application/json'}))
app.use(express.static(path.join(__dirname, 'public')))
// Express in Development Mode
if (config.ENV === 'development') {
    app.use(errorhandler())
}

app.use('/', router)

module.exports = app
