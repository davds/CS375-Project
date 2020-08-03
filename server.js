const express = require("express");
const app = express();
const port = 3000;
const hostname = "localhost";
const classes = require("./classes.js")

app.use(express.json());
app.use(express.static("public_html"));

//Representation of game board
let activePieces = [];

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

}

//GET handler for sending client a JSON body of active cell objects
app.get("/cells", function(req, res) {

});

//POST handler for recieving a JSON body of center coordinates for gliders and their orientations
app.post("/gliders", function(req, res) {

});

app.listen(port, hostname, function() {
  console.log(`Server listening on http://${hostname}:${port}`)
});