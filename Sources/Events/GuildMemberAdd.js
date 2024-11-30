const { Client, GuildMember } = require("discord.js");
const KitsuneEmbed = require("../Modules/KitsuneEmbed");

/**
 * 
 * @param {Client} client 
 * @param {GuildMember} member 
 */
module.exports = async function(client, member) {
    var welcomeData = client.config.welcome, channel = client.channels.cache.get(welcomeData.channel), verifyChannel = client.channels.cache.get(client.config.verify_channel);
    if (!channel) return;
    const embed = KitsuneEmbed(client)
    .setAuthor({name: member.guild.name, iconURL: member.guild.iconURL({size: 128})});
    if (welcomeData.title) {
        try {embed.setTitle(eval(welcomeData.title))}
        catch {embed.setTitle(welcomeData.title)}
    }
    if (welcomeData.thumbnail) {
        try {embed.setThumbnail(eval(welcomeData.thumbnail))}
        catch {embed.setThumbnail(welcomeData.thumbnail)}
    }
    if (welcomeData.image) {
        try {embed.setImage(eval(welcomeData.image))}
        catch {embed.setImage(welcomeData.image)}
    }
    if (welcomeData.description) {
        try {embed.setDescription(eval(welcomeData.description))}
        catch {embed.setDescription(welcomeData.description)}
    }
    channel.send({content: (member || "0").toString(), embeds: [embed]});
    if (verifyChannel) {
        var msg = await verifyChannel.send({
            content: (member || "0").toString()
        });
        setTimeout(() => msg.delete(), 500);
    }
}