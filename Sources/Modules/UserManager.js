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
     * Get the user data from an user.
     * @param {string} user The user ID you want to get.
     */
    getUser: function(user) {
        return this.getAllUsers()[user] || {};
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
     * @param {string} user The user you want to update.
     * @param {object} data The updated data of the user.
     */
    updateUser: function(user, data) {
        var user = this.getAllUsers();
        user[user] = data;
        this.updateAllUsers(user);
    },
    /**
     * Update a property of an user's user data.
     * @param {string} user The user you want to update.
     * @param {string} prop The property you want to update.
     * @param {object} data The updated data of the property.
     */
    updateUserProp: function(user, prop, data) {
        var user = this.getUser(user);
        user[prop] = data;
        this.updateUser(user, user);
    },
    /**
     * Delete the user data of an user.
     * @param {string} user The user you want to delete.
     */
    deleteUser: function(user) {
        var user = this.getAllUsers();
        delete user[user];
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
}