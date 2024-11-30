const { Client, ModalSubmitInteraction, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require("discord.js");
const SessionManager = require("../../Modules/SessionManager");
const KitsuneUtils = require("../../Modules/KitsuneUtils");
const KitsuneEmbed = require("../../Modules/KitsuneEmbed");

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
     * @param {ModalSubmitInteraction} interaction 
     */
    run: async (client, interaction) => {
        try {
            var title = interaction.fields.getTextInputValue("title"),
                thumbnail = interaction.fields.getTextInputValue("thumbnail"),
                image = interaction.fields.getTextInputValue("image"),
                description = interaction.fields.getTextInputValue("description");
            SessionManager.updateSessionProp(interaction.user.id, "goodbyeEmbed", {title, thumbnail, image, description});
            const member = interaction.member;
            const embed = KitsuneEmbed(client)
            .setAuthor({name: member.guild.name, iconURL: member.guild.iconURL({size: 128})});
            if (title) {
                try {embed.setTitle(eval(title))}
                catch {embed.setTitle(title)}
            }
            if (thumbnail) {
                try {embed.setThumbnail(eval(thumbnail))}
                catch {embed.setThumbnail(thumbnail)}
            }
            if (image) {
                try {embed.setImage(eval(image))}
                catch {embed.setImage(image)}
            }
            if (description) {
                try {embed.setDescription(eval(description))}
                catch {embed.setDescription(description)}
            }
            const info = {
                content: "**Trước khi áp dụng thay đổi, cậu có thể xem trước nội dung tin nhắn mới:**\nSau khi đã kiểm tra xong, hãy nhấn Xác nhận để áp dụng thay đổi hoặc Huỷ bỏ để huỷ bỏ việc thay đổi.",
                embeds: [embed],
                components: [
                    new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                        .setCustomId(interaction.user.id + ".confirmsetgoodbye")
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji("✅")
                        .setLabel("Xác nhận"),
                        new ButtonBuilder()
                        .setCustomId(interaction.user.id + ".cancel")
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji("❎")
                        .setLabel("Huỷ bỏ")
                    )
                ],
                ephemeral: true
            }
            if (interaction.message) interaction.update(info);
            else interaction.reply(info);
        }
        catch (err) {
            console.error(err);
            KitsuneUtils.updateInteractionError(interaction, true);
        }
    }
}