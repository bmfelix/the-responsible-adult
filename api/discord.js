/* eslint-disable camelcase */
/* eslint-disable no-restricted-syntax */
/* eslint-disable global-require */
/**
 * Mapping API endpoints. These are mappings in the application. This is not
 * related to anything parent/mapping relationship programmatically.
 *
 * @author Brad Felix <bradfelix1@gmail.com>
 */

const fs = require('fs')
const { Client, Collection, Intents, MessageEmbed, WebhookClient } = require('discord.js')
const debug = require('debug')('discord-bot:server')
const config = require('../config.json')

const token = config.DISCORD_TOKEN

const responses = require('../modules/responseHelper')
const response = responses.success
const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'))
const client = new Client({ intents: [Intents.FLAGS.GUILDS] })

client.commands = new Collection()

for (const file of commandFiles) {
    const command = require(`../commands/${file}`)

    client.commands.set(command.data.name, command)
}

const start = async () => {
    await client.once('ready', () => {
        console.log('Ready!')
    })

    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isCommand() || !interaction) return

        const command = await client.commands.get(interaction.commandName)

        if (!command) return

        try {
            await command.execute(interaction)
        } catch (error) {
            console.error(error)
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
        }
    })

    client.on('disconnect', (event) => {
        if (event.code !== 1000) {
            console.log(`Discord client disconnected with reason: ${event.reason} (${event.code}).`)

            if (event.code === 4004) {
                if (token === 'your_token_here') {
                    console.log('It appears that you have not yet added a token. Please replace "your_token_here" with a valid token in the config file.')
                } else if (token.length < 50) {
                    console.log('It appears that you have entered a client secret or other invalid string. Please ensure that you have entered a bot token and try again.')
                } else {
                    console.log('Please double-check the configured token and try again.')
                }
                process.exit()
                return
            }

            console.log('Attempting to reconnect in 6s...')
            setTimeout(() => { client.login(token) }, 6000)
        }
    })

    const resp = await client.login(token)

    return resp
}

const listen = async () => {
    const resp = await start()

    if (resp) {
        response.statusCode = 200
        response.body = JSON.stringify({status: 'Ready'})
        return response
    }

    response.statusCode = 400
    response.body = JSON.stringify({status: 'Not Ready'})

    return response
}

const authorize = async (event, context, callback) => {
    const url = `https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&permissions=${process.env.PERMISSIONS_INT}&scope=bot%20applications.commands`

    response.statusCode = 302
    response.headers.location = url

    return callback(null, response)
}

const sendMessage = async (notification) => {
    const totalDue = notification.total_due
    const numOfPeople = notification.num_of_people_paying

    const perPerson = parseFloat(totalDue / numOfPeople)
    const couple = perPerson * 2

    const embed = new MessageEmbed()
        .setDescription(`The ${notification.payment_type} bill is due soon! Please deposit money into the shared account. @everyone`)
        .addFields(
            { name: 'Per Person', value: `${perPerson.toFixed(2)}` },
            { name: 'Per Couple', value: `${couple.toFixed(2)}` },
            { name: '# Of Payers', value: `${numOfPeople}` },
            { name: 'Total Due', value: `${totalDue}` },
            { name: 'Due Date', value: `${notification.due_date}` },
        )

    const webhookClient = new WebhookClient({ id: config.WEBHOOK_CLIENT_ID, token: config.WEBHOOK_TOKEN })

    webhookClient.send({
        username: 'Adult.exe',
        content: `**Bill Due Soon: ${notification.payment_type.toUpperCase()}.**`,
        embeds: [embed],
    })
}

module.exports = {
    listen,
    authorize,
    sendMessage
}
