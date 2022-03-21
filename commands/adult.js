/* eslint-disable no-restricted-syntax */
const { SlashCommandBuilder } = require('@discordjs/builders')
const uuid = require('uuid').v1
const moment = require('moment')

const paymentsTable = require('../database/payments')

const data = new SlashCommandBuilder()
    .setName('adult')
    .setDescription('Replies with messages from creating events')
    .addStringOption((option) => option
        .setName('payment_type')
        .setDescription('Type of payment we creating a notification for. (i.e. house, att, spectrum, etc)')
        .setRequired(true)
    )
    .addNumberOption((option) => option
        .setName('total_due')
        .setDescription('Type of payment we creating a notification for. (i.e. house, att, spectrum, etc)')
        .setRequired(true)
        .setMinValue(0)
    )
    .addStringOption((option) => option
        .setName('due_date')
        .setDescription('What day is payment due?')
        .setRequired(true)
    )
    .addIntegerOption((option) => option
        .setName('num_of_people_paying')
        .setDescription('How many people are paying on this bill?')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(10)
    )
    .addStringOption((option) => option
        .setName('how_often')
        .setDescription('Should we send this daily, monthly or yearly')
        .setRequired(true)
    )
    .addIntegerOption((option) => option
        .setName('notification_time')
        .setDescription('What time should we send the notification? (in 24 hr time)')
        .setRequired(true)
        .setMinValue(0)
        .setMaxValue(24)
    )
    .addIntegerOption((option) => option
        .setName('notification_date')
        .setDescription('What day of the month should we send the notification?')
        .setRequired(true)
        .setMinValue(0)
        .setMaxValue(31)
    )

const execute = async (interaction) => {
    if (!interaction.isCommand() || !interaction) return

    const paymentType = interaction.options.get('payment_type')
    const totalDue = interaction.options.get('total_due')
    const dueDate = interaction.options.get('due_date')
    const numOfPeople = interaction.options.get('num_of_people_paying')
    const howOften = interaction.options.get('how_often')
    const notificationTime = interaction.options.get('notification_time')
    const notificationDate = interaction.options.get('notification_date')

    const dataObject = {
        payment_type: paymentType.value,
        total_due: totalDue.value,
        due_date: dueDate.value,
        num_of_people_paying: numOfPeople.value,
        how_often: howOften.value,
        notification_time: notificationTime.value,
        notification_date: notificationDate.value
    }

    const filter = {
        payment_type: {eq: `${dataObject.payment_type}`}
    }

    const records = await paymentsTable.scan(filter).limit(1).exec()

    if (records.count !== 0) {
        dataObject.updated_at = moment().utc(true).toISOString()
        await paymentsTable.update({id: records[0].id}, dataObject)

        await interaction.reply('Your notification has been updated!')
    }

    dataObject.id = uuid()
    dataObject.created_at = moment().utc(true).toISOString()
    dataObject.updated_at = moment().utc(true).toISOString()
    await paymentsTable.create(dataObject)
    await interaction.reply('Your notification has been created!')
}

module.exports = {
    data: data,
    execute
}
