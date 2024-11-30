const { PermissionFlagsBits, ChannelType } = require("discord.js");

module.exports = (client, interaction) => {
    var part = interaction.customId.split(".");
    var userId = part[0], commandName = part[1];
    var command = client.interactions.StringSelectMenu.get(commandName);
    if (userId != "0" && interaction.user.id != userId) return interaction.reply({content: interaction.user.toString() + ", cậu không có quyền để nhấn vào nút này. Chỉ có người thực hiện lệnh này, <@" + userId + ">, mới có thể nhấn vào nó.", components: [], embeds: [], ephemeral: true});
    if (!command || !command.config || !command.run) return interaction.update({content: "Không thể tìm thấy câu lệnh này!", components: [], embeds: [], ephemeral: true});
    if (command.config.nodm && (interaction.channel.type == ChannelType.DM || interaction.channel.type == ChannelType.GroupDM)) return interaction.update({content: "Lệnh này không thể được dùng ở kênh Tin nhắn trực tiếp!", components: [], embeds: [], ephemeral: true});
    if (command.config.memberPermissions && command.config.memberPermissions.length) {
        if (interaction.channel.type == ChannelType.DM || interaction.channel.type == ChannelType.GroupDM) return interaction.update({content: "Lệnh này không thể được dùng ở kênh Tin nhắn trực tiếp!", components: [], embeds: [], ephemeral: true});
        for (var i = 0; i < command.config.memberPermissions.length; i++) {
            if (!interaction.member.permissions.has(PermissionFlagsBits[command.config.memberPermissions[i]])) return interaction.update({content: "Cậu không có quyền để thực hiện lệnh này.\nLệnh này yêu cầu cậu cần có những quyền sau đây:\n`" + command.config.memberPermissions.join(", ") + "`", components: [], embeds: [], ephemeral: true});
        }
    }
    if (command.config.botPermissions && command.config.botPermissions.length) {
        if (interaction.channel.type == ChannelType.DM || interaction.channel.type == ChannelType.GroupDM) return interaction.update({content: "Lệnh này không thể được dùng ở kênh Tin nhắn trực tiếp!", components: [], embeds: [], ephemeral: true});
        for (var i = 0; i < command.config.botPermissions.length; i++) {
            if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits[command.config.botPermissions[i]])) return interaction.update({content: "Bot không có quyền để thực hiện lệnh này.\nLệnh này yêu cầu bot cần có những quyền sau đây:\n`" + command.config.botPermissions.join(", ") + "`", components: [], embeds: [], ephemeral: true});
        }
    }
    if (command.config.ownerOnly && interaction.user.id != client.config.owner_id) return interaction.update({content: "Chỉ có chủ sở hữu bot mới có thể sử dụng lệnh này.", components: [], embeds: [], ephemeral: true});
    command.run(client, interaction);
}