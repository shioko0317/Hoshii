const { SlashCommandBuilder, Client, ChatInputCommandInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, StringSelectMenuBuilder, RoleSelectMenuBuilder } = require("discord.js");
const SessionManager = require("../../Modules/SessionManager");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("rolemenu")
    .setDescription("Tạo một bảng chọn role cho các thành viên. Chỉ dành cho các admin."),
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
        SessionManager.deleteSessionProp(interaction.user.id, "roleMenuSelections");
        SessionManager.deleteSessionProp(interaction.user.id, "roleMenuType");
        SessionManager.deleteSessionProp(interaction.user.id, "roleMenuName");
        SessionManager.deleteSessionProp(interaction.user.id, "roleMenuEmojis");
        SessionManager.deleteSessionProp(interaction.user.id, "roleMenuTexts");
        SessionManager.deleteSessionProp(interaction.user.id, "roleMenuRequiredRoles");
        SessionManager.deleteSessionProp(interaction.user.id, "roleMenuLatestUpdate");
        interaction.reply({
            ephemeral: true,
            content: "**Chọn những role cậu sẽ dùng để tạo bảng chọn:**\n*Chỉ được chọn tối đa 10 role trong một bảng chọn.*",
            components: [
                new ActionRowBuilder().addComponents(
                    new RoleSelectMenuBuilder()
                    .setCustomId(`${interaction.user.id}.rolemenu`)
                    .setMinValues(1)
                    .setMaxValues(10)
                )
            ]
        });
    }
}