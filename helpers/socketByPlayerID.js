// Find the socketID with the corresponding playerID
function socketByPlayerID(namesp, playerID) {
    // All players in the lobby
    let players = namesp.connected;
    let socketIDs =  Object.keys(players);
    for(const id of socketIDs) {
        let socket = players[id];
        if(socket.playerID===playerID) {
            return id;
        }
    }
    return undefined;
}

module.exports = socketByPlayerID;