const { SlashCommandBuilder } = require('@discordjs/builders')

const execute = async (interaction) => {
    await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`)
}

module.exports = {
    data: new SlashCommandBuilder().setName('server').setDescription('Replies with Server Info'),
    execute,
}
