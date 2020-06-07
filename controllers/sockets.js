const socket_io = require('socket.io');
const uuid = require('uuid');
const io = socket_io();
const lobby = io.of('/lobby');
const createMaze = require('../helpers/createMaze');
const id = require('../helpers/id');
const socketByPlayerID = require('../helpers/socketByPlayerID');
let playersInLobby= 0;

// Handle lobby connect/disconnect
lobby.on("connection", (socket) => {
  playersInLobby+=1;
  //send player id to connected socket
  socket.playerID = id(playersInLobby);
  socket.emit("initialize", {"playerID":socket.playerID});
  console.log(`${socket.playerID} entered the lobby`);
  // Update all the connected sockets on number of players
  lobby.emit("playerUpdate", {"playersInLobby":playersInLobby});

  // Ask a friend to play
  socket.on("reqFriend", (friendID) => {
    friendSocketID = socketByPlayerID(lobby, friendID);
    if(friendSocketID === undefined) {
      socket.emit("message", {msg: "Given player ID is invalid"});
    }
    else {
      // send private socket.io event to friend
      lobby.to(friendSocketID).emit("reqPlay",socket.playerID);
      let friendSocket = lobby.connected[friendSocketID];
      friendSocket.on("reject",  () => {
        socket.emit("message", {msg: "Your challenge has been rejected"})
      });
      friendSocket.on("accept", () => createGame(socket, friendSocket));
    }
  });

  createGame = (socket, friendSocket) => {
    const gameID = uuid.v4();
    const gameurl = "/game/" + encodeURIComponent(gameID);
    let maze = createMaze();
    socket.emit("enterGame", {redirectTo: gameurl});
    friendSocket.emit("enterGame", {redirectTo: gameurl});
    const game = io.of(gameurl);
    let playerCount = 0;
    game.on("connection", (player) =>{
      playerCount+=1;
      console.log(`Player ${playerCount} has entered the game`);
      player.emit("setup", maze);
      player.on("disconnect", () => {
        console.log(`Player ${playerCount} has exited the game`);
        playerCount-=1;
      });
    });
  }

  socket.on("disconnect", () => {
    playersInLobby-=1;
    console.log(`${socket.playerID} exited the lobby`);
    // Update all the connected sockets on number of players
    lobby.emit("playerUpdate", {"playersInLobby":playersInLobby});
  });
});

module.exports = io;
