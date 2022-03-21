/**
 * BigTable funcs
 *
 * @author Brad Felix <bradfelix1@gmail.com>
 */

const {Bigtable} = require('@google-cloud/bigtable')
const bigtable = new Bigtable()

const instanceID = 'discord-bot'
const clusterID = 'discord-bot-c1'

const doesInstanceExist = async () => {
    const instance = bigtable.instance(instanceID)

    console.log('Check Instance Exists')

    const [instanceExists] = await instance.exists()
  // [END bigtable_check_instance_exists]

  // Create instance if does not exists
    if (!instanceExists) {
        console.log('Creating a PRODUCTION Instance')

        const instanceOptions = {
            clusters: [
                {
                    id: clusterID,
                    nodes: 1,
                    location: 'us-central1-b',
                    storage: 'ssd',
                },
            ]
        }

        // Create production instance with given options
        const [prodInstance] = await instance.create(instanceOptions)

        console.log(`Created Instance: ${prodInstance.id}`)
    } else {
        console.log(`Instance ${instance.id} exists`)
    }
}

module.exports = {
    doesInstanceExist
}
