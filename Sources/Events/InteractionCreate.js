module.exports = (client, interaction) => {
    var interactionType = null;
    Object.keys(client.interactions).forEach(iType => {
        try {
            if (interaction["is" + iType]()) interactionType = iType;
        }
        catch (err) { }
    });
    if (!interactionType) {
        interaction.reply({content: "Có lỗi xảy ra, vui lòng thử lại.", ephemeral: true});
        return console.error("Events/InteractionCreate: Invalid InteractionType");
    }
    try {
        var handler = require("../Interactions/" + interactionType + "/Handler.js");
        if (typeof(handler) != "function") {
            interaction.reply({content: "Có lỗi xảy ra, vui lòng thử lại.", ephemeral: true});
            return console.error("Events/InteractionCreate: Handler script is not a function");
        }
        handler(client, interaction);
    }
    catch (err) {
        interaction.reply({content: "Có lỗi xảy ra, vui lòng thử lại.", ephemeral: true});
        console.error("Events/InteractionCreate: Error occurred while parsing the handler script of InteractionType " + interactionType + "\n", err);
    }
}