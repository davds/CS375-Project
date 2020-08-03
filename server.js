const express = require("express");
const app = express();
const port = 3000;
const hostname = "localhost";
const {Player, ActivePiece} = require("./classes.js");

app.use(express.json());
app.use(express.static("public_html"));

//Representation of game board
let testPlayer = new Player("test", "background-color: black");
let testPiece = new ActivePiece([0,0], testPlayer);
let testPlayer2 = new Player("test2", "background-color: red");
let testPiece2 = new ActivePiece([0,0], testPlayer2);
let activePieces = [testPiece, testPiece2];

//Precondish: duble with x, y coords of a cell
//Postcondish: if cell is alive, return owner, otherwise returns Null
function isAlive(pos) {
  for (let i = 0; i < activePieces.length; i++) {
    if (activePieces[i].getPos()[0] == pos[0] && activePieces[i].getPos()[1] == pos[1]) {
      return activePieces[i].getOwner();
    }   
  }
  return null;
}

//Precondish: array of current active cell objects must be initialized
//Postcondish: doesn't return anything, replaces the activePieces array with the next generation of living cells
function nextGeneration() {
  let tempCells = [];
  for (let cell = 0; cell < activePieces.length; cell++) {
    let xPos = activePieces[cell].getPos()[0];
    let yPos = activePieces[cell].getPos()[1];
    let owner = activePieces[cell].getOwner();
    //Check the 3x3 box around each living cell if any dead cells will be alive in the next generation
    for (let i = xPos - 1; i < xPos + 1; i++) {
      for (let j = yPos - 1; j < yPos + 1; j++) {
        if (isAlive([i,j]) == null) {
          neighbors = countLiveNeighbors([i,j], owner);
          if (neighbors == 3) {
            let newCell = new ActivePiece([i,j], owner);
            tempCells.push(newCell);
          }
        }
      }
    }
    //Check if the current cell will be alive in the next generation
    neighbors = countLiveNeighbors([xPos, yPos], owner);
    if (neighbors == 2 || neighbors == 3) {
      let newCell = new ActivePiece([xPos,yPos], owner);
      tempCells.push(newCell);
    }
  }
  activePieces = tempCells;
}

//Precondish: takes a duble with x, y coords of a cell, the owner of the cell
//Postcondish: the number of live neighbors to the specified cell
function countLiveNeighbors(pos, player) {
  neighbors = 0;
  for (let i = pos[0] - 1; i < pos[0] + 1; i++) {
    for (let j = pos[1] - 1; j < pos[1] + 1; j++) {
      //See if the cell has a neighbor that belongs to the same person, and is not itself.
      if (isAlive([i,j]) == player && !(i == pos[0] && j == pos[1])) {
        neighbors ++;
      }
    }
  }
  return neighbors;
}

//Precondish: duble with x, y coords of center of a glider, a string representing orientation of glider, and a player object
//Postcondish: doesn't return anything, adds appropriate active cells objects to active pieces array
function makeGlider(gliderPos, orientation, player) {
  newPositions; 
  switch(orientation) {
    case "SE":
      newPositions = [
        [gliderPos[0], gliderPos[1] + 1],
        [gliderPos[0] + 1, gliderPos[1]],
        [gliderPos[0] - 1, gliderPos[1] - 1],
        [gliderPos[0], gliderPos[1] - 1],
        [gliderPos[0] + 1, gliderPos[1] + 1]
      ];
      break;
    case "NE":
      newPositions = [
        [gliderPos[0], gliderPos[1] + 1],
        [gliderPos[0] + 1, gliderPos[1] + 1],
        [gliderPos[0] - 1, gliderPos[1]],
        [gliderPos[0] + 1, gliderPos[1]],
        [gliderPos[0] + 1, gliderPos[1] - 1]
      ];
      break;
    case "NW":
      newPositions = [
        [gliderPos[0], gliderPos[1] + 1],
        [gliderPos[0] + 1, gliderPos[1] + 1],
        [gliderPos[0] - 1, gliderPos[1] + 1],
        [gliderPos[0] - 1, gliderPos[1]],
        [gliderPos[0], gliderPos[1] - 1]
      ];
      break;
    case "SW":
      newPositions = [
        [gliderPos[0] - 1, gliderPos[1] + 1],
        [gliderPos[0] - 1, gliderPos[1]],
        [gliderPos[0] + 1, gliderPos[1]],
        [gliderPos[0] - 1, gliderPos[1] - 1],
        [gliderPos[0], gliderPos[1] - 1]
      ];
      break;
  }
  for (let i = 0; i < newPositions.length; i++) {
    makeCell(newPositions[i], player);
  }
}

//Precondish: takes a duple with the x, y coords of a contested cell, an array with all the players contesting the cell
//Postcondish: doesn't return anything, but checks the strength stat of all the players contesting the cell.
//Whichever player has the highest strength stat becomes the owner of ALL the other players' cells. In the case of a tie, choose randomly based on (100/#_tied_players)% odds for each player to win.
function checkCollision(pos, players) {

}

//Precondish: duble with x, y coords of a cell, an owner
//Postcondish: doesn't return anything, makes a new cell object and appends it to the activePieces array
function makeCell(pos, player) {
  let newCell = new ActivePiece(pos, player);
  activePieces.push(newCell);
}

//GET handler for sending client a JSON body of active cell objects
app.get("/cells", function(req, res) {
  let resActivePieces = [];
  for (i in activePieces) {
    resActivePieces.push({ "pos": activePieces[i].getPos(), "style": activePieces[i].getStyle() });
  }
  res.status(200);
  res.json(resActivePieces);
});

//POST handler for recieving a JSON body of center coordinates for gliders and their orientations
app.post("/gliders", function(req, res) {

});

app.listen(port, hostname, function() {
  console.log(`Server listening on http://${hostname}:${port}`)
});