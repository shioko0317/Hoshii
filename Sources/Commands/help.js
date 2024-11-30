const { Client, Message, EmbedBuilder } = require("discord.js");
const newEmbed = require("../Modules/KitsuneEmbed");

module.exports.config = {
    usage: "help (tên câu lệnh)",
    category: "🤖 Cơ bản",
    description: "Xem danh sách câu lệnh của bot hoặc thông tin một câu lệnh bất kỳ.",
    nodm: false,
    memberPermissions: [],
    botPermissions: [],
    ownerOnly: false
}

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 * @param {string[]} args 
 */
module.exports.run = async function(client, message, args) {
    if (args[0]) {
        var command = client.commands.get(args[0].toLowerCase());
        if (!command || !command.config || command.config.hideOnHelp) return message.reply({content: `**❌ Không thể tìm thấy câu lệnh \`${args[0].toLowerCase()}\`.**`});
        message.reply({embeds: [
            newEmbed(client)
            .setTitle(`Câu lệnh ${args[0].toLowerCase()}`)
            .addFields(
                {name: "Mô tả:", value: `${command.config.description}`, inline: false},
                {name: "Cách sử dụng:", value: `\`${client.config.prefix}${command.config.usage}\``, inline: false}
            )
        ]})
        return;
    }
    var categories = {};
    client.commands.forEach((command, commandName) => {
        var category = command.config.category;
        if (!category || command.config.hideOnHelp) return;
        if (!categories[category]) categories[category] = [];
        categories[category].push(commandName);
    });
    var categoriesArr = Object.keys(categories);
    const embed = newEmbed(client)
    .setTitle("Danh sách câu lệnh")
    .setDescription(`Sử dụng câu lệnh \`${client.config.prefix}help (tên câu lệnh)\` để xem hướng dẫn về một câu lệnh cụ thể.\nMột số câu lệnh sẽ chỉ hỗ trợ sử dụng trên bảng Câu Lệnh Ứng Dụng (Slash Commands) mà không xuất hiện ở danh sách này.`);
    for (var category of categoriesArr) {
        var commands = categories[category];
        embed.addFields({name: category, value: commands.join("\n"), inline: true})
    }
    message.reply({embeds: [embed]});
}