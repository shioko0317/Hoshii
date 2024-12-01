const { Client, Message, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const UserManager = require("../Modules/UserManager");
const KitsuneEmbed = require("../Modules/KitsuneEmbed");

module.exports.config = {
    usage: "top",
    category: "⚙️ Quản lý member",
    description: "Xem bảng xếp hạng điểm/số tin nhắn/số phút trong voice trên server này",
    nodm: true,
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
    var conditions = {
        messages: (a, b) => {return b.messages - a.messages},
        voice: (a, b) => {return b.minutes - a.minutes}
    }, vocab = {
        points: "điểm",
        messages: "số tin nhắn",
        voice: "số phút trong voice"
    };
    var rankType = "points";
    var ranking = UserManager.sort(message.guild.id, conditions[rankType]);
    const embed = KitsuneEmbed(client)
    .setAuthor({name: message.guild.name, iconURL: message.guild.iconURL({size: 256})})
    .setTitle(`Bảng xếp hạng theo ${vocab[rankType]}`);
    for (var i = 0; i < Math.min(ranking.length, 15); i++) {
        var info = ranking[i];
        var member = message.guild.members.cache.find(mem => mem.user.id == info.id), user = member ? member.user : client.users.cache.get(info.id);
        embed.addFields({
            name: `#${i + 1}: ${member ? member.displayName : (user ? user.displayName : "Member không xác định")}`,
            value: `**Điểm:** ${(info.points || 0).toLocaleString()} / **Số tin nhắn:** ${(info.messages || 0).toLocaleString()} / **Số phút trong voice:** ${(info.minutes || 0).toLocaleString()}`
        });
    }
    message.reply({
        embeds: [embed],
        components: [
            new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId(`${message.author.id}.top.points`)
                .setDisabled(rankType == "points")
                .setStyle(ButtonStyle.Primary)
                .setLabel("Điểm"),
                new ButtonBuilder()
                .setCustomId(`${message.author.id}.top.messages`)
                .setDisabled(rankType == "messages")
                .setStyle(ButtonStyle.Primary)
                .setLabel("Số Tin Nhắn"),
                new ButtonBuilder()
                .setCustomId(`${message.author.id}.top.voice`)
                .setDisabled(rankType == "voice")
                .setStyle(ButtonStyle.Primary)
                .setLabel("Số Phút Trong Voice")
            )
        ]
    });
}