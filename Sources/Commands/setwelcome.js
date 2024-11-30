const { Client, Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const newEmbed = require("../Modules/KitsuneEmbed");
const SessionManager = require("../Modules/SessionManager");

module.exports.config = {
    usage: "setwelcome",
    category: "⚙️ Quản lý máy chủ",
    description: "Cài đặt tin nhắn chào mừng cho máy chủ. Chỉ dành cho các admin.",
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
    message.reply({content: `⬇️ **Nhấn vào nút bên dưới để bắt đầu việc cài đặt.**`, components: [
        new ActionRowBuilder().addComponents(
            new ButtonBuilder()
            .setCustomId(message.author.id + ".setwelcome")
            .setStyle(ButtonStyle.Primary)
            .setLabel("Bắt đầu")
        )
    ]});
}