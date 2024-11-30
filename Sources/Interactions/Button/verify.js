const { Client, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");
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
        await interaction.deferReply({ephemeral: true});
        try {
            const role = interaction.guild.roles.cache.get(interaction.customId.split(".")[2]);
            if (!role) return interaction.editReply({content: "❌ **Không thể tìm thấy role xác minh được gán vào tin nhắn này, có thể nó đã bị xoá trước đó. Vui lòng liên hệ cho admin và thử lại.**"});
            if (interaction.member.roles.cache.get(role.id)) return interaction.editReply({content: "**Cậu đã xác minh ở trên server này rồi, không cần phải làm gì thêm.**"});
            await interaction.member.roles.add(role, "Xác minh thành viên");
            interaction.editReply({content: "✅ **Đã xác minh thành công.**"});
        }
        catch (err) {
            console.error(err);
            KitsuneUtils.updateInteractionError(interaction, true, true);
        }
    }
}