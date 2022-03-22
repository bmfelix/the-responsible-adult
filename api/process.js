const moment = require('moment')

const responses = require('../modules/responseHelper')
const response = responses.success
const paymentsTable = require('../database/payments')
const discord = require('./discord.js')

const doesItRunToday = (date) => {
    const now = moment().date()
    const then = date

    return now === then
}

const sendNotification = async (notification) => {
    await discord.sendMessage(notification)
}

const isSameDayAndMonth = (m1, m2) => {
    return m1.date() === m2.date() && m1.month() === m2.month()
}

const notifications = async () => {
    if (!discord && !discord.client.isConnected()) {
        await discord.start()
    }

    const payments = await paymentsTable.getAllRecords()
    const processedNotifications = []
    const resp = []

    if (!payments) {
        response.statusCode = 200
        response.body = JSON.stringify({message: 'No Records'})
        return response
    }

    payments.forEach((payment) => {
        const paymentData = payment.data()
        const docId = payment.id

        const runToday = doesItRunToday(paymentData.notification_date)

        if (runToday) {
            paymentData.id = docId
            processedNotifications.push(paymentData)
        }
    })

    await processedNotifications.forEach(async (notification) => {
        const updatedAt = moment(notification.updated_at)
        const createdAt = moment(notification.created_at)
        const theDay = notification.notification_date
        const theTime = notification.notification_time
        const currentHour = moment().hour()
        const currentDay = moment().date()
        const howOften = notification.how_often

        const sameDay = isSameDayAndMonth(updatedAt, createdAt)

        if (theDay === currentDay && theTime <= currentHour && sameDay && howOften === 'one_time') {
            const updatedNotification = notification

            updatedNotification.updated_at = moment().utc(true).toISOString()
            resp.push(`${updatedNotification.payment_type} notification sent`)
            await sendNotification(updatedNotification)
        } else {
            resp.push(`${notification.payment_type} notification not sent`)
        }
    })

    const message = resp.join('\n')

    response.statusCode = 200
    response.body = JSON.stringify({message: message})

    return response
}

module.exports = {
    notifications
}
