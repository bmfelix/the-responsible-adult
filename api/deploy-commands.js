/* eslint-disable global-require */
/* eslint-disable no-restricted-syntax */
const fs = require('fs')
const moment = require('moment')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const { CLIENT_ID, GUILD_ID, DISCORD_KEY } = process.env

const responses = require('./responseHelper')
const response = responses.success
const commandsTable = require('../database/commands')

const rest = new REST({ version: '9' }).setToken(DISCORD_KEY)

const commands = []
const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'))

for (const file of commandFiles) {
    const command = require(`../commands/${file}`)

    commands.push(command.data.toJSON())
}

const doesRecordExist = async (id) => {
    const filter = {id: {contains: `${id}`}}
    const records = await commandsTable.scan(filter).exec()

    if (records.length <= 0) {
        return false
    }

    return records
}

const upsertCommandRecord = (data) => {
    data.forEach(async (command) => {
        const doesrecordExist = doesRecordExist(command.id)

        if (!doesrecordExist) {
            const object = {
                id: command.id,
                command_name: command.name,
                description: command.description,
                created_at: moment().toISOString(),
                updated_at: moment().toISOString()
            }

            commandsTable.create(object)

            return
        }

        const object = {
            command_name: command.name,
            description: command.description,
            updated_at: moment().toISOString()
        }

        commandsTable.update({id: command.id}, object)
    })
}

const registerCommands = async (event, context, callback) => {
    rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands })
        .then((resp) => {
            upsertCommandRecord(resp)
        })
        .catch((error) => {
            console.log(error)
        })

    response.status = 200
    response.body = JSON.stringify({message: 'Successfully registered application commands.'})

    return callback(null, response)
}

module.exports = {
    registerCommands
}
