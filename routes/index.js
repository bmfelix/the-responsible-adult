const express = require('express')
const router = express.Router()
const axios = require('axios')

/* GET home page. */
router.get('/', (req, res) => {
    res.status(200).send('Hello, world!').end()
})

module.exports = router
