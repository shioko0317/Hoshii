const { Client, ModalSubmitInteraction, RoleSelectMenuInteraction, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, RoleSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
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
     * @param {RoleSelectMenuInteraction} interaction 
     */
    run: async (client, interaction) => {
        try {
            switch (interaction.customId.split(".")[2]) {
                case "requiredRoles": {
                    SessionManager.updateSessionProp(interaction.user.id, "roleMenuRequiredRoles", interaction.values);
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
                    SessionManager.updateSessionProp(interaction.user.id, "roleMenuSelections", interaction.values);
                    interaction.update({
                        content: "**Chọn một trong hai loại bảng chọn:**",
                        components: [
                            new ActionRowBuilder().addComponents(
                                new StringSelectMenuBuilder()
                                .setCustomId(`${interaction.user.id}.rolemenu`)
                                .setMinValues(1)
                                .setMaxValues(1)
                                .setOptions(
                                    new StringSelectMenuOptionBuilder()
                                    .setValue("single")
                                    .setLabel("Chọn một")
                                    .setDescription("Thành viên sẽ chỉ được chọn một role trong số các role ở bảng chọn."),
                                    new StringSelectMenuOptionBuilder()
                                    .setValue("multiple")
                                    .setLabel("Chọn nhiều")
                                    .setDescription("Thành viên sẽ được chọn nhiều role trong số các role ở bảng chọn.")
                                )
                            )
                        ]
                    });
                    break;
                }
            }
        }
        catch (err) {
            console.error(err);
            KitsuneUtils.updateInteractionError(interaction, true);
        }
    }
}