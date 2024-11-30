const { Client, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");
const KitsuneRoleMenus = require("../../Modules/KitsuneRoleMenus");
const KitsuneUtils = require("../../Modules/KitsuneUtils");

module.exports = {
    config: {
        nodm: true,
        memberPermissions: [],
        botPermissions: ["ManageRoles"],
        ownerOnly: false
    },
    /**
     * 
     * @param {Client} client 
     * @param {ButtonInteraction} interaction 
     */
    run: async (client, interaction) => {
        try {
            await interaction.deferReply({ephemeral: true});
            var message = interaction.message, role = interaction.guild.roles.cache.get(interaction.customId.split(".")[2]);
            if (!role) return interaction.editReply({content: "❌ **Không tìm thấy role này trên server, vui lòng liên hệ với admin và thử lại.**", ephemeral: true});
            const roleMenu = KitsuneRoleMenus.getMenu(message.id);
            if (!roleMenu || !roleMenu.requiredRoles) return interaction.editReply({content: "❌ **Không tìm thấy thông tin bảng chọn role này trên server, vui lòng liên hệ với admin và thử lại.**", ephemeral: true});
            for (var roleId of roleMenu.requiredRoles) {
                if (!interaction.member.roles.cache.get(roleId)) return interaction.editReply({content: "❌ **Cậu không có đủ điều kiện để nhận role này.**", ephemeral: true});
            }
            if (!roleMenu.roles.includes(role.id)) return interaction.editReply({content: "❌ **Role này không nằm trong bảng chọn role. Cậu đang cố tình tìm ra lỗ hổng để nhận role khác ngoài ý muốn của admin đúng không?**", ephemeral: true});
            if (roleMenu.type == "single") {
                if (!interaction.member.roles.cache.get(role.id)) {
                    for (var roleIdTmp of roleMenu.roles.filter(roleTmp => roleTmp != role.id)) {
                        if (interaction.member.roles.cache.get(roleIdTmp)) await interaction.member.roles.remove(roleIdTmp);
                    }
                    await interaction.member.roles.add(role.id);
                    interaction.editReply({content: `✅ **Cậu đã nhận được role \`${role.name}\` rồi nhé.**`, ephemeral: true});
                }
                else {
                    await interaction.member.roles.remove(role.id);
                    interaction.editReply({content: `✅ **Đã loại bỏ role \`${role.name}\` cho cậu rồi nhé.**`, ephemeral: true});
                }
            }
            else {
                if (!interaction.member.roles.cache.get(role.id)) {
                    await interaction.member.roles.add(role.id);
                    interaction.editReply({content: `✅ **Cậu đã nhận được role \`${role.name}\` rồi nhé.**`, ephemeral: true});
                }
                else {
                    await interaction.member.roles.remove(role.id);
                    interaction.editReply({content: `✅ **Đã loại bỏ role \`${role.name}\` cho cậu rồi nhé.**`, ephemeral: true});
                }
            }
        }
        catch (err) {
            console.error(err);
            KitsuneUtils.updateInteractionError(interaction, true);
        }
    }
}