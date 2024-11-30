const { Client, Message } = require("discord.js");
const Moderator = require("../Modules/Moderator");
const ms = require("ms");

module.exports.config = {
    usage: "mute @user duration reason",
    category: "⚙️ Quản lý member",
    description: "Mute một member trong server",
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
    var member, duration;
    if (message.mentions.members.size) member = message.mentions.members.first();
    else if (args[0]) member = message.guild.members.cache.find(member => member.user.id == args[0]);
    if (!member) return message.reply({content: "❌ **Hãy chọn một member.**"});
    if ((args[1].endsWith("w") || args[1].endsWith("d") || args[1].endsWith("h") || args[1].endsWith("m") || args[1].endsWith("s")) && ms(args[1])) duration = args[1];
    await Moderator.mute(message, member, duration, args.slice(duration ? 2 : 1).join(" "), false);
}