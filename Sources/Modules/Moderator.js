const KitsuneEmbed = require("./KitsuneEmbed");
const {Message, Client, TextChannel, GuildMember, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const SessionManager = require("./SessionManager");
const config = require("../../Config.json");
const databaseFolder = "./database";
const fs = require("fs");
const ms = require("ms");
const escape = require("markdown-escape");

module.exports = {
	/**
	 * @param {bigint} permission
	 * @param {Message} message
	 * @param {GuildMember} member
	 * @param {boolean} auto
	 */
	checkPermissions: function(permission, message, member, auto = false) {
		if (!message.member || !member) {
			message.reply({content: "❌ **Không tìm thấy dữ liệu của member này.**", ephemeral: true});
			return false;
		}
		if (auto) return true;
		if (typeof(member) == "object" && message.member.user.id == member.user.id) {
			message.reply({content: "❌ **Cậu không thể thực hiện hành động này với chính mình.**", ephemeral: true});
			return false;
		}
		if (typeof(member) == "object" && member.user.id == message.client.user.id) {
			message.reply({content: "❌ **Cậu không thể thực hiện hành động này với bot.**", ephemeral: true});
			return false;
		}
		if (!message.member.permissions.has(permission)) {
			message.reply({content: "❌ **Cậu không có đủ quyền để thực hiện lệnh này.**", ephemeral: true});
			return false;
		}
		if (!message.guild.members.me.permissions.has(permission)) {
			message.reply({content: "❌ **Bot không có đủ quyền để thực hiện lệnh này.**", ephemeral: true});
			return false;
		}
		if (typeof(member) == "object" && message.guild.ownerId != message.member.user.id && message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) {
			message.reply({content: "❌ **Chức vụ của cậu thấp hơn chức vụ của member này.**", ephemeral: true});
			return false;
		}
		if (typeof(member) == "object" && message.guild.members.me.roles.highest.comparePositionTo(member.roles.highest) <= 0) {
			message.reply({content: "❌ **Chức vụ của bot thấp hơn chức vụ của member này.**", ephemeral: true});
			return false;
		}
		return true;
	},
	/**
	 * @param {Client} client
	 * @returns {TextChannel?}
	 */
	getViolationChannel: function(client) {
		return client.channels.cache.get(config.moderation.violation_channel);
	},
	penaltyDB: {
		databaseFile: `${databaseFolder}/penalties.json`,
		getAll: function() {
			var res = {};
			try {
				res = JSON.parse(fs.readFileSync(this.databaseFile).toString());
			}
			catch {}
			return res;
		},
		get: function(id) {
			return this.getAll()[id];
		},
		filter: function(condition) {
			return Object.values(this.getAll()).filter(condition);
		},
		filterByUser: function(userId) {
			return this.filter(penalty => penalty.member == userId);
		},
		setAll: function(data) {
			fs.writeFileSync(this.databaseFile, JSON.stringify(data));
		},
		set: function(id, data) {
			var tmp = this.getAll();
			tmp[id] = data;
			this.setAll(tmp);
		}
	},
	/**
	 * @param {Message} message
	 * @param {GuildMember} member
	 * @param {string} reason
	 * @param {boolean} auto
	 */
	warn: async function(message, member, reason, auto = false) {
		if (!this.checkPermissions(PermissionFlagsBits.KickMembers, message, member, auto)) return false;
		var client = message.client;
		var penaltyId = Math.floor(Math.random() * 89999999) + 10000000;
		this.penaltyDB.set(penaltyId, {
			id: penaltyId,
			type: "warn",
			author: message.member.user.id,
			member: member.user.id,
			reason,
			timestamp: new Date().getTime()
		});
		var author = auto ? client.user : message.member.user;
		var violationChannel = this.getViolationChannel(client);
		if (violationChannel) {
			var embed = KitsuneEmbed(client, false)
			.setAuthor({name: escape(author.displayName), iconURL: author.avatarURL({size: 128})})
			.setDescription(`Đã warn một member.`);
			embed.addFields(
				{name: "Member bị warn:", value: `${member.toString()} (\`${member.user.username}\`)`, inline: true},
				{name: "Lý do:", value: reason || "Không có", inline: true}
			).setFooter({text: `ID penalty: ${penaltyId}. Lần warn này sẽ được ghi vào lịch sử "tiền án" của member đó trong server.`})
			.setTimestamp(new Date());
			await violationChannel.send({embeds: [embed]});
		}
		try {
			var embed = KitsuneEmbed(client, false)
			.setAuthor({name: escape(author.displayName), iconURL: author.avatarURL({size: 128})})
			.setDescription(`**${escape(auto ? "AutoMod của bot" : message.member.displayName)}** vừa warn cậu tại server ${message.guild.name}.`);
			embed.addFields({name: "Lý do:", value: reason || "Không có"}).setFooter({text: `ID penalty: ${penaltyId}. Lần warn này sẽ được ghi vào lịch sử "tiền án" của cậu trong server.`})
			.setTimestamp(new Date());
			await member.send({embeds: [embed]});
		}
		catch (err) {
			console.error(err);
		}
		message.reply({content: `✅ **Đã warn ${escape(member.displayName)} thành công, xem chi tiết lệnh warn tại kênh ${violationChannel.toString()}.**`})
		return true;
	},
	/**
	 * @param {Message} message
	 * @param {GuildMember} member
	 * @param {string} duration
	 * @param {string} reason
	 * @param {boolean} auto
	 */
	mute: async function(message, member, duration, reason, auto = false) {
		if (!this.checkPermissions(PermissionFlagsBits.KickMembers, message, member, auto)) return false;
		if (member.communicationDisabledUntil && new Date().getTime() < member.communicationDisabledUntilTimestamp) {
			message.reply({content: `❌ **Thành viên này đã bị mute từ trước.**`, ephemeral: true});
			return false;
		}
		member.timeout(duration ? ms(duration) : (28 * 86400000), `[${message.member.displayName}] ${reason || "Không có lý do cụ thể"}`);
		var client = message.client;
		var penaltyId = Math.floor(Math.random() * 89999999) + 10000000;
		this.penaltyDB.set(penaltyId, {
			id: penaltyId,
			type: "mute",
			author: message.member.user.id,
			member: member.user.id,
			reason,
			duration: duration || "28d",
			timestamp: new Date().getTime()
		});
		var author = auto ? client.user : message.member.user;
		var violationChannel = this.getViolationChannel(client);
		if (violationChannel) {
			var embed = KitsuneEmbed(client, false)
			.setAuthor({name: escape(author.displayName), iconURL: author.avatarURL({size: 128})})
			.setDescription(`Đã mute một member.`);
			embed.addFields(
				{name: "Member bị mute:", value: `${member.toString()} (\`${member.user.username}\`)`, inline: true},
				{name: "Thời hạn:", value: duration || "28 ngày (tối đa)", inline: true},
				{name: "Lý do:", value: reason || "Không có", inline: true}
			).setFooter({text: `ID penalty: ${penaltyId}. Lần mute này sẽ được ghi vào lịch sử "tiền án" của member đó trong server.`})
			.setTimestamp(new Date());
			await violationChannel.send({embeds: [embed]});
		}
		try {
			var embed = KitsuneEmbed(client, false)
			.setAuthor({name: escape(author.displayName), iconURL: author.avatarURL({size: 128})})
			.setDescription(`**${auto ? "AutoMod của bot" : message.member.displayName}** vừa mute cậu tại server ${message.guild.name}.`);
			embed.addFields(
				{name: "Thời hạn:", value: duration || "28 ngày (tối đa)", inline: true},
				{name: "Lý do:", value: reason || "Không có", inline: true},
			)
			.setFooter({text: `ID penalty: ${penaltyId}. Lần mute này sẽ được ghi vào lịch sử "tiền án" của cậu trong server.`})
			.setTimestamp(new Date());
			await member.send({embeds: [embed]});
		}
		catch (err) {
			console.error(err);
		}
		message.reply({content: `✅ **Đã mute ${escape(member.displayName)} thành công, xem chi tiết lệnh mute tại kênh ${violationChannel.toString()}.**`})
		return true;
	},
	/**
	 * @param {Message} message
	 * @param {GuildMember} member
	 */
	unmute: async function(message, member) {
		if (!this.checkPermissions(PermissionFlagsBits.KickMembers, message, member, false)) return false;
		if (!member.communicationDisabledUntil || new Date().getTime() >= member.communicationDisabledUntilTimestamp) {
			message.reply({content: `❌ **Thành viên này không bị mute.**`, ephemeral: true});
			return false;
		}
		await member.timeout(null);
		message.reply({content: `✅ **Đã bỏ mute ${escape(member.displayName)} thành công.**`});
		return true;
	},
	/**
	 * @param {Message} message
	 * @param {GuildMember} member
	 * @param {string} reason
	 * @param {boolean} auto
	 */
	kick: async function(message, member, reason, auto = false) {
		if (!this.checkPermissions(PermissionFlagsBits.KickMembers, message, member, auto)) return false;
		member.kick(`[${message.member.displayName}] ${reason || "Không có lý do cụ thể"}`);
		var client = message.client;
		var penaltyId = Math.floor(Math.random() * 89999999) + 10000000;
		this.penaltyDB.set(penaltyId, {
			id: penaltyId,
			type: "kick",
			author: message.member.user.id,
			member: member.user.id,
			reason,
			timestamp: new Date().getTime()
		});
		var author = auto ? client.user : message.member.user;
		var violationChannel = this.getViolationChannel(client);
		if (violationChannel) {
			var embed = KitsuneEmbed(client, false)
			.setAuthor({name: escape(author.displayName), iconURL: author.avatarURL({size: 128})})
			.setDescription(`Đã kick một member.`);
			embed.addFields(
				{name: "Member bị kick:", value: `${member.toString()} (\`${member.user.username}\`)`, inline: true},
				{name: "Lý do:", value: reason || "Không có", inline: true}
			).setFooter({text: `ID penalty: ${penaltyId}. Lần kick này sẽ được ghi vào lịch sử "tiền án" của member đó trong server.`})
			.setTimestamp(new Date());
			await violationChannel.send({embeds: [embed]});
		}
		try {
			var embed = KitsuneEmbed(client, false)
			.setAuthor({name: escape(author.displayName), iconURL: author.avatarURL({size: 128})})
			.setDescription(`**${escape(auto ? "AutoMod của bot" : message.member.displayName)}** vừa kick cậu tại server ${message.guild.name}.`);
			embed.addFields({name: "Lý do:", value: reason || "Không có"}).setFooter({text: `ID penalty: ${penaltyId}. Lần kick này sẽ được ghi vào lịch sử "tiền án" của cậu trong server.`})
			.setTimestamp(new Date());
			await member.send({embeds: [embed]});
		}
		catch (err) {
			console.error(err);
		}
		message.reply({content: `✅ **Đã kick ${escape(member.displayName)} thành công, xem chi tiết lệnh kick tại kênh ${violationChannel.toString()}.**`})
		return true;
	},
	/**
	 * @param {Message} message
	 * @param {GuildMember} member
	 * @param {string} reason
	 * @param {boolean} auto
	 */
	ban: async function(message, member, reason, auto = false) {
		if (!this.checkPermissions(PermissionFlagsBits.BanMembers, message, member, auto)) return false;
		var user = ((typeof(member) == "string") ? message.client.users.cache.get(member) : member.user);
		try {
			var ban = await message.guild.bans.fetch(member);
			if (ban) {
				message.reply({content: `❌ **Thành viên này đã bị ban từ trước.**`, ephemeral: true});
				return false;
			}
		}
		catch {}
		await message.guild.bans.create(member, {
			reason: `[${message.member.displayName}] ${reason || "Không có lý do cụ thể"}`,
			deleteMessageSeconds: 604800
		});
		var client = message.client;
		var penaltyId = Math.floor(Math.random() * 89999999) + 10000000;
		this.penaltyDB.set(penaltyId, {
			id: penaltyId,
			type: "ban",
			author: user.id,
			member: user ? user.id : member,
			reason,
			timestamp: new Date().getTime()
		});
		var author = auto ? client.user : message.member.user;
		var violationChannel = this.getViolationChannel(client);
		if (violationChannel) {
			var embed = KitsuneEmbed(client, false)
			.setAuthor({name: escape(author.displayName), iconURL: author.avatarURL({size: 128})})
			.setDescription(`Đã ban một member.`);
			embed.addFields(
				{name: "Member bị ban:", value: `${user ? `${user.toString()} (\`${user.username}\`)` : `Một member nào đó\n**ID:** ${member}`}`, inline: true},
				{name: "Lý do:", value: reason || "Không có", inline: true}
			).setFooter({text: `ID penalty: ${penaltyId}. Lần ban này sẽ được ghi vào lịch sử "tiền án" của member đó trong server.`})
			.setTimestamp(new Date());
			await violationChannel.send({embeds: [embed]});
		}
		try {
			if (user) {
				var embed = KitsuneEmbed(client, false)
				.setAuthor({name: escape(author.displayName), iconURL: author.avatarURL({size: 128})})
				.setDescription(`**${escape(auto ? "AutoMod của bot" : message.member.displayName)}** vừa ban cậu tại server ${message.guild.name}.`);
				embed.addFields({name: "Lý do:", value: reason || "Không có"}).setFooter({text: `ID penalty: ${penaltyId}. Lần ban này sẽ được ghi vào lịch sử "tiền án" của cậu trong server.`})
				.setTimestamp(new Date());
				await user.send({embeds: [embed]});
			}
		}
		catch (err) {
			console.error(err);
		}
		message.reply({content: `✅ **Đã ban ${escape(user ? user.displayName : "người dùng với ID trên")} thành công, xem chi tiết lệnh ban tại kênh ${violationChannel.toString()}.**`})
		return true;
	},
	/**
	 * @param {Message} message
	 * @param {GuildMember} member
	 */
	unban: async function(message, member) {
		if (!this.checkPermissions(PermissionFlagsBits.BanMembers, message, member, false)) return false;
		try {
			var ban = await message.guild.bans.fetch(member);
			if (!ban) {
				message.reply({content: `❌ **Thành viên này không bị ban.**`, ephemeral: true});
				return false;
			}
		}
		catch {
			message.reply({content: `❌ **Thành viên này không bị ban.**`, ephemeral: true});
			return false;
		}
		var user = ((typeof(member) == "string") ? message.client.users.cache.get(member) : member.user);
		await message.guild.bans.remove(member);
		message.reply({content: `✅ **Đã unban ${escape(user ? user.displayName : "người dùng với ID trên")} thành công.**`})
		return true;
	},
	/**
	 * @param {Message} message
	 * @param {GuildMember} member
	 */
	displayPenalties: function(message, update = false) {
		if (!message.author) message.author = message.user;
		var user = message.client.users.cache.get(SessionManager.getSessionProp(message.author.id, "penalties_user")), page = SessionManager.getSessionProp(message.author.id, "penalties_page");
		if (!page || !user) {
			if (update) message.update({content: "❌ **Lệnh này đã hết hạn, hãy thực hiện lại 1 lệnh mới.**", components: [], embeds: []});
			else message.reply({content: "❌ **Có lỗi xảy ra, vui lòng thử lại.**", components: [], embeds: [], ephemeral: true});
		}
		var penalties = this.penaltyDB.filterByUser(user.id);
		const embed = KitsuneEmbed(message.client)
		.setAuthor({name: escape(user.displayName), iconURL: user.avatarURL({size: 128})})
		.setTitle(`Danh sách "tiền án tiền sự"`)
		.setDescription(`Member này có tổng cộng ${penalties.length} lần bị xử phạt.`)
		.setFooter({text: `Trang ${page} trong số ${Math.ceil(penalties.length / 10)}`});
		for (var i = (page - 1) * 10; i < page * 10; i++) {
			if (!penalties[i]) continue;
			var penalty = penalties[i];
			embed.addFields({
				name: new Date(penalty.timestamp).toLocaleString("vi-VN"),
				value: `* **ID penalty:** ${penalty.id}\n* **Người thực hiện:** <@${penalty.author}>\n* **Hình phạt:** \`${penalty.type}\`${(penalty.type == "mute") ? `\n* **Thời hạn:** ${penalty.duration || "Không có"}` : ``}\n* **Lý do:** ${penalty.reason || "Không có"}`
			});
		}
		var row = new ActionRowBuilder()
		.addComponents(
			new ButtonBuilder()
			.setCustomId(`${message.author.id}.penalties.prev`)
			.setDisabled(page <= 1)
			.setStyle(ButtonStyle.Primary)
			.setEmoji("◀️"),
			new ButtonBuilder()
			.setCustomId(`${message.author.id}.penalties.next`)
			.setDisabled(page >= Math.ceil(penalties.length / 10))
			.setStyle(ButtonStyle.Primary)
			.setEmoji("▶️")
		);
		var obj = {
			embeds: [embed],
			components: [row],
			ephemeral: true
		};
		if (update) message.update(obj);
		else message.reply(obj);
	}
};