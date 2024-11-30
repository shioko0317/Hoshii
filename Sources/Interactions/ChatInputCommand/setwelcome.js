const { SlashCommandBuilder, Client, ChatInputCommandInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");
const SessionManager = require("../../Modules/SessionManager");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("setwelcome")
    .setDescription("Cài đặt tin nhắn chào mừng cho máy chủ. Chỉ dành cho các admin."),
    config: {
        nodm: true,
        memberPermissions: ["ManageGuild"],
        botPermissions: [],
        ownerOnly: false
    },
    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        const modal = new ModalBuilder()
        .setCustomId(interaction.user.id + ".setwelcome")
        .setTitle("Cài đặt tin chào mừng");
        const title = new ActionRowBuilder().addComponents(new TextInputBuilder()
        .setCustomId("title")
        .setLabel("Tiêu đề")
        .setStyle(TextInputStyle.Short)
        .setRequired(false)
        .setValue(client.config.welcome.title));
        const thumbnail = new ActionRowBuilder().addComponents(new TextInputBuilder()
        .setCustomId("thumbnail")
        .setLabel("URL thumbnail")
        .setStyle(TextInputStyle.Short)
        .setRequired(false)
        .setValue(client.config.welcome.thumbnail));
        const image = new ActionRowBuilder().addComponents(new TextInputBuilder()
        .setCustomId("image")
        .setLabel("URL ảnh")
        .setStyle(TextInputStyle.Short)
        .setRequired(false)
        .setValue(client.config.welcome.image));
        const description = new ActionRowBuilder().addComponents(new TextInputBuilder()
        .setCustomId("description")
        .setLabel("Mô tả")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true)
        .setValue(client.config.welcome.description));
        modal.addComponents(title, thumbnail, image, description);
        await interaction.showModal(modal);
    }
}