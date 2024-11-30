const { SlashCommandBuilder, messageLink, EmbedBuilder, channelLink, User, time, Client, ChatInputCommandInteraction, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, Attachment } = require("discord.js");
const SessionManager = require("../../Modules/SessionManager");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("confess")
    .setDescription("Gửi confession ẩn danh trên server.")
    .addAttachmentOption(option => option
        .setName("image")
        .setDescription("Ảnh đi kèm confession nếu có.")
    ),
    config: {
        nodm: true,
        memberPermissions: [],
        botPermissions: ["ManageThreads", "CreatePublicThreads", "EmbedLinks", "AttachFiles"],
        ownerOnly: false
    },
    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        var time = new Date();
        var seconds = parseInt(time.getTime() / 1000) % 86400;
        if (seconds >= 59400 && seconds <= 82800) return interaction.reply({content: "❌ **Tính năng gửi confession sẽ tạm khóa từ 23:30 đến 6:00 sáng hôm sau.**", ephemeral: true});
        var cooldown = SessionManager.getSessionProp("confessions", "cooldown");
        if (cooldown && new Date().getTime() < cooldown) return interaction.reply({content: "❌ **Đã có một confession được duyệt gần đây rồi, cậu cần đợi ít nhất 30 phút trước khi gửi confession mới.**", ephemeral: true});
        var image = interaction.options.getAttachment("image");
        if (image) {
            if (!image.name.endsWith(".png") && !image.name.endsWith(".jpg") && !image.name.endsWith(".webp") && !image.name.endsWith(".gif") && !image.name.endsWith(".apng")) return interaction.reply({content: "❌ **File cậu gửi không hợp lệ để làm ảnh cho confession.**", ephemeral: true});
            SessionManager.updateSessionProp(interaction.user.id, "confessionImage", image.url);
        }
        else SessionManager.deleteSessionProp(interaction.user.id, "confessionImage");
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