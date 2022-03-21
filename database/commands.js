/**
 * zoho auth model.
 *
 * @author Brad Felix <bradfelix1@gmail.com>
 */

const moment = require('moment')
const Firestore = require('@google-cloud/firestore')
const config = require('../config.json')

const db = new Firestore({
    projectId: config.PROJECT_ID,
    keyFilename: 'key.json',
})

const doesRecordExist = async (id, table) => {
    const data = await db.collection(table).doc(id).get()

    // eslint-disable-next-line no-underscore-dangle
    if (data._size === 0) {
        return false
    }

    return data.data()
}

const upsertRecord = async (id, command) => {
    const record = db.collection('commands').doc(id)
    const object = {
        command_name: command.name,
        command: command.description,
        created_at: record.created_at ? record.created_at : moment().toISOString(),
        updated_at: moment().toISOString()
    }

    await record.set(object)
}

module.exports = {
    doesRecordExist,
    upsertRecord
}
