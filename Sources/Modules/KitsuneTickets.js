const fs = require("fs");
const ticketPath = "./tickets.json";

module.exports = {
    /**
     * Get all tickets from the saved file.
     * @returns The object containing all ticket data.
     */
    getAllTickets: function() {
        try {
            return JSON.parse(fs.readFileSync(ticketPath).toString());
        }
        catch (err) {
            return {};
        }
    },
    /**
     * Get the ticket data from a ticket.
     * @param {string} ticket The ticket ID you want to get.
     * @returns The object containing the ticket data of this ticket.
     */
    getTicket: function(ticket) {
        return this.getAllTickets()[ticket] || {};
    },
    /**
     * Write the ticket data to the storage file.
     * @param {object} data The updated ticket data.
     */
    updateAllTickets: function(data) {
        fs.writeFileSync(ticketPath, JSON.stringify(data));
    },
    /**
     * Update the ticket data of a ticket.
     * @param {string} ticket The ticket you want to update.
     * @param {object} data The updated data of the ticket.
     */
    updateTicket: function(ticket, data) {
        var tickets = this.getAllTickets();
        tickets[ticket] = data;
        this.updateAllTickets(tickets);
    },
    /**
     * Delete the ticket data of a ticket.
     * @param {string} ticket The ticket you want to delete.
     */
    deleteTicket: function(ticket) {
        var tickets = this.getAllTickets();
        delete tickets[ticket];
        this.updateAllTickets(tickets);
    }
}