const { BaseInteraction } = require("discord.js");

module.exports = {
    /**
     * Show an expired message for an interaction.
     * @param {BaseInteraction} interaction 
     */
    updateExpired: function(interaction, ephemeral = false) {
        return interaction.update({content: `❌ **Lệnh này đã hết hạn, vui lòng thực hiện một câu lệnh mới.**`, components: [], embeds: [], ephemeral});
    },
    /**
     * Show an error message for an interaction.
     * @param {BaseInteraction} interaction 
     */
    updateInteractionError: function(interaction, ephemeral = false, deferred = false) {
        if (deferred) return interaction.editReply({content: `❌ **Đã có lỗi máy chủ xảy ra, vui lòng thử lại hoặc liên hệ với nhà phát triển bot.**`, components: [], embeds: [], ephemeral});
        else if (interaction.message) return interaction.update({content: `❌ **Đã có lỗi máy chủ xảy ra, vui lòng thử lại hoặc liên hệ với nhà phát triển bot.**`, components: [], embeds: [], ephemeral});
        else return interaction.reply({content: `❌ **Đã có lỗi máy chủ xảy ra, vui lòng thử lại hoặc liên hệ với nhà phát triển bot.**`, components: [], embeds: [], ephemeral});
    },
}