const { Client, ModalSubmitInteraction, RoleSelectMenuInteraction, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, StringSelectMenuInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, RoleSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
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
     * @param {StringSelectMenuInteraction} interaction 
     */
    run: async (client, interaction) => {
        try {
            SessionManager.updateSessionProp(interaction.user.id, "roleMenuType", interaction.values[0]);
            interaction.update({
                ephemeral: true,
                content: "**Chọn role yêu cầu thành viên đó phải có trước khi nhận được các role trong bảng chọn**:\n*Có thể bỏ trống để tất cả mọi người có thể nhận role.*",
                components: [
                    new ActionRowBuilder().addComponents(
                        new RoleSelectMenuBuilder()
                        .setCustomId(`${interaction.user.id}.rolemenu.requiredRoles`)
                        .setMinValues(0)
                        .setMaxValues(10)
                    ),
                    new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${interaction.user.id}.rolemenu.skipRequiredRoles`)
                        .setEmoji("⏩")
                        .setLabel("Bỏ qua")
                        .setStyle(ButtonStyle.Primary)
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