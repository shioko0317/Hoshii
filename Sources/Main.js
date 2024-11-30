require("dotenv").config();
const { Client, GatewayIntentBits, Events, EmbedBuilder, Embed } = require("discord.js");
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

client.interactions = new InteractionManager("./Sources/Interactions");
client.commandManager = new CommandManager("./Sources/Commands");
client.commands = client.commandManager.commands;
client.config = require("../Config.json");

client.hoshiiWait = async function(ms) {
    return new Promise((resolve, reject) => setTimeout(resolve), ms);
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