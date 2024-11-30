const { Client, Message } = require("discord.js");
const Moderator = require("../Modules/Moderator");

module.exports.config = {
    usage: "ban @user reason",
    category: "⚙️ Quản lý member",
    description: "Ban một member trong server",
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
    var member;
    if (message.mentions.members.size) member = message.mentions.members.first();
    else if (args[0]) member = message.guild.members.cache.find(member => member.user.id == args[0]);
    await Moderator.unban(message, member || args[0]);
}