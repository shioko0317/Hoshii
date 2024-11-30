const { SlashCommandBuilder, Client, ChatInputCommandInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const KitsuneUtils = require("../../Modules/KitsuneUtils");
const KitsuneEmbed = require("../../Modules/KitsuneEmbed");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("createverify")
    .setDescription("Tạo nút xác minh cho các thành viên. Chỉ dành cho các admin.")
    .addRoleOption(option => option
        .setName("role")
        .setDescription("Role sẽ được thêm cho thành viên khi xác minh thành công.")
        .setRequired(true)
    )
    .addStringOption(option => option
        .setName("content")
        .setDescription("Nội dung tin nhắn sẽ được kèm theo nút xác minh.")
        .setRequired(true)
    )
    .addChannelOption(option => option
        .setName("channel")
        .setDescription("Kênh cậu muốn gửi tin nhắn xác minh. Bỏ trống để gửi đến kênh hiện tại.")
        .setRequired(false)
    ),
    config: {
        nodm: true,
        memberPermissions: ["ManageGuild"],
        botPermissions: ["ManageRoles"],
        ownerOnly: false
    },
    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        const channel = interaction.options.getChannel("channel") || interaction.channel;
        if (!channel.isTextBased()) return interaction.reply({content: "❌ **Kênh cậu chọn không phải là một kênh có thể chat được.**", ephemeral: true});
        try {
            await interaction.deferReply({ephemeral: true});
            channel.send({
                embeds: [
                    KitsuneEmbed(client)
                    .setTitle("Xác minh thành viên")
                    .setDescription(interaction.options.getString("content"))
                ],
                components: [
                    new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                        .setCustomId(`0.verify.${interaction.options.getRole("role").id}`)
                        .setEmoji("✅")
                        .setStyle(ButtonStyle.Primary)
                        .setLabel("Xác minh")
                    )
                ]
            });
            interaction.editReply({content: "✅ **Đã tạo một tin nhắn xác minh mới cho các thành viên.**", ephemeral: true});
        }
        catch (err) {
            console.error(err);
            KitsuneUtils.updateInteractionError(interaction, true, true);
        }
    }
}