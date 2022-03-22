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
})

const doesRecordExist = async (type, table) => {
    const data = await db.collection(table).where('payment_type', '==', type).get()

    // eslint-disable-next-line no-underscore-dangle
    if (data._size === 0) {
        return false
    }

    return data
}

const getAllRecords = async () => {
    const data = await db.collection('payments').get()

    // eslint-disable-next-line no-underscore-dangle
    if (data._size === 0) {
        return false
    }

    return data
}

const upsertRecord = async (id, object, status) => {
    const record = db.collection('payments').doc(id)

    if (status === 'create') {
        await record.set(object)
    } else {
        await record.update(object)
    }
}

module.exports = {
    doesRecordExist,
    upsertRecord,
    getAllRecords
}
