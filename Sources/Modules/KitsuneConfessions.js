const fs = require("fs");
const confessionPath = "./confessions.json";

module.exports = {
    /**
     * Get all confessions from the saved file.
     * @returns The object containing all confession data.
     */
    getAllConfessions: function() {
        try {
            return JSON.parse(fs.readFileSync(confessionPath).toString());
        }
        catch (err) {
            return {};
        }
    },
    /**
     * Get the confession data from a confession.
     * @param {string} confession The confession ID you want to get.
     * @returns The object containing the confession data of this confession.
     */
    getConfession: function(confession) {
        return this.getAllConfessions()[confession] || {};
    },
    /**
     * Write the confession data to the storage file.
     * @param {object} data The updated confession data.
     */
    updateAllConfessions: function(data) {
        fs.writeFileSync(confessionPath, JSON.stringify(data));
    },
    /**
     * Update the confession data of a confession.
     * @param {string} confession The confession you want to update.
     * @param {object} data The updated data of the confession.
     */
    updateConfession: function(confession, data) {
        var confessions = this.getAllConfessions();
        confessions[confession] = data;
        this.updateAllConfessions(confessions);
    },
    /**
     * Delete the confession data of a confession.
     * @param {string} confession The confession you want to delete.
     */
    deleteConfession: function(confession) {
        var confessions = this.getAllConfessions();
        delete confessions[confession];
        this.updateAllConfessions(confessions);
    }
}