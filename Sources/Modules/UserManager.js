const fs = require("fs");
const file = "./users.json";
const {User} = require("discord.js");

module.exports = {
    /**
     * Get all users info from the saved file.
     */
    getAllUsers: function() {
        try {
            return JSON.parse(fs.readFileSync(file).toString());
        }
        catch (err) {
            return {};
        }
    },
    /**
     * Initialize an user data.
     * @param {string} guild The guild ID.
     * @param {string} id The user ID you want to get.
     */
    initUser: function(guild, id) {
        return {
            guild_id: guild,
            id,
            points: 0,
            messages: 0,
            minutes: 0
        }
    },
    /**
     * Get the user data from an user.
     * @param {string} guild The guild ID.
     * @param {string} user The user ID you want to get.
     */
    getUser: function(guild, user) {
        var userId = user;
        user = guild + "_" + user;
        return this.getAllUsers()[user] || this.initUser(guild, userId);
    },
    /**
     * Get a property from the user data of an user.
     * @param {string} guild The guild ID.
     * @param {string} user The user ID you want to get.
     * @param {string} prop The property you want to get.
     */
    getUserProp: function(guild, user, prop) {
        return this.getUser(guild, user)[prop];
    },
    /**
     * Write the user data to the storage file.
     * @param {object} data The updated user data.
     */
    updateAllUsers: function(data) {
        fs.writeFileSync(file, JSON.stringify(data));
    },
    /**
     * Update the user data of an user.
     * @param {string} guild The guild ID.
     * @param {string} id The user you want to update.
     * @param {object} data The updated data of the user.
     */
    updateUser: function(guild, id, data) {
        id = guild + "_" + id;
        var user = this.getAllUsers();
        user[id] = data;
        this.updateAllUsers(user);
    },
    /**
     * Update a property of an user's user data.
     * @param {string} guild The guild ID.
     * @param {string} id The user you want to update.
     * @param {string} prop The property you want to update.
     * @param {object} data The updated data of the property.
     */
    updateUserProp: function(guild, id, prop, data) {
        var user = this.getUser(guild, id);
        user[prop] = data;
        this.updateUser(guild, id, user);
    },
    /**
     * Delete the user data of an user.
     * @param {string} guild The guild ID.
     * @param {string} id The user you want to delete.
     */
    deleteUser: function(guild, id) {
        id = guild + "_" + id;
        var user = this.getAllUsers();
        delete user[id];
        this.updateAllUsers(user);
    },
    /**
     * Delete a property from an user's user data.
     * @param {string} guild The guild ID.
     * @param {string} id The user you want to update.
     * @param {string} prop The name of the property you want to delete.
     */
    deleteUserProp: function(guild, id, prop) {
        var user = this.getUser(guild, id);
        delete user[prop];
        if (Object.keys(user).length) this.updateUser(guild, id, user);
        else this.deleteUser(id);
    },
    /**
     * Sort the ranking based on conditions
     * @param {string} guild The guild ID.
     * @param {function} condition The sort condition.
     */
    sort: function(guild, condition = (a, b) => {return b.points - a.points}) {
        return Object.values(this.getAllUsers()).filter(user => user.guild_id == guild).sort(condition);
    },
    /**
     * Give points to an user.
     * @param {string} guild The guild ID.
     * @param {string} user The user ID.
     * @param {number} points The amount of points you want to add.
     */
    addPoints: function(guild, user, points) {
        var p = Number(this.getUserProp(guild, user, "points"));
        p += Number(points);
        this.updateUserProp(guild, user, "points", p);
    },
    /**
     * Give message points to an user.
     * @param {string} guild The guild ID.
     * @param {string} user The user ID.
     * @param {number} points The amount of points you want to add.
     */
    addMessagePoints: function(guild, user, points) {
        var p = Number(this.getUserProp(guild, user, "messages"));
        p += Number(points);
        this.updateUserProp(guild, user, "messages", p);
    },
    /**
     * Give voice points to an user.
     * @param {string} guild The guild ID.
     * @param {string} user The user ID.
     * @param {number} points The amount of points you want to add.
     */
    addVoicePoints: function(guild, user, points) {
        var p = Number(this.getUserProp(guild, user, "minutes"));
        p += Number(points);
        this.updateUserProp(guild, user, "minutes", p);
    },
    /**
     * Get the different guild list from the users array
     */
    getGuildList: function() {
        return Object.values(this.getAllUsers()).map(user => {return user.guild_id}).filter((value, index, array) => {return array.indexOf(value) == index});
    }
}