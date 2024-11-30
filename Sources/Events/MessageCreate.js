const Discord = require("discord.js");
const { PermissionFlagsBits, ChannelType } = require("discord.js");
const AutoMod = require("../Modules/AutoMod");

/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @returns 
 */
module.exports = function(client, message) {
    const prefix = client.config.prefix, content = message.content;
    if (message.author.bot) return;
    var check = AutoMod.process(message);
    if (!check) return;
    if (!content.startsWith(prefix)) return;
    var args = content.slice(prefix.length).split(/(\s+)/).filter( e => e.trim().length > 0),
        command = args[0];
    args.splice(0, 1);
    var commandInfo = client.commands.get(command.toLowerCase());
    if (!commandInfo || !commandInfo.run || !commandInfo.config) return;
    if (commandInfo.config.nodm && (message.channel.type == ChannelType.DM || message.channel.type == ChannelType.GroupDM)) return message.reply({content: "Câu lệnh này không thể sử dụng ở kênh Tin nhắn trực tiếp!"});
    if (commandInfo.config.memberPermissions && commandInfo.config.memberPermissions.length) {
        if (message.channel.type == ChannelType.DM || message.channel.type == ChannelType.GroupDM) return message.reply({content: "Câu lệnh này không thể sử dụng ở kênh Tin nhắn trực tiếp!"});
        for (var i = 0; i < commandInfo.config.memberPermissions.length; i++) {
            if (!message.member.permissions.has(PermissionFlagsBits[commandInfo.config.memberPermissions[i]])) return message.reply({content: "Cậu không có quyền để thực hiện lệnh này.\nLệnh này yêu cầu cậu cần có những quyền sau đây:\n`" + commandInfo.config.memberPermissions.join(", ") + "`"});
        }
    }
    if (commandInfo.config.botPermissions && commandInfo.config.botPermissions.length) {
        if (message.channel.type == ChannelType.DM || message.channel.type == ChannelType.GroupDM) return message.reply({content: "Câu lệnh này không thể sử dụng ở kênh Tin nhắn trực tiếp!"});
        for (var i = 0; i < commandInfo.config.botPermissions.length; i++) {
            if (!message.guild.members.me.permissions.has(PermissionFlagsBits[commandInfo.config.botPermissions[i]])) return message.reply({content: "Bot không có quyền để thực hiện lệnh này.\nLệnh này yêu cầu bot cần có những quyền sau đây:\n`" + commandInfo.config.botPermissions.join(", ") + "`"});
        }
    }
    if (commandInfo.config.ownerOnly && message.author.id != client.config.owner_id) return message.reply({content: "Chỉ có chủ sở hữu bot mới có thể sử dụng lệnh này."});
    commandInfo.run(client, message, args);
}