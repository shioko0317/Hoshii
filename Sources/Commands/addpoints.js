const { Client, Message, User } = require("discord.js");
const UserManager = require("../Modules/UserManager");
const ms = require("ms");
const escape = require("markdown-escape");

module.exports.config = {
    usage: "addpoints @user points msg_points voice_points",
    category: "⚙️ Quản lý member",
    description: "(Chỉ dành cho admin) Thêm điểm cho một member trong server",
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
    var user = message.mentions.users.size ? message.mentions.users.first() : (args[0] ? client.users.cache.get(args[0]) : message.author);
    if (!user) return message.reply({content: "❌ **Không tìm thấy member này.**"});
    if (isNaN(args[1])) return message.reply({content: "❌ **Hãy nhập số điểm cần thêm.**"});
    var points = Number(args[1]) || 0, messagePoints = Number(args[2]) || 0, voicePoints = Number(args[3]) || 0;
    client.addPoints(message.guild.id, user.id, points);
    var parts = [`${points.toLocaleString()} điểm tổng`];
    if (messagePoints > 0) {
        UserManager.addMessagePoints(message.guild.id, user.id, messagePoints);
        parts.push(`${messagePoints.toLocaleString()} điểm tin nhắn`);
    }
    if (voicePoints > 0) {
        UserManager.addVoicePoints(message.guild.id, user.id, voicePoints);
        parts.push(`${voicePoints.toLocaleString()} điểm voice`);
    }
    if (messagePoints > 0 || voicePoints > 0) message.reply(`✅ **Đã thêm các điểm sau cho thành viên ${escape(user.displayName)}:**\n${parts.join("\n")}`);
    else message.reply(`✅ **Đã thêm ${points.toLocaleString()} điểm cho thành viên ${escape(user.displayName)}.**`);
}