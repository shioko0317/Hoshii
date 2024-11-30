const { Client, GuildMember } = require("discord.js");
const KitsuneEmbed = require("../Modules/KitsuneEmbed");

/**
 * 
 * @param {Client} client 
 * @param {GuildMember} member 
 */
module.exports = function(client, member) {
    var goodbyeData = client.config.goodbye, channel = client.channels.cache.get(goodbyeData.channel);
    if (!channel) return;
    const embed = KitsuneEmbed(client)
    .setAuthor({name: member.guild.name, iconURL: member.guild.iconURL({size: 128})});
    if (goodbyeData.title) {
        try {embed.setTitle(eval(goodbyeData.title))}
        catch {embed.setTitle(goodbyeData.title)}
    }
    if (goodbyeData.thumbnail) {
        try {embed.setThumbnail(eval(goodbyeData.thumbnail))}
        catch {embed.setThumbnail(goodbyeData.thumbnail)}
    }
    if (goodbyeData.image) {
        try {embed.setImage(eval(goodbyeData.image))}
        catch {embed.setImage(goodbyeData.image)}
    }
    if (goodbyeData.description) {
        try {embed.setDescription(eval(goodbyeData.description))}
        catch {embed.setDescription(goodbyeData.description)}
    }
    channel.send({content: (member || "0").toString(), embeds: [embed]})
}