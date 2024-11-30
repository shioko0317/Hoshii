const { SlashCommandBuilder, Client, ChatInputCommandInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, StringSelectMenuBuilder, RoleSelectMenuBuilder } = require("discord.js");
const SessionManager = require("../../Modules/SessionManager");
const Moderator = require("../../Modules/Moderator");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban một member trong server")
    .addUserOption(option => option
        .setName("member")
        .setDescription("Member cậu muốn ban")
        .setRequired(false)
    )
    .addStringOption(option => option
        .setName("member_id")
        .setDescription("ID của member cậu muốn ban")
        .setRequired(false)
    )
    .addStringOption(option => option
        .setName("reason")
        .setDescription("Lý do ban")
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
        var member = user ? interaction.guild.members.cache.find(member => member.user.id == user.id) : interaction.guild.members.cache.find(member => member.user.id == interaction.options.getString("member_id"));
        if (!member && !interaction.options.getString("member_id")) return interaction.reply({content: "❌ **Hãy chọn một member.**", ephemeral: true});
        await Moderator.ban(interaction, member || interaction.options.getString("member_id"), interaction.options.getString("reason"));
    }
}