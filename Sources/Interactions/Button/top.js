const { Client, ButtonInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const UserManager = require("../../Modules/UserManager");
const KitsuneEmbed = require("../../Modules/KitsuneEmbed");
const escape = require("markdown-escape");

module.exports = {
    config: {
        nodm: true,
        memberPermissions: [],
        botPermissions: [],
        ownerOnly: false
    },
    /**
     * 
     * @param {Client} client 
     * @param {ButtonInteraction} interaction 
     */
    run: async (client, interaction) => {
        var conditions = {
            messages: (a, b) => {return b.messages - a.messages},
            voice: (a, b) => {return b.minutes - a.minutes}
        }, vocab = {
            points: "tổng điểm",
            messages: "điểm tin nhắn",
            voice: "điểm voice"
        };
        var rankType = interaction.customId.split(".")[2];
        var ranking = UserManager.sort(interaction.guild.id, conditions[rankType]);
        const embed = KitsuneEmbed(client)
        .setAuthor({name: interaction.guild.name, iconURL: interaction.guild.iconURL({size: 256})})
        .setTitle(`Bảng xếp hạng theo ${vocab[rankType]}`);
        for (var i = 0; i < Math.min(ranking.length, 10); i++) {
            var info = ranking[i];
            var member = interaction.guild.members.cache.find(mem => mem.user.id == info.id), user = member ? member.user : client.users.cache.get(info.id);
            embed.addFields({
                name: `#${i + 1}: ${escape(member ? member.displayName : (user ? user.displayName : "Member không xác định"))}`,
                value: `**Tổng điểm:** ${(info.points || 0).toLocaleString()} / **Điểm tin nhắn:** ${(info.messages || 0).toLocaleString()} / **Điểm voice:** ${(info.minutes || 0).toLocaleString()}`
            });
        }
        var member = interaction.member, user = interaction.user,
            rank = ranking.map(user => {return user.id}).indexOf(user.id),
            info = UserManager.getUser(interaction.guild.id, user.id);
        if (rank != -1 && rank > 9) embed.addFields({
            name: `#${rank + 1}: ${escape(member ? member.displayName : (user ? user.displayName : "Member không xác định"))}`,
            value: `**Tổng điểm:** ${(info.points || 0).toLocaleString()} / **Điểm tin nhắn:** ${(info.messages || 0).toLocaleString()} / **Điểm voice:** ${(info.minutes || 0).toLocaleString()}`
        });
        interaction.update({
            embeds: [embed],
            components: [
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId(`${interaction.user.id}.top.points`)
                    .setDisabled(rankType == "points")
                    .setStyle(ButtonStyle.Primary)
                    .setLabel("Điểm"),
                    new ButtonBuilder()
                    .setCustomId(`${interaction.user.id}.top.messages`)
                    .setDisabled(rankType == "messages")
                    .setStyle(ButtonStyle.Primary)
                    .setLabel("Điểm tin nhắn"),
                    new ButtonBuilder()
                    .setCustomId(`${interaction.user.id}.top.voice`)
                    .setDisabled(rankType == "voice")
                    .setStyle(ButtonStyle.Primary)
                    .setLabel("Điểm voice")
                )
            ]
        });
    }
}