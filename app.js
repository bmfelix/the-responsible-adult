const express = require('express')

const app = express()
const errorhandler = require('errorhandler')
const path = require('path')

const config = require('./config.json')
const router = require('./routes/index')

app.set('port', config.PORT || 8081)
app.use(express.json({type: 'application/json'}))
app.use(express.static(path.join(__dirname, 'public')))
// Express in Development Mode
if (config.ENV === 'development') {
    app.use(errorhandler())
}

app.use('/', router)
console.log('Loaded app.js')

module.exports = app
