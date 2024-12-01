const {REST, Routes, Client, ActivityType, User, ChannelType } = require('discord.js');
const SessionManager = require("../Modules/SessionManager");
const UserManager = require('../Modules/UserManager');

/**
 * 
 * @param {Client} client 
 */
module.exports = async (client) => {
    console.log("Bot đã được khởi động. Tag: " + client.user.tag);
    const commands = client.interactions.toJSON();
    const rest = new REST({
        version: '10'
    }).setToken(process.env.token);
    (async () => {
        try {
            console.log('Đã làm mới danh sách câu lệnh (/) thành công.');
            await rest.put(Routes.applicationCommands(client.user.id), {
                body: commands
            });
        } catch (error) {
            console.error(error);
        }
    })();

    client.user.setActivity({
        type: ActivityType.Watching,
        name: "The Princess of the Star"
    });
    setInterval(() => {
        client.user.setActivity({
            type: ActivityType.Watching,
            name: "The Princess of the Star"
        });
    }, 10000);
    var guild = client.guilds.cache.get(client.config.guild_id);
    setInterval(async () => {
        var roleTimeout = SessionManager.getSessionProp("timeout", "role_mention");
        if (!isNaN(roleTimeout) && new Date().getTime() >= roleTimeout) {
            SessionManager.deleteSessionProp("timeout", "role_mention");
            var roles = client.config.automod.ping_roles;
            for (var i = 0; i < roles.length; i++) {
                var roleId = roles[i];
                var role = guild.roles.cache.get(roleId);
                if (!role) return;
                await role.setMentionable(true, "[AutoMod] Hết countdown 30 phút, các member đã có thể ping lại role này");
                await client.hoshiiWait(1000);
            }
        }
        var aovRoleTimeout = SessionManager.getSessionProp("timeout", "aov_role_mention");
        if (!isNaN(aovRoleTimeout) && new Date().getTime() >= aovRoleTimeout) {
            SessionManager.deleteSessionProp("timeout", "aov_role_mention");
            var aovRole = guild.roles.cache.get(client.config.automod.aov_role);
            if (!aovRole) return;
            aovRole.setMentionable(true, "[AutoMod] Hết countdown 15 phút, các member đã có thể ping lại role này");
        }
    }, 5000);
    const guilds = UserManager.getGuildList();
    guilds.forEach(guildId => {
        var guild = client.guilds.cache.get(guildId);
        if (!guild) return;
        const channels = guild.channels.cache.filter(channel => (channel.type == ChannelType.GuildVoice && channel.members?.size));
        channels.forEach(channel => {
            channel.members.forEach(member => client.setVoiceInterval(member));
        });
    });
};