const { Client, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ThreadAutoArchiveDuration } = require("discord.js");
const SessionManager = require("../../Modules/SessionManager");
const Moderator = require("../../Modules/Moderator");
const fs = require("fs");
const KitsuneUtils = require("../../Modules/KitsuneUtils");

module.exports = {
    config: {
        nodm: true,
        memberPermissions: [],
        botPermissions: [],
        ownerOnly: false
    },
    /**
     * 
     * @param {Client} client 
     * @param {ButtonInteraction} interaction 
     */
    run: async (client, interaction) => {
        var page = SessionManager.getSessionProp(interaction.user.id, "penalties_page");
        if (!page) interaction.update({content: "❌ **Lệnh này đã hết hạn, hãy thực hiện lại 1 lệnh mới.**", components: [], embeds: []});
        page = page + ((interaction.customId.split(".")[2] == "prev") ? -1 : 1);
        SessionManager.updateSessionProp(interaction.user.id, "penalties_page", page);
        Moderator.displayPenalties(interaction, true);
    }
}