require("dotenv").config();
const { Client, GatewayIntentBits, Events, EmbedBuilder, Embed, GuildMember, VoiceChannel } = require("discord.js");
const client = new Client({intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations
], disableEveryone: false});
const fs = require("fs");

var files = ["confessions", "sessions", "tickets", "menus", "users"];
for (var i = 0; i < files.length; i++) {
    if (!fs.existsSync(`${files[i]}.json`)) fs.writeFileSync(`${files[i]}.json`, "{}");
}

const path = require("path");
const InteractionManager = require("./Modules/InteractionManager");
const CommandManager = require("./Modules/CommandManager");
const UserManager = require("./Modules/UserManager");

client.interactions = new InteractionManager("./Sources/Interactions");
client.commandManager = new CommandManager("./Sources/Commands");
client.commands = client.commandManager.commands;
client.config = require("../Config.json");
client.voiceInterval = {};

/**
 * 
 * @param {GuildMember} member 
 * @param {VoiceChannel} channel 
 * @param {string} voiceId 
 */
client.setVoiceInterval = function(member) {
    var guild = member.guild, user = member.user, voiceId = `${guild.id}_${user.id}`;
    UserManager.updateUserProp(guild.id, user.id, "in_voice", true);
    if (!client.voiceInterval[voiceId]) client.voiceInterval[voiceId] = setInterval((function(guild, user, voiceId) {
        client.addPoints(guild.id, user.id, client.config.scoring.voice_mins_multiplier);
        UserManager.addVoicePoints(guild.id, user.id, 1);
    }).bind(this, guild, user), 60000);
}

client.deleteVoiceInterval = function(member) {
    var guild = member.guild, user = member.user, voiceId = `${guild.id}_${user.id}`;
    UserManager.updateUserProp(guild.id, user.id, "in_voice", false);
    clearInterval(client.voiceInterval[voiceId]);
    delete client.voiceInterval[voiceId];
}

client.hoshiiWait = async function(ms) {
    return new Promise((resolve, reject) => setTimeout(resolve), ms);
}

client.addPoints = function(guildId, userId, points) {
    UserManager.addPoints(guildId, userId, points);
    var points = Number(UserManager.getUserProp(guildId, userId, "points"));
    var roles = client.config.scoring.roles;
    for (var i = 0; i < roles.length; i++) {
        var roleInfo = roles[i];
        var role = client.guilds.cache.get(guildId)?.roles.cache.get(roleInfo.id),
            member = client.guilds.cache.get(guildId)?.members.cache.find(m => m.user.id == userId);
        if (role && member && points >= roleInfo.points_requirement && !member.roles.cache.get(role.id)) {
            member.roles.add(role, `Đã đủ yêu cầu để nhận role tự động (${roleInfo.points_requirement} điểm trở lên)`);
        }
    }
}

fs.readdirSync(path.resolve("./Sources/Events")).filter(f => f.endsWith(".js")).forEach(event => {
    try {
        var eventData = require(path.join(path.resolve("./Sources/Events"), event));
        if (!eventData) console.error("Cannot load Event " + event + ": Event data not found");
        client.on(Events[event.substring(0, event.indexOf(".js"))], eventData.bind(null, client));
        console.log("Loaded Event " + event.substring(0, event.indexOf(".js")));
    }
    catch (err) {
        console.error("Cannot load Event " + event.substring(0, event.indexOf(".js")) + ":\n", err);
    }
})

client.login(process.env.token);

process
  .on('unhandledRejection', (reason, p) => console.error(reason, 'Unhandled Rejection at Promise', p))
  .on('uncaughtException', err => console.error(err, 'Uncaught Exception thrown'));