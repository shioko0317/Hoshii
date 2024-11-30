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
     * @param {string} id The user ID you want to get.
     */
    initUser: function(id) {
        return {
            id,
            points: 0,
            messages: 0,
            minutes: 0,
            in_voice: false
        }
    },
    /**
     * Get the user data from an user.
     * @param {string} user The user ID you want to get.
     */
    getUser: function(user) {
        return this.getAllUsers()[user] || this.initUser(user);
    },
    /**
     * Get a property from the user data of an user.
     * @param {string} user The user ID you want to get.
     * @param {string} prop The property you want to get.
     */
    getUserProp: function(user, prop) {
        return this.getUser(user)[prop];
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
     * @param {string} id The user you want to update.
     * @param {object} data The updated data of the user.
     */
    updateUser: function(id, data) {
        var user = this.getAllUsers();
        user[id] = data;
        this.updateAllUsers(user);
    },
    /**
     * Update a property of an user's user data.
     * @param {string} user The user you want to update.
     * @param {string} prop The property you want to update.
     * @param {object} data The updated data of the property.
     */
    updateUserProp: function(id, prop, data) {
        var user = this.getUser(id);
        user[prop] = data;
        this.updateUser(id, user);
    },
    /**
     * Delete the user data of an user.
     * @param {string} user The user you want to delete.
     */
    deleteUser: function(id) {
        var user = this.getAllUsers();
        delete user[id];
        this.updateAllUsers(user);
    },
    /**
     * Delete a property from an user's user data.
     * @param {string} user The user you want to update.
     * @param {string} prop The name of the property you want to delete.
     */
    deleteUserProp: function(user, prop) {
        var user = this.getUser(user);
        delete user[prop];
        if (Object.keys(user).length) this.updateUser(user, user);
        else this.deleteUser(user);
    },
    /**
     * Sort the ranking based on conditions
     */
    sort: function(condition = (a, b) => {return b.points - a.points}) {
        return Object.values(this.getAllUsers()).sort(condition);
    },
    /**
     * Give points to an user.
     * @param {string} user The user ID.
     * @param {number} points The amount of points you want to add.
     */
    addPoints: function(user, points) {
        var p = Number(this.getUserProp(user, "points"));
        p += Number(points);
        this.updateUserProp(user, "points", p);
    },
    /**
     * Give message points to an user.
     * @param {string} user The user ID.
     * @param {number} points The amount of points you want to add.
     */
    addMessagePoints: function(user, points) {
        var p = Number(this.getUserProp(user, "messages"));
        p += Number(points);
        this.updateUserProp(user, "messages", p);
    },
    /**
     * Give voice points to an user.
     * @param {string} user The user ID.
     * @param {number} points The amount of points you want to add.
     */
    addVoicePoints: function(user, points) {
        var p = Number(this.getUserProp(user, "minutes"));
        p += Number(points);
        this.updateUserProp(user, "minutes", p);
    }
}