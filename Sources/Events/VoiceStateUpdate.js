const {Client, VoiceState} = require("discord.js");
const UserManager = require("../Modules/UserManager");

/**
 * 
 * @param {Client} client 
 * @param {VoiceState} oldState 
 * @param {VoiceState} newState 
 */
module.exports = function(client, oldState, newState) {
    if (!oldState.member || !newState.member || oldState.member.id != newState.member.id) return;
    var member = newState.member;
    if (newState.channel && (!oldState.channel?.guild || oldState.channel.guild.id != newState.channel.guild.id)) client.setVoiceInterval(member);
    else if (oldState.channel && (!newState.channel?.guild || oldState.channel.guild.id != newState.channel.guild.id)) client.deleteVoiceInterval(member);
}