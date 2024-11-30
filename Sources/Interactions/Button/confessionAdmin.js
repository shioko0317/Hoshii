const { Client, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ThreadAutoArchiveDuration } = require("discord.js");
const SessionManager = require("../../Modules/SessionManager");
const fs = require("fs");
const KitsuneConfessions = require("../../Modules/KitsuneConfessions");
const KitsuneEmbed = require("../../Modules/KitsuneEmbed");
const KitsuneUtils = require("../../Modules/KitsuneUtils");

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
        try {
            var cfsId = interaction.customId.split(".")[3], cfsData = KitsuneConfessions.getConfession(cfsId);
            var content = cfsData.content, image = cfsData.image, sender = cfsData.sender;
            if (SessionManager.getSessionProp(`cfs${cfsId}`, "pending") == 1) return interaction.reply({content: "❌ **Confession này đang trong quá trình được duyệt bởi người khác.**", ephemeral: true});
            if (!content) return interaction.editReply({content: "❌ **Không thể duyệt confession này.**", embeds: [], components: []});
            switch (interaction.customId.split(".")[2]) {
                case "approve": {
                    const confessionChannel = client.channels.cache.get(client.config.confession_channel);
                    if (!confessionChannel) return interaction.update({content: "❌ **ID kênh confession không hợp lệ.**", embeds: [], components: []});
                    SessionManager.updateSessionProp(`cfs${cfsId}`, "pending", 1);
                    await interaction.deferUpdate();
                    await interaction.editReply({content: "🔁 Đang tiến hành duyệt confession, vui lòng đợi...", components: [], embeds: []});
                    const thread = await confessionChannel.threads.create({
                        name: `#himecfs${cfsId}`,
                        autoArchiveDuration: ThreadAutoArchiveDuration.ThreeDays,
                        reason: `Tạo kênh cho confession số ${cfsId}`
                    });
                    var embed = KitsuneEmbed(client, false)
                    .setDescription(content)
                    .setFooter({text: `#himecfs${cfsId}`})
                    .setTimestamp(new Date());
                    if (image) embed.setImage(image);
                    await thread.send({
                        embeds: [embed]
                    });
                    await confessionChannel.send({content: `<@&${client.config.confession_role}> Một thành viên trong server đã gửi confession mới tại kênh ${thread.toString()}.`})
                    interaction.editReply({
                        content: "",
                        embeds: [
                            KitsuneEmbed(client)
                            .setDescription(`${interaction.user.toString()} đã duyệt confession có ID là ${cfsId}.\n${thread.toString()}`)
                            .addFields({
                                name: "Người gửi confession:", value: `||<@${sender}>||`
                            })
                        ],
                        components: []
                    });
                    SessionManager.updateSessionProp("confessions", "cooldown", new Date().getTime() + 1800000);
                    SessionManager.deleteSessionProp(`cfs${cfsId}`, "pending");
                    break;
                }
                case "reject": {
                    await interaction.deferUpdate();
                    await interaction.editReply({content: "🔁 Đang từ chối confession, vui lòng đợi...", components: [], embeds: []});
                    var embed = KitsuneEmbed(client, false)
                    .setAuthor({name: `${interaction.user.username} đã từ chối confession này.`, iconURL: interaction.user.avatarURL({size: 128})})
                    .setDescription(content)
                    .addFields({
                        name: "Người gửi confession:", value: `||<@${sender}>||`
                    })
                    .setTimestamp(new Date());
                    if (image) embed.setImage(image);
                    interaction.editReply({
                        content: "",
                        embeds: [embed],
                        components: []
                    });
                    KitsuneConfessions.deleteConfession(cfsId);
                    break;
                }
                default: {
                    interaction.editReply({content: "❌ **Câu lệnh không xác định.**", embeds: [], components: []});
                    break;
                }
            }
        }
        catch (err) {
            console.error(err);
            KitsuneUtils.updateInteractionError(interaction, false, true);
        }
    }
}