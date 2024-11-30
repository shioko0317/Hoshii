const { Client, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, RoleSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const SessionManager = require("../../Modules/SessionManager");
const KitsuneUtils = require("../../Modules/KitsuneUtils");
const KitsuneEmbed = require("../../Modules/KitsuneEmbed");
const KitsuneRoleMenus = require("../../Modules/KitsuneRoleMenus");

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
        var roleMenuSelections = SessionManager.getSessionProp(interaction.user.id, "roleMenuSelections"),
            roleMenuType = SessionManager.getSessionProp(interaction.user.id, "roleMenuType"),
            roleMenuName = SessionManager.getSessionProp(interaction.user.id, "roleMenuName"),
            roleMenuRequiredRoles = SessionManager.getSessionProp(interaction.user.id, "roleMenuRequiredRoles"),
            roleMenuEmojis = SessionManager.getSessionProp(interaction.user.id, "roleMenuEmojis") || {},
            roleMenuTexts = SessionManager.getSessionProp(interaction.user.id, "roleMenuTexts") || {};
        switch (interaction.customId.split(".")[2]) {
            case "submit": {
                await interaction.deferUpdate();
                const emojiSettings = roleMenuSelections.filter(role => !roleMenuEmojis[role]);
                const textSettings = roleMenuSelections.filter(role => !roleMenuTexts[role]);
                if (!roleMenuSelections || !roleMenuType || !roleMenuRequiredRoles || !roleMenuName || emojiSettings.length || textSettings.length) return interaction.reply({content: "❌ **Không đủ dữ liệu để có thể xác nhận tạo bảng chọn role. Vui lòng thử lại một câu lệnh mới.**", ephemeral: true});
                const components = [];
                const embed = KitsuneEmbed(client, false).setTitle(roleMenuName);
                for (var i = 0; i < Math.ceil(roleMenuSelections.length / 5); i++) {
                    const row = new ActionRowBuilder();
                    for (var j = i * 5; j < Math.min((i + 1) * 5, roleMenuSelections.length); j++) {
                        var roleId = roleMenuSelections[j];
                        row.addComponents(
                            new ButtonBuilder()
                            .setCustomId(`0.role.${roleId}`)
                            .setEmoji(roleMenuEmojis[roleId])
                            .setLabel(roleMenuTexts[roleId])
                            .setStyle(ButtonStyle.Secondary)
                        );
                    }
                    components.push(row);
                }
                const message = await interaction.channel.send({embeds: [embed], components});
                KitsuneRoleMenus.updateMenu(message.id, {
                    type: roleMenuType,
                    name: roleMenuName,
                    requiredRoles: roleMenuRequiredRoles,
                    roles: roleMenuSelections
                });
                interaction.editReply({content: `✅ **Tạo bảng chọn role mới (\`${roleMenuName}\`) thành công.**`, ephemeral: true, components: [], embeds: []});
                break;
            }
            case "continue": {
                if (!roleMenuName) {
                    const modal = new ModalBuilder()
                    .setCustomId(`${interaction.user.id}.rolemenu`)
                    .setTitle("Nhập tên bảng chọn role");
                    const name = new ActionRowBuilder().addComponents(
                        new TextInputBuilder()
                        .setCustomId("name")
                        .setLabel("Tên bảng chọn role:")
                        .setStyle(TextInputStyle.Short)
                        .setMaxLength(200)
                        .setRequired(true)
                    );
                    modal.addComponents(name);
                    interaction.showModal(modal);
                    return;
                }
                const emojiSettings = roleMenuSelections.filter(role => !roleMenuEmojis[role]);
                if (emojiSettings.length) {
                    const modal = new ModalBuilder()
                    .setCustomId(`${interaction.user.id}.rolemenu`)
                    .setTitle("Đặt emoji cho các role");
                    for (var i = 0; i < Math.min(5, emojiSettings.length); i++) {
                        var roleId = emojiSettings[i];
                        const role = interaction.guild.roles.cache.get(roleId);
                        if (!role) return interaction.update({content: `**Không thể lấy thông tin của role có ID là \`${roleId}\`, vui lòng thử thực hiện lại câu lệnh.**`, components: [], embeds: []});
                        const input = new ActionRowBuilder().addComponents(
                            new TextInputBuilder()
                            .setCustomId(`emoji.${role.id}`)
                            .setStyle(TextInputStyle.Short)
                            .setLabel((role.name.length > 45) ? `${role.name.substring(0, 42)}...` : role.name)
                            .setMaxLength(100)
                            .setRequired(true)
                        );
                        modal.addComponents(input);
                    }
                    interaction.showModal(modal);
                    return;
                }
                const textSettings = roleMenuSelections.filter(role => !roleMenuTexts[role]);
                if (textSettings.length) {
                    const modal = new ModalBuilder()
                    .setCustomId(`${interaction.user.id}.rolemenu`)
                    .setTitle("Chữ hiển thị của các role");
                    for (var i = 0; i < Math.min(5, textSettings.length); i++) {
                        var roleId = textSettings[i];
                        const role = interaction.guild.roles.cache.get(roleId);
                        if (!role) return interaction.update({content: `**Không thể lấy thông tin của role có ID là \`${roleId}\`, vui lòng thử thực hiện lại câu lệnh.**`, components: [], embeds: []});
                        const input = new ActionRowBuilder().addComponents(
                            new TextInputBuilder()
                            .setCustomId(`text.${role.id}`)
                            .setStyle(TextInputStyle.Short)
                            .setLabel((role.name.length > 45) ? `${role.name.substring(0, 42)}...` : role.name)
                            .setMaxLength(75)
                            .setValue(role.name)
                            .setRequired(true)
                        );
                        modal.addComponents(input);
                    }
                    interaction.showModal(modal);
                    return;
                }
                break;
            }
            case "undo": {
                const latestUpdate = SessionManager.getSessionProp(interaction.user.id, "roleMenuLatestUpdate");
                if (!latestUpdate) return interaction.reply({content: "❌ **Không thể tìm thấy dữ liệu cũ để hoàn tác.**"});
                SessionManager.updateSessionProp(interaction.user.id, "roleMenuName", latestUpdate.roleMenuName);
                SessionManager.updateSessionProp(interaction.user.id, "roleMenuEmojis", latestUpdate.roleMenuEmojis || {});
                SessionManager.updateSessionProp(interaction.user.id, "roleMenuTexts", latestUpdate.roleMenuTexts || {});
                roleMenuName = latestUpdate.roleMenuName;
                roleMenuEmojis = latestUpdate.roleMenuEmojis || {};
                roleMenuTexts = latestUpdate.roleMenuTexts || {};
                const embed = KitsuneEmbed(client, false)
                .setTitle("Tạo bảng chọn role mới")
                .addFields({name: "Tên bảng chọn:", value: roleMenuName || "*Chưa cài đặt*", inline: false});
                for (var roleId of roleMenuSelections) {
                    if (!roleMenuEmojis[roleId] && !roleMenuTexts[roleId]) continue;
                    const role = interaction.guild.roles.cache.get(roleId);
                    if (!role) return interaction.update({content: `**Không thể lấy thông tin của role có ID là \`${roleId}\`, vui lòng thử thực hiện lại câu lệnh.**`, components: [], embeds: []});
                    embed.addFields({name: (role.name.length > 45) ? `${role.name.substring(0, 42)}...` : role.name, value: `${roleMenuEmojis[roleId]} ${roleMenuTexts[roleId] || "*Chưa cài đặt chữ hiển thị*"}`});
                }
                interaction.update({
                    content: "",
                    embeds: [embed],
                    components: [
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                            .setCustomId(`${interaction.user.id}.rolemenu.continue`)
                            .setEmoji("▶️")
                            .setLabel("Tiếp tục cài đặt")
                            .setStyle(ButtonStyle.Primary),
                            new ButtonBuilder()
                            .setCustomId(`${interaction.user.id}.rolemenu.cancel`)
                            .setEmoji("❎")
                            .setLabel("Huỷ bỏ")
                            .setStyle(ButtonStyle.Secondary)
                        )
                    ]
                });
                break;
            }
            case "cancel": {
                SessionManager.deleteSessionProp(interaction.user.id, "roleMenuSelections");
                SessionManager.deleteSessionProp(interaction.user.id, "roleMenuType");
                SessionManager.deleteSessionProp(interaction.user.id, "roleMenuName");
                SessionManager.deleteSessionProp(interaction.user.id, "roleMenuEmojis");
                SessionManager.deleteSessionProp(interaction.user.id, "roleMenuTexts");
                SessionManager.deleteSessionProp(interaction.user.id, "roleMenuRequiredRoles");
                SessionManager.deleteSessionProp(interaction.user.id, "roleMenuLatestUpdate");
                interaction.update({content: "✅ **Đã huỷ bỏ lệnh thành công.**", embeds: [], components: []});
                break;
            }
            case "skipRequiredRoles": {
                SessionManager.updateSessionProp(interaction.user.id, "roleMenuRequiredRoles", []);
                const modal = new ModalBuilder()
                .setCustomId(`${interaction.user.id}.rolemenu`)
                .setTitle("Nhập tên bảng chọn role");
                const name = new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                    .setCustomId("name")
                    .setLabel("Tên bảng chọn role:")
                    .setStyle(TextInputStyle.Short)
                    .setMaxLength(200)
                    .setRequired(true)
                );
                modal.addComponents(name);
                interaction.showModal(modal);
                break;
            }
            default: {
                interaction.update({
                    ephemeral: true,
                    content: "**Chọn những role cậu sẽ dùng để tạo bảng chọn:**",
                    components: [
                        new ActionRowBuilder().addComponents(
                            new RoleSelectMenuBuilder()
                            .setCustomId(`${interaction.user.id}.rolemenu`)
                            .setMinValues(1)
                            .setMaxValues(10)
                        )
                    ],
                    embeds: []
                });
                break;
            }
        }
    }
}