const { SlashCommandBuilder, Client, ChatInputCommandInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");
const SessionManager = require("../../Modules/SessionManager");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("embed")
    .setDescription("Gửi tin nhắn của cậu dưới dạng embed của bot. Chỉ dành cho các admin.")
    .addChannelOption(option => option
        .setName("channel")
        .setDescription("Chọn kênh cậu muốn gửi embed. Có thể bỏ trống để gửi tại kênh đang sử dụng câu lệnh.")
        .setRequired(false)
    ),
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
        var channel = interaction.options.getChannel("channel") || interaction.channel;
        if (!channel.isTextBased()) return interaction.reply({content: `❌ **Hãy chọn một kênh có thể chat được.**`, ephemeral: true});
        SessionManager.updateSessionProp(interaction.user.id, "embedChannel", channel.id);
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