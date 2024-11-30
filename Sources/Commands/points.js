const { Client, Message } = require("discord.js");
const UserManager = require("../Modules/UserManager");
const SessionManager = require("../Modules/SessionManager");
const KitsuneEmbed = require("../Modules/KitsuneEmbed");

module.exports.config = {
    usage: "points <@mention>",
    category: "⚙️ Quản lý member",
    description: "Xem số điểm hiện tại của cậu (hoặc người khác) trên server này",
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
    var user = message.mentions.users.size() ? message.mentions.users.first() : (args[0] ? client.users.cache.get(args[0]) : message.author);
    if (!user) return message.reply({content: "❌ **Không tìm thấy member này.**"});
    var info = UserManager.getUser(user.id), config = client.config.scoring;
    const embed = KitsuneEmbed(client)
    .setAuthor({name: user.displayName, iconURL: user.avatarURL({size: 256})})
    .setTitle(`Số điểm hiện có trên ${message.guild.name}`)
    .setDescription(`* Cứ mỗi tin nhắn cậu gửi trên server (trừ các kênh bot), cậu sẽ nhận được ${config.msg_points_multiplier} điểm. Tối đa là ${config.msg_points} điểm mỗi ${config.per_which_minute} phút.\n* Cậu cũng sẽ nhận được ${config.voice_mins_multiplier} điểm cho mỗi phút cậu ở trong voice.`)
    .addFields(
        {name: "Điểm:", value: (info.points || 0).toLocaleString(), inline: false},
        {name: "Số tin nhắn:", value: (info.messages || 0).toLocaleString(), inline: true},
        {name: "Số phút trong voice:", value: (info.minutes || 0).toLocaleString(), inline: true}
    )
}