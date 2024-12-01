const KitsuneEmbed = require("./KitsuneEmbed");
const {Message, PermissionFlagsBits} = require("discord.js");
const SessionManager = require("./SessionManager");
const config = require("../../Config.json");
const banned_words = config.automod.banned_words;
const exclude_channels = config.automod.exclude_channels;
const exclude_links = config.automod.exclude_links;
const escape = require("markdown-escape");

module.exports = {
	/**
	 * Check if the message has too many mentions.
	 * @param {Message} message The Discord message object you want to check.
	 * @returns An APIEmbedField array.
	 */
	checkMentionSpam: function(message) {
		if (message.mentions.users.size >= 10) return [
			{name: "Lý do:", value: "Ping quá nhiều người trong một tin nhắn"}
		];
		return null;
	},
	/**
	 * Check if the message is consecutive spam.
	 * @param {Message} message The Discord message object you want to check.
	 * @returns An APIEmbedField array.
	 */
	checkMessageSpam: function(message) {
		var threshold = SessionManager.getSessionProp(message.author.id, "messageSpamThreshold") || 0;
		if (new Date().getTime() >= (SessionManager.getSessionProp(message.author.id, "messageSpamTimestamp") || 0)) {
			threshold = 0;
			SessionManager.updateSessionProp(message.author.id, "messageSpamTimestamp", new Date().getTime() + 5000);
		}
		if (threshold >= 7) return [
			{name: "Lý do:", value: "Spam nhiều tin nhắn trong một thời gian ngắn"}
		];
		threshold++;
		SessionManager.updateSessionProp(message.author.id, "messageSpamThreshold", threshold);
		return null;
	},
	/**
	 * Check if the message contains repeated characters.
	 * @param {Message} message The Discord message object you want to check.
	 * @returns An APIEmbedField array.
	 */
	checkMessageRepeat: function(message) {
		var parts = message.content.split("");
		var previousChar = "", cnt = 0;
		for (var i = 0; i < parts.length; i++) {
			var chr = parts[i];
			if (chr != previousChar) cnt = 0;
			else {
				if (cnt >= 15) {
					return [
						{name: "Lý do:", value: "Lặp lại một ký tự liên tiếp quá nhiều lần", inline: false},
						{name: "Đoạn tin nhắn vi phạm:", value: message.content.substring(i - 15, i)}
					];
				}
				cnt++;
			}
			previousChar = chr;
		}
		return null;
	},
	/**
	 * Check if the message contains too many caps.
	 * @param {Message} message The Discord message object you want to check.
	 * @returns An APIEmbedField array.
	 */
	checkAllCaps: function(message) {
		var parts = message.content.replaceAll(" ", "").replace(/[^\w\s]/gi, '').split("");
		var cnt = 0;
		for (var i = 0; i < parts.length; i++) {
			var chr = parts[i];
			if (isNaN(chr) && chr == chr.toUpperCase()) cnt++;
		}
		if (message.content.replaceAll(" ", "").replace(/[^\w\s]/gi, '').length && cnt / message.content.replaceAll(" ", "").replace(/[^\w\s]/gi, '').length >= 0.8) return [
			{name: "Lý do:", value: "Viết hoa quá nhiều chữ cái trong tin nhắn (trên 80%)", inline: false}
		]
		return null;
	},
	/**
	 * Check if the message contains any banned words.
	 * @param {Message} message The Discord message object you want to check.
	 * @returns An APIEmbedField array.
	 */
	checkBannedWords: function(message) {
		var parts = message.content.split(" ");
		for (var i = 0; i < parts.length; i++) {
			var word = parts[i];
			if (banned_words.indexOf(word.toLowerCase()) != -1) return [
				{name: "Lý do:", value: "Có chứa từ cấm", inline: false},
				{name: "Từ cấm vi phạm:", value: word.toLowerCase(), inline: false},
			];
		}
		return null;
	},
	/**
	 * Check if the message contains any links.
	 * @param {Message} message The Discord message object you want to check.
	 * @returns An APIEmbedField array.
	 */
	checkLinks: function(message) {
		var parts = message.content.split(" ");
		for (var i = 0; i < parts.length; i++) {
			var word = parts[i].toLowerCase();
			if (word.includes("http://") || word.includes("https://") || word.includes("//www.")) {
				for (var j = 0; j < exclude_links.length; j++) {
					if (word.includes(exclude_links[j])) return null;
				}
				return [
					{name: "Lý do:", value: "Có chứa liên kết không được phép gửi"}
				];
			}
		}
		return null;
	},
	/**
	 * Check if the message contains any role mentions.
	 * @param {Message} message The Discord message object you want to check.
	 * @returns An APIEmbedField array.
	 */
	checkRoleMention: function(message) {
		var mentions = message.mentions.roles.toJSON(), hasMention = false;
		for (var i = 0; i < mentions.length; i++) {
			if (config.automod.ping_roles.includes(mentions[i].id)) {
				hasMention = true;
				break;
			}
		}
		if (message.mentions.roles.find(role => role.id == config.automod.aov_role)) {
			var aovTimeout = SessionManager.getSessionProp("timeout", "aov_role_mention");
			if ((!isNaN(aovTimeout) && new Date().getTime() < aovTimeout)) return [{name: "Lý do:", value: "Một người khác vừa mới ping role Liên Quân Mobile, hãy đợi ít nhất 15 phút trước khi ping thêm 1 lần nữa"}];
			else {
				SessionManager.updateSessionProp("timeout", "aov_role_mention", new Date().getTime() + 900000);
				var aovRole = message.guild.roles.cache.get(config.automod.aov_role);
				if (!aovRole) return;
				aovRole.setMentionable(false, "[AutoMod] Các member không thể ping role Liên Quân Mobile trong vòng 15 phút sắp tới");
			}
		}
		if (!hasMention) return null;
		var timeout = SessionManager.getSessionProp("timeout", "role_mention");
		if ((!isNaN(timeout) && new Date().getTime() < timeout)) return [{name: "Lý do:", value: "Một người khác vừa mới ping các role ping này, hãy đợi ít nhất 30 phút trước khi ping thêm 1 lần nữa"}];
		else {
			SessionManager.updateSessionProp("timeout", "role_mention", new Date().getTime() + 1800000);
			setTimeout(async function() {
				var roles = config.automod.ping_roles;
				for (var i = 0; i < roles.length; i++) {
					var roleId = roles[i];
					var role = message.guild.roles.cache.get(roleId);
					if (!role && roleId == config.automod.aov_role) return;
					await role.setMentionable(false, "[AutoMod] Các member không thể ping role này trong vòng 30 phút sắp tới");
					await new Promise((resolve, reject) => setTimeout(resolve, 1000));
				}
			}, 0);
		}
		return null;
	},
	/**
	 * Process the message with the specified AutoMod functions.
	 * @param {Message} message The Discord message object.
	 */
	process: function(message) {
		if (!(message.guild?.id)) return true;
		if (message.member.permissions.has(PermissionFlagsBits.ManageGuild)) return true;
		if (exclude_channels.includes(message.channel.id)) return true;
		var conditions = [
			this.checkMentionSpam,
			this.checkMessageRepeat,
			this.checkMessageSpam,
			this.checkBannedWords,
			this.checkLinks,
			this.checkRoleMention
		];
		for (var i = 0; i < conditions.length; i++) {
			var func = conditions[i];
			var res = func(message);
			if (res != null) {
				message.delete();
				message.author.send({embeds: [
					KitsuneEmbed(message.client)
					.setDescription(`Tin nhắn của cậu đã bị xóa bởi AutoMod của ${escape(message.client.user.displayName)} do vi phạm nội quy của **${escape(message.guild.name)}**.`)
					.addFields(
						{name: "Kênh vi phạm:", value: message.channel.toString()},
						{name: "Tin nhắn vi phạm:", value: message.content.length > 1024 ? `${message.content.substring(0, 1021)}...` : message.content}
					)
					.addFields(res)
				], ephemeral: true});
				const logChannel = message.client.channels.cache.get(config.log_channel);
				if (logChannel) logChannel.send({embeds: [
					KitsuneEmbed(message.client)
					.setDescription(`Tin nhắn của **${escape(message.author.displayName)}** (${escape(message.author.username)}) đã bị xóa bởi hệ thống quản lý tự động của ${escape(message.client.user.displayName)} do vi phạm nội quy của **${message.guild.name}**.`)
					.addFields(
						{name: "Kênh vi phạm:", value: message.channel.toString()},
						{name: "Tin nhắn vi phạm:", value: message.content.length > 1024 ? `${message.content.substring(0, 1021)}...` : message.content}
					)
					.addFields(res)
				], ephemeral: true})
				return false;
			}
		}
		return true;
	}
};