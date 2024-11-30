const fs = require("fs");
const sessionPath = "./sessions.json";

module.exports = {
    /**
     * Get all sessions from the saved file.
     * @returns The object containing all session data.
     */
    getAllSessions: function() {
        try {
            return JSON.parse(fs.readFileSync(sessionPath).toString());
        }
        catch (err) {
            return {};
        }
    },
    /**
     * Get the session data from an user.
     * @param {string} user The user ID you want to get.
     * @returns The object containing the session data of this user.
     */
    getSession: function(user) {
        return this.getAllSessions()[user] || {};
    },
    /**
     * Get a property from the session data of an user.
     * @param {string} user The user ID you want to get.
     * @param {string} prop The property you want to get.
     * @returns Data of the property from that user.
     */
    getSessionProp: function(user, prop) {
        return this.getSession(user)[prop];
    },
    /**
     * Write the session data to the storage file.
     * @param {object} data The updated session data.
     */
    updateAllSessions: function(data) {
        fs.writeFileSync(sessionPath, JSON.stringify(data));
    },
    /**
     * Update the session data of an user.
     * @param {string} user The user you want to update.
     * @param {object} data The updated data of the user.
     */
    updateSession: function(user, data) {
        var session = this.getAllSessions();
        session[user] = data;
        this.updateAllSessions(session);
    },
    /**
     * Update a property of an user's session data.
     * @param {string} user The user you want to update.
     * @param {string} prop The property you want to update.
     * @param {object} data The updated data of the property.
     */
    updateSessionProp: function(user, prop, data) {
        var session = this.getSession(user);
        session[prop] = data;
        this.updateSession(user, session);
    },
    /**
     * Delete the session data of an user.
     * @param {string} user The user you want to delete.
     */
    deleteSession: function(user) {
        var session = this.getAllSessions();
        delete session[user];
        this.updateAllSessions(session);
    },
    /**
     * Delete a property from an user's session data.
     * @param {string} user The user you want to update.
     * @param {string} prop The name of the property you want to delete.
     */
    deleteSessionProp: function(user, prop) {
        var session = this.getSession(user);
        delete session[prop];
        if (Object.keys(session).length) this.updateSession(user, session);
        else this.deleteSession(user);
    },
}