const express = require('express')
const router = express.Router()
const axios = require('axios')
const debug = require('debug')('discord-bot:server')
const discord = require('../api/discord')
const deployCommands = require('../api/deploy-commands')
const processedNotifications = require('../api/process')

/* GET home page. */
router.get('/', (req, res) => {
    const message = JSON.stringify({ message: 'discord bot' })

    res.status(200).send(message).end()
})

router.get('/listen', async (req, res) => {
    const resp = await discord.listen(res)
    const body = JSON.parse(resp.body)

    debug('bot is listening')
    res.status(resp.statusCode).send(JSON.stringify(body)).end()
})

router.get('/register-commands', async (req, res) => {
    const resp = await deployCommands.registerCommands()
    const body = JSON.parse(resp.body)

    debug('bot has registered commands')
    res.status(resp.statusCode).send(JSON.stringify(body)).end()
})

router.get('/send-notifications', async (req, res) => {
    const resp = await processedNotifications.notifications()
    const body = JSON.parse(resp.body)

    debug('bot sent notifications')
    res.status(resp.statusCode).send(JSON.stringify(body)).end()
})

module.exports = router
