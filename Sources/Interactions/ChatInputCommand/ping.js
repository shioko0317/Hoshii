const { SlashCommandBuilder, messageLink, EmbedBuilder, channelLink, User, time, Client, ChatInputCommandInteraction } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Kiểm tra khả năng phản hồi của bot."),
    config: {
        nodm: false,
        memberPermissions: [],
        botPermissions: [],
        ownerOnly: false
    },
    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        interaction.reply({content: `✅ **${client.user.displayName} đã phản hồi lại tin nhắn của cậu trong thời gian là ${new Date().getTime() - interaction.createdTimestamp} ms.**`});
    }
}