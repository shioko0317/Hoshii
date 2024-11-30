const { Client, ModalSubmitInteraction, ModalBuilder, ActionRowBuilder, TextInputBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
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
        var roleMenuSelections = SessionManager.getSessionProp(interaction.user.id, "roleMenuSelections"),
            roleMenuType = SessionManager.getSessionProp(interaction.user.id, "roleMenuType"),
            roleMenuName = SessionManager.getSessionProp(interaction.user.id, "roleMenuName"),
            roleMenuEmojis = SessionManager.getSessionProp(interaction.user.id, "roleMenuEmojis") || {},
            roleMenuTexts = SessionManager.getSessionProp(interaction.user.id, "roleMenuTexts") || {};
        if (!roleMenuSelections || !roleMenuType) return KitsuneUtils.updateExpired(interaction, true);
        try {
            SessionManager.updateSessionProp(interaction.user.id, "roleMenuLatestUpdate", {roleMenuName, roleMenuEmojis, roleMenuTexts});
            try {
                if (!roleMenuName && interaction.fields.getTextInputValue("name")) {
                    SessionManager.updateSessionProp(interaction.user.id, "roleMenuName", interaction.fields.getTextInputValue("name"));
                    roleMenuName = interaction.fields.getTextInputValue("name");
                }
            }
            catch {}
            for (var role of roleMenuSelections) {
                try {
                    var emoji = interaction.fields.getTextInputValue(`emoji.${role}`);
                    if (emoji) roleMenuEmojis[role] = emoji;
                }
                catch {}
                try {
                    var text = interaction.fields.getTextInputValue(`text.${role}`);
                    if (text) roleMenuTexts[role] = text;
                }
                catch {}
            }
            SessionManager.updateSessionProp(interaction.user.id, "roleMenuEmojis", roleMenuEmojis);
            SessionManager.updateSessionProp(interaction.user.id, "roleMenuTexts", roleMenuTexts);
            const embed = KitsuneEmbed(client, false)
            .setTitle("Tạo bảng chọn role mới")
            .addFields({name: "Tên bảng chọn:", value: roleMenuName || "*Chưa cài đặt*", inline: false});
            for (var roleId of roleMenuSelections) {
                if (!roleMenuEmojis[roleId] && !roleMenuTexts[roleId]) continue;
                const role = interaction.guild.roles.cache.get(roleId);
                if (!role) return interaction.update({content: `**Không thể lấy thông tin của role có ID là \`${roleId}\`, vui lòng thử thực hiện lại câu lệnh.**`, components: [], embeds: []});
                embed.addFields({name: (role.name.length > 45) ? `${role.name.substring(0, 42)}...` : role.name, value: `${roleMenuEmojis[roleId]} ${roleMenuTexts[roleId] || "*Chưa cài đặt chữ hiển thị*"}`});
            }
            const emojiSettings = roleMenuSelections.filter(role => !roleMenuEmojis[role]);
            const textSettings = roleMenuSelections.filter(role => !roleMenuTexts[role]);
            var continueBtn = new ButtonBuilder()
            .setCustomId(`${interaction.user.id}.rolemenu.continue`)
            .setEmoji("▶️")
            .setLabel("Tiếp tục cài đặt")
            .setStyle(ButtonStyle.Primary);
            if (!emojiSettings.length && !textSettings.length) continueBtn = new ButtonBuilder()
            .setCustomId(`${interaction.user.id}.rolemenu.submit`)
            .setEmoji("✅")
            .setLabel("Xác nhận tạo")
            .setStyle(ButtonStyle.Primary);
            interaction.update({
                content: "",
                embeds: [embed],
                components: [
                    new ActionRowBuilder().addComponents(
                        continueBtn,
                        new ButtonBuilder()
                        .setCustomId(`${interaction.user.id}.rolemenu.undo`)
                        .setEmoji("↩️")
                        .setLabel("Hoàn tác cài đặt trước đó")
                        .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                        .setCustomId(`${interaction.user.id}.rolemenu.cancel`)
                        .setEmoji("❎")
                        .setLabel("Huỷ bỏ")
                        .setStyle(ButtonStyle.Secondary)
                    )
                ]
            });
        }
        catch (err) {
            console.error(err);
            KitsuneUtils.updateInteractionError(interaction, true);
        }
    }
}