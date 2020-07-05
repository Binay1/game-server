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
