const { Client, Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const newEmbed = require("../Modules/KitsuneEmbed");
const SessionManager = require("../Modules/SessionManager");

module.exports.config = {
    usage: "eval",
    category: "",
    description: "",
    nodm: false,
    memberPermissions: [],
    botPermissions: [],
    ownerOnly: true,
    hideOnHelp: true
}

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 * @param {string[]} args 
 */
module.exports.run = async function(client, message, args) {
    try {
        eval(args.join(" "));
    }
    catch (err) {
        message.reply("```\n" + err.stack + "\n```");
    }
}