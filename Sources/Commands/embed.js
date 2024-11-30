const { Client, Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const newEmbed = require("../Modules/KitsuneEmbed");
const SessionManager = require("../Modules/SessionManager");

module.exports.config = {
    usage: "embed (kênh)",
    category: "⚙️ Quản lý máy chủ",
    description: "Gửi tin nhắn của cậu dưới dạng embed của bot. Chỉ dành cho các admin.\nNhập ID của kênh hoặc đề cập một kênh bất kì để gửi embed đến kênh đó.",
    nodm: true,
    memberPermissions: ["ManageGuild"],
    botPermissions: [],
    ownerOnly: false
}

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 * @param {string[]} args 
 */
module.exports.run = async function(client, message, args) {
    var channel = message.mentions.channels.first() || client.channels.cache.get(args[0]) || message.channel;
    if (!channel.isTextBased()) return message.reply({content: `❌ **Hãy chọn một kênh có thể chat được.**`, ephemeral: true});
    SessionManager.updateSessionProp(message.author.id, "embedChannel", channel.id);
    message.reply({content: `⬇️ **Nhấn vào nút bên dưới để bắt đầu việc gửi embed.**`, components: [
        new ActionRowBuilder().addComponents(
            new ButtonBuilder()
            .setCustomId(message.author.id + ".embed")
            .setStyle(ButtonStyle.Primary)
            .setLabel("Bắt đầu")
        )
    ]});
}