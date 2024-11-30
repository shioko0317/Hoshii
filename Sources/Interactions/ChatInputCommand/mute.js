const { SlashCommandBuilder, Client, ChatInputCommandInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, StringSelectMenuBuilder, RoleSelectMenuBuilder } = require("discord.js");
const SessionManager = require("../../Modules/SessionManager");
const Moderator = require("../../Modules/Moderator");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Mute một member trong server")
    .addUserOption(option => option
        .setName("member")
        .setDescription("Member cậu muốn mute")
        .setRequired(true)
    )
    .addStringOption(option => option
        .setName("duration")
        .setDescription("Thời hạn mute")
        .setRequired(false)
    )
    .addStringOption(option => option
        .setName("reason")
        .setDescription("Lý do mute")
        .setRequired(false)
    ),
    config: {
        nodm: true,
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
        var user = interaction.options.getUser("member");
        var member = interaction.guild.members.cache.find(member => member.user.id == user.id);
        if (!member) return interaction.reply({content: "❌ **Không tìm thấy member này.**", ephemeral: true});
        await Moderator.mute(interaction, member, interaction.options.getString("duration"), interaction.options.getString("reason"), false);
    }
}