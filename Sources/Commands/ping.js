const { Client, Message } = require("discord.js");

module.exports.config = {
    usage: "ping",
    category: "🤖 Cơ bản",
    description: "Kiểm tra khả năng phản hồi của bot.",
    nodm: false,
    memberPermissions: [],
    botPermissions: [],
    ownerOnly: false
}

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 * @param {string[]} args 
 */
module.exports.run = function(client, message, args) {
    message.reply({content: `✅ **${client.user.displayName} đã phản hồi lại tin nhắn của cậu trong thời gian là ${new Date().getTime() - message.createdTimestamp} ms.**`});
}