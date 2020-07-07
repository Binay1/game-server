const socket_io = require('socket.io');
const uuid = require('uuid');
const _= require('underscore');
const io = socket_io();
const lobby = io.of('/lobby');
const createMaze = require('../helpers/createMaze');
const id = require('../helpers/id');
const socketByPlayerID = require('../helpers/socketByPlayerID');

let playersInLobby = 0;
let matchMakingInProgress = false;

// currently no way to opt out once you press "play now"
function joinRandoms() {
  if(!matchMakingInProgress) {
  matchMakingInProgress=true;
    if(lobby.adapter.rooms["randomRoom"]!==undefined) {
      let randoms = Object.keys(lobby.adapter.rooms["randomRoom"].sockets);;
      while(randoms.length>1) {
        let player1 = lobby.connected[randoms[_.random(0,randoms.length-1)]];
        player1.leave("randomRoom");
        randoms = Object.keys(lobby.adapter.rooms["randomRoom"].sockets);
        let player2 = lobby.connected[randoms[_.random(0,randoms.length-1)]];
        player2.leave("randomRoom");
        createGame(player1, player2);
        if(randoms.length>1) {
          randoms = Object.keys(lobby.adapter.rooms["randomRoom"].sockets);
        }
      }
    }
    matchMakingInProgress=false;
  }
}

setInterval(joinRandoms, 2000);

// Handle lobby connect/disconnect
lobby.on("connection", (socket) => {
  playersInLobby+=1;
  //send player id to connected socket
  socket.playerID = id(playersInLobby);
  socket.emit("initialize", {"playerID":socket.playerID});
  console.log(`${socket.playerID} entered the lobby`);
  // Update all the connected sockets on number of players
  lobby.emit("playerUpdate", {"playersInLobby":playersInLobby});

  // Play with a random person
  socket.on("playRandom", () => {
    socket.join("randomRoom");
  });

  // Ask a friend to play
  socket.on("reqFriend", (friendID) => {
    let friendSocketID = socketByPlayerID(lobby, friendID);
    if(friendSocketID === undefined) {
      socket.emit("message", "Given player ID is invalid");
    }
    else {
      // send private socket.io event to friend
      lobby.to(friendSocketID).emit("reqPlay",socket.playerID);
      let friendSocket = lobby.connected[friendSocketID];
      friendSocket.on("reject",  () => {
        socket.emit("message", "Your challenge has been rejected")
      });
      friendSocket.on("accept", () => createGame(socket, friendSocket));
    }
  });

  createGame = (socket, opponent) => {
    const gameID = uuid.v4();
    const gameurl = "/game/" + encodeURIComponent(gameID);
    let gameDetails = createMaze();
    socket.emit("enterGame", {redirectTo: gameurl});
    opponent.emit("enterGame", {redirectTo: gameurl});
    const game = io.of(gameurl);
    let playerCount = 0;
    game.on("connection", (player) =>{
      playerCount+=1;
      if(playerCount>2) {
        playerCount-=1;
        player.disconnect();
      }
      player.on("position", (newPos) => {
        player.broadcast.emit("opponentPosition", newPos);
      });
      player.on("spellCross", (spellID) => {
        player.broadcast.emit("removeSpell", spellID);
      });
      player.on("fire", (shotDetails, cb) => {
        player.broadcast.emit("shotDetails",shotDetails);
        cb();
      });
      player.on("reachedTarget", () => {
        player.broadcast.emit("gg", {message: "Your opponent reached the exit. You lose!"});
      });
      console.log(`Player ${playerCount} has entered the game`);
      player.emit("setup", gameDetails[playerCount-1]);
      player.on("disconnect", () => {
        player.broadcast.emit("gg", {message: "Your opponent left the game."});
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
