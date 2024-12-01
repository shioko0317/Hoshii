const { SlashCommandBuilder, Client, ChatInputCommandInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, StringSelectMenuBuilder, RoleSelectMenuBuilder } = require("discord.js");
const SessionManager = require("../../Modules/SessionManager");
const Moderator = require("../../Modules/Moderator");
const KitsuneUtils = require("../../Modules/KitsuneUtils");
const escape = require("markdown-escape");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("penalties")
    .setDescription("Xem các lần bạn hoặc member khác bị xử phạt")
    .addUserOption(option => option
        .setName("member")
        .setDescription("Member cậu muốn xem thông tin")
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
        var user = interaction.options.getUser("member") || interaction.user;
        var penalties = Moderator.penaltyDB.filterByUser(user.id);
        if (!penalties.length) return interaction.reply({content: `**Tuyệt vời, ${escape(user.displayName)} chưa bị xử phạt lần nào cả!**`, ephemeral: true});
        SessionManager.updateSessionProp(interaction.user.id, "penalties_user", user.id);
        SessionManager.updateSessionProp(interaction.user.id, "penalties_page", 1);
        Moderator.displayPenalties(interaction);
    }
}