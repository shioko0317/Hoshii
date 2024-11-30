const fs = require("fs");
const menuPath = "./menus.json";

module.exports = {
    /**
     * Get all menus from the saved file.
     * @returns The object containing all menu data.
     */
    getAllMenus: function() {
        try {
            return JSON.parse(fs.readFileSync(menuPath).toString());
        }
        catch (err) {
            return {};
        }
    },
    /**
     * Get the menu data from an id.
     * @param {string} id The ID you want to get.
     * @returns The object containing the menu data of this id.
     */
    getMenu: function(id) {
        return this.getAllMenus()[id] || {};
    },
    /**
     * Get a property from the menu data of an id.
     * @param {string} id The ID you want to get.
     * @param {string} prop The property you want to get.
     * @returns Data of the property from that id.
     */
    getMenuProp: function(id, prop) {
        return this.getMenu(id)[prop];
    },
    /**
     * Write the menu data to the storage file.
     * @param {object} data The updated menu data.
     */
    updateAllMenus: function(data) {
        fs.writeFileSync(menuPath, JSON.stringify(data));
    },
    /**
     * Update the menu data of an id.
     * @param {string} id The id you want to update.
     * @param {object} data The updated data of the id.
     */
    updateMenu: function(id, data) {
        var menu = this.getAllMenus();
        menu[id] = data;
        this.updateAllMenus(menu);
    },
    /**
     * Update a property of an id's menu data.
     * @param {string} id The id you want to update.
     * @param {string} prop The property you want to update.
     * @param {object} data The updated data of the property.
     */
    updateMenuProp: function(id, prop, data) {
        var menu = this.getMenu(id);
        menu[prop] = data;
        this.updateMenu(id, menu);
    },
    /**
     * Delete the menu data of an id.
     * @param {string} id The id you want to delete.
     */
    deleteMenu: function(id) {
        var menu = this.getAllMenus();
        delete menu[id];
        this.updateAllMenus(menu);
    },
    /**
     * Delete a property from an id's menu data.
     * @param {string} id The id you want to update.
     * @param {string} prop The name of the property you want to delete.
     */
    deleteMenuProp: function(id, prop) {
        var menu = this.getMenu(id);
        delete menu[prop];
        if (Object.keys(menu).length) this.updateMenu(id, menu);
        else this.deleteMenu(id);
    },
}