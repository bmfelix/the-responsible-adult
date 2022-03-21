const { SlashCommandBuilder } = require('@discordjs/builders')

const execute = async (interaction) => {
    interaction.reply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`)
}

module.exports = {
    data: new SlashCommandBuilder().setName('user').setDescription('Replies with user info!'),
    execute
}
