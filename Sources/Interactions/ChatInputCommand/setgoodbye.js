const { SlashCommandBuilder, Client, ChatInputCommandInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");
const SessionManager = require("../../Modules/SessionManager");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("setgoodbye")
    .setDescription("Cài đặt tin nhắn tạm biệt cho máy chủ. Chỉ dành cho các admin."),
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
        .setCustomId(interaction.user.id + ".setgoodbye")
        .setTitle("Cài đặt tin tạm biệt");
        const title = new ActionRowBuilder().addComponents(new TextInputBuilder()
        .setCustomId("title")
        .setLabel("Tiêu đề")
        .setStyle(TextInputStyle.Short)
        .setRequired(false)
        .setValue(client.config.goodbye.title));
        const thumbnail = new ActionRowBuilder().addComponents(new TextInputBuilder()
        .setCustomId("thumbnail")
        .setLabel("URL thumbnail")
        .setStyle(TextInputStyle.Short)
        .setRequired(false)
        .setValue(client.config.goodbye.thumbnail));
        const image = new ActionRowBuilder().addComponents(new TextInputBuilder()
        .setCustomId("image")
        .setLabel("URL ảnh")
        .setStyle(TextInputStyle.Short)
        .setRequired(false)
        .setValue(client.config.goodbye.image));
        const description = new ActionRowBuilder().addComponents(new TextInputBuilder()
        .setCustomId("description")
        .setLabel("Mô tả")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true)
        .setValue(client.config.goodbye.description));
        modal.addComponents(title, thumbnail, image, description);
        await interaction.showModal(modal);
    }
}