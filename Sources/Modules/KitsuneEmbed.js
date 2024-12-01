const { EmbedBuilder, Client } = require("discord.js");
const escape = require("markdown-escape");

/**
 * Create a new embed with the pre-defined embed settings.
 * @param {Client} client The Discord client object.
 * @returns The newly created embed object
 */
module.exports = function(client, footer = true) {
    const embed = new EmbedBuilder().setAuthor({name: escape(client.user.displayName), iconURL: client.user.avatarURL({size: 128})})
    .setColor("Random")
    if (footer) embed.setFooter({text: `Bot developed by ${escape(client.users.cache.get(client.config.owner_id)?.displayName || client.config.fallback_owner_name)}`, iconURL: client.users.cache.get(client.config.owner_id)?.avatarURL({size: 128})}).setTimestamp(new Date());;
    return embed;
}