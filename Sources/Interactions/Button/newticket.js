const { Client, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
    config: {
        nodm: true,
        memberPermissions: [],
        botPermissions: ["ManageChannels", "ManageRoles"],
        ownerOnly: false
    },
    /**
     * 
     * @param {Client} client 
     * @param {ButtonInteraction} interaction 
     */
    run: async (client, interaction) => {
        const modal = new ModalBuilder()
        .setCustomId("0.newticket")
        .setTitle("Tạo yêu cầu mới");
        const content = new ActionRowBuilder().addComponents(
            new TextInputBuilder()
            .setCustomId("content")
            .setLabel("Nêu vấn đề cậu cần hỗ trợ nè:")
            .setStyle(TextInputStyle.Paragraph)
            .setMaxLength(2000)
        );
        modal.addComponents(content);
        interaction.showModal(modal);
    }
}