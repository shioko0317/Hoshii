const { Client, ModalSubmitInteraction } = require("discord.js");
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
        var channel = client.channels.cache.get(SessionManager.getSessionProp(interaction.user.id, "embedChannel"));
        if (!channel) return KitsuneUtils.updateExpired(interaction, true);
        try {
            var title = interaction.fields.getTextInputValue("title"),
                thumbnail = interaction.fields.getTextInputValue("thumbnail"),
                image = interaction.fields.getTextInputValue("image"),
                description = interaction.fields.getTextInputValue("description");
            const embed = KitsuneEmbed(client)
            .setDescription(description);
            if (title) embed.setTitle(interaction.fields.getTextInputValue("title"));
            if (thumbnail) embed.setThumbnail(interaction.fields.getTextInputValue("thumbnail"));
            if (image) embed.setImage(interaction.fields.getTextInputValue("image"));
            await channel.send({
                embeds: [embed]
            });
            if (interaction.message) interaction.update({content: `✅ **Gửi embed hoàn tất.**`, embeds: [], components: [], ephemeral: true});
            else interaction.reply({content: `✅ **Gửi embed hoàn tất.**`, embeds: [], components: [], ephemeral: true});
            SessionManager.deleteSessionProp(interaction.user.id, "embedChannel");
        }
        catch (err) {
            console.error(err);
            KitsuneUtils.updateInteractionError(interaction, true);
        }
    }
}