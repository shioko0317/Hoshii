const { Client, ModalSubmitInteraction, ActionRowBuilder, ButtonStyle, ButtonBuilder, PermissionFlagsBits } = require("discord.js");
const SessionManager = require("../../Modules/SessionManager");
const KitsuneUtils = require("../../Modules/KitsuneUtils");
const KitsuneEmbed = require("../../Modules/KitsuneEmbed");
const KitsuneTickets = require("../../Modules/KitsuneTickets");

function permission(id) {
    return {
        id,
        allow: [
            PermissionFlagsBits.EmbedLinks,
            PermissionFlagsBits.SendMessages,
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
            var ticket = KitsuneTickets.getTicket(interaction.channel.id);
            if (!ticket) return interaction.editReply({content: "Không tìm thấy dữ liệu của yêu cầu này, cậu hãy liên hệ cho admin để sửa lỗi này nhé.", ephemeral: true});
            await interaction.editReply({content: "🔁 **Đang đóng yêu cầu, vui lòng đợi...**"})
            var creator = client.users.cache.get(ticket.creator);
            if (interaction.user.id != ticket.creator && creator) {
                creator.send({
                    embeds: [
                        KitsuneEmbed(client)
                        .setTitle("Yêu cầu đã bị huỷ")
                        .setDescription("Admin đã huỷ bỏ yêu cầu trợ giúp của cậu.")
                        .addFields(
                            {name: "Yêu cầu cậu đã gửi:", value: ticket.content, inline: false},
                            {name: "Lý do huỷ bỏ yêu cầu:", value: interaction.fields.getTextInputValue("reason"), inline: false}
                        )
                    ]
                });
            }
            KitsuneTickets.deleteTicket(interaction.channel.id);
            interaction.channel.delete();
        }
        catch (err) {
            console.error(err);
            KitsuneUtils.updateInteractionError(interaction, true, true);
        }
    }
}