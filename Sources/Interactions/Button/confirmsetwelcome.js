const { Client, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");
const SessionManager = require("../../Modules/SessionManager");
const fs = require("fs");
const KitsuneUtils = require("../../Modules/KitsuneUtils");

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
     * @param {ButtonInteraction} interaction 
     */
    run: async (client, interaction) => {
        try {
            var welcomeEmbed = SessionManager.getSessionProp(interaction.user.id, "welcomeEmbed");
            if (!welcomeEmbed) return KitsuneUtils.updateExpired(interaction, true);
            var title = welcomeEmbed.title,
                thumbnail = welcomeEmbed.thumbnail,
                image = welcomeEmbed.image,
                description = welcomeEmbed.description;
            var json = JSON.parse(fs.readFileSync("./Config.json").toString());
            json.welcome.title = title;
            json.welcome.thumbnail = thumbnail;
            json.welcome.image = image;
            json.welcome.description = description;
            fs.writeFileSync("./Config.json", JSON.stringify(json, null, 4));
            client.config = json;
            SessionManager.deleteSessionProp(interaction.user.id, "welcomeEmbed");
            interaction.update({
                content: "✅ **Đã cập nhật cài đặt thành công.**",
                embeds: [],
                components: []
            });
        }
        catch (err) {
            console.error(err);
            KitsuneUtils.updateInteractionError(interaction, true);
        }
    }
}