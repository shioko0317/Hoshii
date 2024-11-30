const { Client, ModalSubmitInteraction, ActionRowBuilder, ButtonStyle, ButtonBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const SessionManager = require("../../Modules/SessionManager");
const KitsuneUtils = require("../../Modules/KitsuneUtils");
const KitsuneEmbed = require("../../Modules/KitsuneEmbed");
const KitsuneConfessions = require("../../Modules/KitsuneConfessions");

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
     * @param {ModalSubmitInteraction} interaction 
     */
    run: async (client, interaction) => {
        var time = new Date();
        var seconds = parseInt(time.getTime() / 1000) % 86400;
        if (seconds >= 59400 && seconds <= 82800) return interaction.reply({content: "❌ **Tính năng gửi confession sẽ tạm khóa từ 23:30 đến 6:00 sáng hôm sau.**", ephemeral: true});
        var cooldown = SessionManager.getSessionProp("confessions", "cooldown");
        if (cooldown && new Date().getTime() < cooldown) return interaction.reply({content: "❌ **Đã có một confession được duyệt gần đây rồi, cậu cần đợi ít nhất 30 phút trước khi gửi confession mới.**", ephemeral: true});
        await interaction.deferReply({ephemeral: true});
        try {
            var image = SessionManager.getSessionProp(interaction.user.id, "confessionImage");
            var cfsId = (Object.keys(KitsuneConfessions.getAllConfessions()).length + 1).toString();
            KitsuneConfessions.updateConfession(cfsId, {content: interaction.fields.getTextInputValue("content"), image, sender: interaction.user.id});
            const staffChannel = client.channels.cache.get(client.config.staff_channel), confessionChannel = client.channels.cache.get(client.config.confession_channel);
            if (!staffChannel || !confessionChannel) return interaction.editReply({content: "❌ **Không thể gửi confession của cậu tới các admin. Vui lòng liên hệ admin hoặc nhà phát triển bot và thử lại.**"});
            var embed = KitsuneEmbed(client)
            .setTitle(`#himecfs${cfsId}`)
            .setDescription(interaction.fields.getTextInputValue("content"))
            .addFields({
                name: "Người gửi confession:", value: `||${interaction.user.toString()}||`
            });
            if (image) embed.setImage(image);
            await staffChannel.send({
                content: "@everyone",
                embeds: [embed],
                components: [
                    new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                        .setCustomId(`0.confessionAdmin.approve.${cfsId}`)
                        .setEmoji("✅")
                        .setLabel("Phê duyệt")
                        .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                        .setCustomId(`0.confessionAdmin.reject.${cfsId}`)
                        .setEmoji("❎")
                        .setLabel("Từ chối")
                        .setStyle(ButtonStyle.Danger)
                    )
                ]
            });
            interaction.editReply({content: "✅ **Confession của cậu đã được gửi và sẽ được các admin duyệt trước khi được đăng tải.**\n*Danh tính của cậu sẽ không được tiết lộ trong confession với bất kì ai, kể cả admin.*", ephemeral: true});
        }
        catch (err) {
            console.error(err);
            KitsuneUtils.updateInteractionError(interaction, true, true);
        }
    }
}