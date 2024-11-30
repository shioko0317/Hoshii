const { SlashCommandBuilder, Client, ChatInputCommandInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, StringSelectMenuBuilder, RoleSelectMenuBuilder } = require("discord.js");
const SessionManager = require("../../Modules/SessionManager");
const Moderator = require("../../Modules/Moderator");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Warn một member trong server")
    .addUserOption(option => option
        .setName("member")
        .setDescription("Member cậu muốn warn")
        .setRequired(true)
    )
    .addStringOption(option => option
        .setName("reason")
        .setDescription("Lý do warn")
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
        await Moderator.warn(interaction, member, interaction.options.getString("reason"));
    }
}