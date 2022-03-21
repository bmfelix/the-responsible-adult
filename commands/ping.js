const { SlashCommandBuilder } = require('@discordjs/builders')

const execute = async (interaction) => {
    await interaction.reply('Pong!')
}

module.exports = {
    data: new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!'),
    execute
}
