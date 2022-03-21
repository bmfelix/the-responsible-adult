const express = require('express')

const app = express()
const errorhandler = require('errorhandler')
const path = require('path')

const config = require('./config.json')
const router = require('./routes/index')
const PORT = config.PORT || 8081

app.set('port', PORT)
app.use(express.json({type: 'application/json'}))
app.use(express.static(path.join(__dirname, 'public')))
// Express in Development Mode
if (config.ENV === 'development') {
    app.use(errorhandler())
}

app.use('/', router)
app.use('/listen', router)
app.use('/authorize', router)
app.use('/send-message', router)
app.use('/register-commands', router)
app.use('/send-notification', router)

console.log(`Loaded app.js. Listening on Port: ${PORT}`)
console.log('Control + C to exit')

module.exports = app
