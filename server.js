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
//Postcondish: If cell is alive, return owner, otherwise returns Null
function isAlive(pos) {
  for (let i = 0; i < activePieces.length; i++) {
    if (activePieces[i].getPos()[0] == pos[0] && activePieces[i].getPos()[1] == pos[1]) {
      return activePieces[i].getOwner();
    }   
  }
  return null;
}

//Precondish: array of current active cell objects
//Postcondish: array of the next generation of active cell objects
function nextGeneration(cells) {

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