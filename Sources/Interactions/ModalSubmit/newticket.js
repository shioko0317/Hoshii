const { Client, ModalSubmitInteraction, ActionRowBuilder, ButtonStyle, ButtonBuilder, PermissionFlagsBits } = require("discord.js");
const SessionManager = require("../../Modules/SessionManager");
const KitsuneUtils = require("../../Modules/KitsuneUtils");
const KitsuneEmbed = require("../../Modules/KitsuneEmbed");
const KitsuneTickets = require("../../Modules/KitsuneTickets");

function permission(id) {
    return {
        id,
        allow: [
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.EmbedLinks,
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.AttachFiles
        ]
    }
}

module.exports = {
    config: {
        nodm: true,
        memberPermissions: [],
        botPermissions: ["ManageChannels", "ManageRoles"],
        ownerOnly: false
    },
    /**
     * 
     * @param {Client} client 
     * @param {ModalSubmitInteraction} interaction 
     */
    run: async (client, interaction) => {
        await interaction.deferReply({ephemeral: true});
        try {
            var permissions = [];
            permissions.push(permission(interaction.user.id), {
                id: interaction.guild.id,
                deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]
            });
            permissions = permissions.concat(client.config.tickets.moderator_roles.map(roleId => {return permission(roleId)}));
            const ticketChannel = await interaction.guild.channels.create({
                name: `📩・support・${interaction.member.displayName.replace(" ", "・").substring(0, 15).toLowerCase()}`,
                reason: `Tạo kênh yêu cầu hỗ trợ cho ${interaction.member.displayName}`,
                permissionOverwrites: permissions,
                parent: client.config.tickets.category_id
            });
            KitsuneTickets.updateTicket(ticketChannel.id, {
                creator: interaction.user.id,
                content: interaction.fields.getTextInputValue("content")
            });
            await ticketChannel.send({
                content: client.config.tickets.moderator_roles.map(roleId => {return `<@&${roleId}>`}).concat([interaction.user.toString()]).join(" "),
                embeds: [
                    KitsuneEmbed(client)
                    .setTitle("Yêu cầu hỗ trợ")
                    .addFields(
                        {name: "Người tạo yêu cầu:", value: interaction.user.toString(), inline: false},
                        {name: "Nội dung yêu cầu:", value: interaction.fields.getTextInputValue("content"), inline: false}
                    )
                ],
                components: [
                    new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                        .setCustomId("0.closeticket")
                        .setEmoji("❎")
                        .setStyle(ButtonStyle.Primary)
                        .setLabel("Đóng yêu cầu")
                    )
                ]
            });
            interaction.editReply({content: "✅ **Đã tạo yêu cầu thành công rồi nè. Các admin sẽ trả lời yêu cầu của cậu trong thời gian sớm nhất nhé.**"})
        }
        catch (err) {
            console.error(err);
            KitsuneUtils.updateInteractionError(interaction, true, true);
        }
    }
}