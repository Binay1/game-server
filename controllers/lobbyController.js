let setup = (req, res) => {
    res.send({playersInLobby: 1,
        userID : 2});
}
exports.setup = setup;