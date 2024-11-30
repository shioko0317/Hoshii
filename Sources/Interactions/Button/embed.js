const { Client, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
    config: {
        nodm: true,
        memberPermissions: ["ManageGuild"],
        botPermissions: [],
        ownerOnly: false
    },
    /**
     * 
     * @param {Client} client 
     * @param {ButtonInteraction} interaction 
     */
    run: async (client, interaction) => {
        const modal = new ModalBuilder()
        .setCustomId(interaction.user.id + ".embed")
        .setTitle("Gửi embed mới");
        const title = new ActionRowBuilder().addComponents(new TextInputBuilder()
        .setCustomId("title")
        .setLabel("Tiêu đề")
        .setStyle(TextInputStyle.Short)
        .setRequired(false));
        const thumbnail = new ActionRowBuilder().addComponents(new TextInputBuilder()
        .setCustomId("thumbnail")
        .setLabel("URL thumbnail")
        .setStyle(TextInputStyle.Short)
        .setRequired(false));
        const image = new ActionRowBuilder().addComponents(new TextInputBuilder()
        .setCustomId("image")
        .setLabel("URL ảnh")
        .setStyle(TextInputStyle.Short)
        .setRequired(false));
        const description = new ActionRowBuilder().addComponents(new TextInputBuilder()
        .setCustomId("description")
        .setLabel("Mô tả")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true));
        modal.addComponents(title, thumbnail, image, description);
        await interaction.showModal(modal);
    }
}