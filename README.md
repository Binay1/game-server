# Maze Runner (server)
- This repo contains all the server-side code for the game (dubbed Maze Runner) that I am creating.
- This repo is meant to be used in conjunction with the game-client repo.
- In the application's current state, we have the play-with-friend, play-with-random lobby mechanisms, random maze generation, player movement working.
- The game is going to be multiplayer and that is achieved through the use of socket.io

# Instructions for use
- Clone both this and the client repo
- Open the directories and run 'npm install' in both of them to download all dependencies
- Run 'npm start' in both directories to launch the app
- By default, the app will be accessible through http://localhost:3000

# Rules / Lore
This is a battle between two wizards stuck in the void between two dimensions. There is only one exit and only one of them can leave. The other one won't die, he'll just be stuck there for eternity. There is no death in this timeless void. If you jump off the path, you will just spawn back to where you started again. There are spells spread throughout that can be used via your magical wand once you pick them up. Beware though, each spell can only be used once and you can't pick two at the same time. Your wand will automatically absorb any new spell you touch. May the best wizard win.

# Controls
- WASD or Arrow keys for movement
- Mouse to look around
- Click to fire spell

# Note
Right now, the ip address that the client connects to has been hard-coded. Since it is a multiplayer game, I naturally had to test it with multiple computers and I had to hard-code in order to make it accessible to other nodes on the network. You will most likely have to change the ip to the one running the application. It will be displayed on the terminal once you start the client so you don't need to go digging for it. The only two places where the change needs to be made in the client code is in lobby.js, game.js
Change the line that looks like io.connect("http://192.168.1.6:5000") to the new ip address. Leave the port number unchanged.
There is a similar change in the server code in app.js. Change the ip address in the following line: 
app.use(cors({credentials:true,
  origin: 'http://192.168.1.6:3000',
}));

