const { Client, Guild } = require("discord.js");
const newEmbed = require("../Modules/KitsuneEmbed");

/**
 * 
 * @param {Client} client 
 * @param {Guild} guild 
 */
module.exports = async function(client, guild) {
    if (guild.id != client.config.guild_id) {
        var exclusiveGuild = client.guilds.cache.get(client.config.guild_id);
        if (guild.systemChannelId) await guild.systemChannel.send({embeds: [
            newEmbed(client)
            .setTitle("Thông Báo Bot Độc Quyền")
            .setDescription(`Bot này là bot độc quyền của ${exclusiveGuild ? `máy chủ **${exclusiveGuild.name}**` : `một máy chủ cố định`}, vì vậy bot không thể hoạt động trên máy chủ này.\nBot sẽ tự động rời khỏi máy chủ này sau khi tin nhắn này được gửi.`)
        ]});
        await guild.leave();
    }
}