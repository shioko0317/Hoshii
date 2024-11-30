const { Client, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, PermissionFlagsBits } = require("discord.js");
const KitsuneTickets = require("../../Modules/KitsuneTickets");

module.exports = {
    config: {
        nodm: true,
        memberPermissions: [],
        botPermissions: ["ManageChannels"],
        ownerOnly: false
    },
    /**
     * 
     * @param {Client} client 
     * @param {ButtonInteraction} interaction 
     */
    run: async (client, interaction) => {
        if (!(interaction.member.permissions.has(PermissionFlagsBits.ManageChannels) || interaction.member.roles.cache.find(role => client.config.tickets.moderator_roles.includes(role.id)))) return interaction.reply({content: "❌ **Chỉ có admin mới có thể đóng ticket này.**", ephemeral: true});
        if (!KitsuneTickets.getTicket(interaction.channel.id)) return interaction.reply({content: "Không tìm thấy dữ liệu của yêu cầu này, cậu hãy liên hệ cho admin để sửa lỗi này nhé.", ephemeral: true})
        const modal = new ModalBuilder()
        .setCustomId("0.closeticket")
        .setTitle("Đóng yêu cầu");
        const content = new ActionRowBuilder().addComponents(
            new TextInputBuilder()
            .setCustomId("reason")
            .setLabel("Lý do đóng yêu cầu:")
            .setStyle(TextInputStyle.Paragraph)
            .setMaxLength(500)
        );
        modal.addComponents(content);
        interaction.showModal(modal);
    }
}