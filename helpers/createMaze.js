// Recursive back-tracker
// Algo: https://en.wikipedia.org/wiki/Maze_generation_algorithm

const _ = require('underscore'); // this library has a nice random function

let current; // Current cell
let stack = []; //keeps track of the path followed to create the maze
let gridSize = 10;
let grid = [gridSize];

// Create grid 
function setup() {
    for (let x = 0; x < gridSize; x++) { 
        grid[x] = new Array(gridSize); 
    }
    for(let i=0;i<grid.length;i++) {
        for(let j=0;j<grid[i].length;j++) {
            grid[i][j] = new Cell(i,j);
        }
    }
    // select random start location for the maze
    current = grid[_.random(0, gridSize-1)][_.random(0, gridSize-1)]; 
}

// Repeatedly remove walls
function mazify() {
    current.visited=true;
    let next = current.checkNeighbours();
    if(next) {
        stack.push(current);
        removeWall(current, next);
        current = next;   
    }
    else if(!stack.length<=0) {
        current = stack.pop();
    }
}

// Removes wall between two cells
function removeWall(a, b) {
    if(a.xcoord-b.xcoord>0) { // a is to the right of b 
        a.walls[3] = false;
        b.walls[1]=false;
    }
    else if(a.xcoord-b.xcoord<0) { // a is to the left of b
        a.walls[1] = false;
        b.walls[3]=false;
    }
    else if(a.zcoord-b.zcoord>0) { // a is below b
        a.walls[0] = false;
        b.walls[2]=false;
    }
    else if(a.zcoord-b.zcoord<0) { // a is above b
        a.walls[2] = false;
        b.walls[0]=false;
    }
}

// Create more paths through the maze by removing random walls
function addPaths(extra) {
    // Note: keep the wall removing away from outermost layer
    // Would like to keep the maze perfectly square for symmetry's sake
    for(let i=0;i<extra;i++) {
        let cell = grid[_.random(0,gridSize-2)][_.random(0,gridSize-2)]
        let neighbours = cell.getNeighbours();
        let index = _.random(0,cell.walls.length-1);
        let remove = cell.walls[index];
        if(remove&&neighbours[index]) {
            removeWall(cell, neighbours[index]);
        }
        else {
            i-=1;
        }
    }
}

function distance(position1, position2) {
    return Math.sqrt(Math.pow(position1.xcoord-position2.xcoord, 2)+Math.pow(position1.zcoord-position2.zcoord, 2));
}

// Generate start positions for both players
function generateStartPositions(target) {
    let pos1 = grid[_.random(0,gridSize-1)][_.random(0,gridSize-1)];
    while(pos1===target || distance(pos1, target) < gridSize/2) {
        pos1 = grid[_.random(0,gridSize-1)][_.random(0,gridSize-1)];
    }
    let neighbours = pos1.getNeighbours();
    let pos2 = neighbours[_.random(0, neighbours.length-1)];
    while(pos2 === undefined || pos2===target) { // don't really need to check it with target but, just to be safe
        pos2 = neighbours[_.random(0, neighbours.length-1)];
    }
    return [pos1, pos2];
}

// This is the goal. This block will likely be of a different color
function generateTarget() {
    let target = grid[_.random(0,gridSize-1)][_.random(0,gridSize-1)];
    return target;
}

function generateSpellBook(number, positions, target) {
    let spellBook = [];
    let initialSpells = [];
    let restrictedPositions = [target,...positions];
    let allSpells = [{name: "Speed", target:"self", duration:10},
                    {name: "Clarity", target:"self", duration:7},
                    {name: "Freeze", target:"opp", duration:4},
                    {name: "Blind", target:"opp", duration:7},
                ];
    for(let m=0;m<number;m++) {
        let location = grid[_.random(0,gridSize-1)][_.random(0,gridSize-1)];
        while(restrictedPositions.indexOf(location)!==-1) {
            location = grid[_.random(0,gridSize-1)][_.random(0,gridSize-1)];
        }
        restrictedPositions.push(location);
        let randomSpell = allSpells[_.random(0,allSpells.length-1)];
        spellBook[m] = {
            spellName: randomSpell.name,
            spellTarget: randomSpell.target,
            spellDuration: randomSpell.duration,
            position: location,
        };
    }
    for(let j=0;j<2;j++) {
        let randomSpell = allSpells[_.random(0,allSpells.length-1)];
        initialSpells[j] = {
            spellName: randomSpell.name,
            spellTarget: randomSpell.target,
            spellDuration: randomSpell.duration,
        };
    }
    return [spellBook, initialSpells];
}

// Cell constructor/definition/everything 
function Cell(xcoord,zcoord) {

    this.xcoord = xcoord;
    this.zcoord = zcoord;
    this.walls = [true, true, true, true]; // top, right, bottom, left
    this.visited = false;

    this.getNeighbours = () => {
        let allNeighbours = [];
        if(this.xcoord!==0) {
            allNeighbours[0] = grid[this.xcoord-1][this.zcoord]; // cell above
        }
        else {
            allNeighbours[0] = undefined;
        }
        if(this.zcoord!==gridSize-1) {
            allNeighbours[1] = grid[this.xcoord][this.zcoord+1]; // cell to right
        }
        else {
            allNeighbours[1]=undefined;
        }
        if(this.xcoord!==gridSize-1) {
            allNeighbours[2] = grid[this.xcoord+1][this.zcoord]; // cell below
        }
        else {
            allNeighbours[2]=undefined;
        }
        if(this.zcoord!==0) {
            allNeighbours[3] = grid[this.xcoord][this.zcoord-1]; //cell to left
        }
        else {
            allNeighbours[3] = undefined;
        }
        return allNeighbours;
    }

    // returns random neighbour
    this.checkNeighbours = () => {

        let validNeighbours = [];
        let allNeighbours = this.getNeighbours();
        let above = allNeighbours[0];
        let right = allNeighbours[1];
        let below = allNeighbours[2];
        let left = allNeighbours[3];

        // If the neighbour exists (not outside the range of the grid) and has not been visited,
        // add to the array

        if(above && !above.visited) {
            validNeighbours.push(above);
        }
        if(right && !right.visited) {
            validNeighbours.push(right);
        }
        if(below && !below.visited) {
            validNeighbours.push(below);
        }
        if(left && !left.visited) {
            validNeighbours.push(left);
        }

        if(validNeighbours.length>0) {
            return validNeighbours[_.random(0,validNeighbours.length-1)];
        }
        else {
            return undefined;
        }
    }
}

function main() {
    setup();
    do{
        mazify();
    }while(stack.length!==0);
    addPaths(5); // remove a few extra walls for more paths
    let target = generateTarget(); // get the goal
    let startPositions = generateStartPositions(target); // get startPositions for both players
    let [spellBook, initialSpells] = generateSpellBook(12, startPositions, target);
    // two objects, one for each player
    return [
        {
            startPosition: startPositions[0],
            target: target,
            maze: grid,
            opponentPosition: startPositions[1],
            initialSpell: initialSpells[0],
            spellBook: spellBook,
        },
        {
            startPosition: startPositions[1],
            target: target,
            maze: grid,
            opponentPosition: startPositions[0],
            initialSpell: initialSpells[1],
            spellBook: spellBook,
        }
    ];
}

module.exports=main;