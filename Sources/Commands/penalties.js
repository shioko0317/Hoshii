const { Client, Message } = require("discord.js");
const Moderator = require("../Modules/Moderator");
const SessionManager = require("../Modules/SessionManager");

module.exports.config = {
    usage: "penalties",
    category: "⚙️ Quản lý member",
    description: "Xem các lần bạn hoặc member khác bị xử phạt",
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
module.exports.run = async function(client, message, args) {
    args = message.content.replace(/  +/g, ' ').split(" ").slice(1);
    var user;
    if (message.mentions.users.size) user = message.mentions.users.first();
    else if (args[0]) user = client.users.cache.get(args[0]);
    else user = message.author;
    var penalties = Moderator.penaltyDB.filterByUser(user.id);
    if (!penalties.length) return message.reply({content: `**Tuyệt vời, ${user.displayName} chưa bị xử phạt lần nào cả!**`, ephemeral: true});
    SessionManager.updateSessionProp(message.author.id, "penalties_user", user.id);
    SessionManager.updateSessionProp(message.author.id, "penalties_page", 1);
    Moderator.displayPenalties(message);
}