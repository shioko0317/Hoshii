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
            var goodbyeEmbed = SessionManager.getSessionProp(interaction.user.id, "goodbyeEmbed");
            if (!goodbyeEmbed) return KitsuneUtils.updateExpired(interaction, true);
            var title = goodbyeEmbed.title,
                thumbnail = goodbyeEmbed.thumbnail,
                image = goodbyeEmbed.image,
                description = goodbyeEmbed.description;
            var json = JSON.parse(fs.readFileSync("./Config.json").toString());
            json.goodbye.title = title;
            json.goodbye.thumbnail = thumbnail;
            json.goodbye.image = image;
            json.goodbye.description = description;
            fs.writeFileSync("./Config.json", JSON.stringify(json, null, 4));
            client.config = json;
            SessionManager.deleteSessionProp(interaction.user.id, "goodbyeEmbed");
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