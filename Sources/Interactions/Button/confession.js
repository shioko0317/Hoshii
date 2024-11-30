const { Client, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");
const SessionManager = require("../../Modules/SessionManager");

module.exports = {
    config: {
        nodm: true,
        memberPermissions: [],
        botPermissions: ["ManageThreads", "CreatePublicThreads", "EmbedLinks", "AttachFiles"],
        ownerOnly: false
    },
    /**
     * 
     * @param {Client} client 
     * @param {ButtonInteraction} interaction 
     */
    run: async (client, interaction) => {
        var time = new Date();
        var seconds = parseInt(time.getTime() / 1000) % 86400;
        if (seconds >= 59400 && seconds <= 82800) return interaction.reply({content: "❌ **Tính năng gửi confession sẽ tạm khóa từ 23:30 đến 6:00 sáng hôm sau.**", ephemeral: true});
        var cooldown = SessionManager.getSessionProp("confessions", "cooldown");
        if (cooldown && new Date().getTime() < cooldown) return interaction.reply({content: "❌ **Đã có một confession được duyệt gần đây rồi, cậu cần đợi ít nhất 30 phút trước khi gửi confession mới.**", ephemeral: true});
        const modal = new ModalBuilder()
        .setCustomId(`${interaction.user.id}.confession`)
        .setTitle("Gửi confession ẩn danh");
        const content = new ActionRowBuilder().addComponents(
            new TextInputBuilder()
            .setCustomId("content")
            .setStyle(TextInputStyle.Paragraph)
            .setLabel("Nội dung confession:")
            .setMinLength(20)
            .setRequired(true)
        );
        modal.addComponents(content);
        interaction.showModal(modal);
    }
}