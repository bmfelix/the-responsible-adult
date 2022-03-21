/* eslint-disable global-require */
/* eslint-disable no-restricted-syntax */
const fs = require('fs')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const config = require('../config.json')

const responses = require('../modules/responseHelper')
const response = responses.success
const commandsTable = require('../database/commands')

const rest = new REST({ version: '9' }).setToken(config.DISCORD_TOKEN)

const commands = []
const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'))

for (const file of commandFiles) {
    const command = require(`../commands/${file}`)

    commands.push(command.data.toJSON())
}

const upsertCommandRecord = (data) => {
    data.forEach(async (command) => {
        commandsTable.upsertRecord(command.id, command)
    })
}

const registerCommands = async () => {
    rest.put(Routes.applicationGuildCommands(config.CLIENT_ID, config.DEV_GUILD), { body: commands })
        .then((resp) => {
            upsertCommandRecord(resp)
        })
        .catch((error) => {
            console.log(error)
        })

    response.status = 200
    response.body = JSON.stringify({message: 'Successfully registered application commands.'})

    return response
}

module.exports = {
    registerCommands
}
