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
let testPiece2 = new ActivePiece([0,1], testPlayer2);
let activePieces = [testPiece, testPiece2];
makeGlider([4,3], "NE", testPlayer);
makeGlider([15,3], "NW", testPlayer2);

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

//Precondish: takes a position and an array of cell objects
//Postcondish: returns null if position not in list, otherwise returns array cells containing that position 
function posExists(pos, L) {
  indices = [];
  for (let i = 0; i < L.length; i++) {
    if (L[i].getPos()[0] == pos[0] && L[i],getPos()[1] == pos[1]) {
      indices.push(L[i]);
    }
  }
  if (indices.length == 0){
    return null;
  }
  else {
    return indices;
  }
}

//Precondish: array of current active cell objects must be initialized
//Postcondish: doesn't return anything, replaces the activePieces array with the next generation of living cells
function nextGeneration() {
  let tempCells = [];
  let contestedCells = [];
  for (let cell = 0; cell < activePieces.length; cell++) {
    let xPos = activePieces[cell].getPos()[0];
    let yPos = activePieces[cell].getPos()[1];
    let owner = activePieces[cell].getOwner();
    //Check the 3x3 box around each living cell if any dead cells will be alive in the next generation
    for (let i = xPos - 1; i <= xPos + 1; i++) {
      for (let j = yPos - 1; j <= yPos + 1; j++) {
        if (isAlive([i,j]) == null) {
          neighbors = countLiveNeighbors([i,j], owner);
          if (neighbors == 3) {
            accounted = false;
            //If cell already exists in the next generation, it is either a collision or the cell has already been accounted for.
            for (let k = 0; k < tempCells.length; k++) {
              if (tempCells[k].getPos()[0] == i && tempCells[k].getPos()[1] == j) {
                if (tempCells[k].getOwner() != owner) {
                  newCell = new ActivePiece([i,j], owner);
                  tempCells.push(newCell);
                  if (posExists([i,j], contestedCells) == null) {
                    contestedCells.push([i, j]);
                  }
                }
                else {
                  accounted = true;
                }
              }
            }
            if (!accounted) {
              newCell = new ActivePiece([i,j], owner);
              tempCells.push(newCell);
            }
          }
        }
      }
    }
    //Check if the current cell will be alive in the next generation
    neighbors = countLiveNeighbors([xPos, yPos], owner);
    if (neighbors == 2 || neighbors == 3) {
      //If cell already exists in the next generation, it is either a collision or the cell has already been accounted for.
      accounted = false;
      for (let k = 0; k < tempCells.length; k++) {
        if (tempCells[k].getPos()[0] == xPos && tempCells[k].getPos()[1] == yPos) {
          if (tempCells[k].getOwner() != owner) {
            newCell = new ActivePiece([i,j], owner);
            tempCells.push(newCell);
            if (posExists([i,j], contestedCells) == null) {
              contestedCells.push([i, j]);
            }
          }
          else {
            accounted = true;
          }
        }
      }
      if (!accounted) {
        newCell = new ActivePiece([xPos,yPos], owner);
        tempCells.push(newCell);
      }
    }
  }
  newCells = checkCollision(contestedCells, tempCells);
  //Delete all objects in the current (or, last?) generation, replace it with the next.
  for (let i = 0; i < activePieces.length; i++) {
    delete activePieces[i];
  }
  activePieces.length = 0;
  for (let i = 0; i < newCells.length; i++) {
    if (newCells != null) {
      activePieces.push(newCells[i]);
    }
  }
  setPlayerStats();
}

//Precondish: takes a duble with x, y coords of a cell, the owner of the cell
//Postcondish: the number of live neighbors to the specified cell
function countLiveNeighbors(pos, player) {
  neighbors = 0;
  for (let i = pos[0] - 1; i <= pos[0] + 1; i++) {
    for (let j = pos[1] - 1; j <= pos[1] + 1; j++) {
      //See if the cell has a neighbor that belongs to the same person, and is not itself.
      if (isAlive([i,j]) == player && !(i == pos[0] && j == pos[1])) {
        neighbors ++;
      }
    }
  }
  //console.log(`Cell at pos: ${pos[0]}, ${pos[1]} has ${neighbors} live neighbors.`);
  return neighbors;
}

//Precondish: duble with x, y coords of center of a glider, a string representing orientation of glider, and a player object
//Postcondish: doesn't return anything, adds appropriate active cells objects to active pieces array
function makeGlider(gliderPos, orientation, player) {
  newPositions = []; 
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

//Precondish: must be active cells in activePieces array
//Postcondish: sets the strength stats for all players with active cells
function setPlayerStats() {
  for (let i = 0; i < activePieces.length; i++) {
    cur = activePieces[i].getOwner().getStrength();
    activePieces[i].getOwner().setStrength(cur + 1);
  }
}

//Precondish: takes a duple with the x, y coords of a contested cell, an array with all the players contesting the cell
//Postcondish: returns finalized array of cells with correct ownership. The strength stat determines who wins a contested cell.
//Whichever player has the highest strength stat becomes the owner of ALL the other players' cells. In the case of a tie, flip a coin.
function checkCollision(contestedCells, cells) {
  //Find highest strength value
  winningStrength = 0;
  for (let i = 0; i < contestedCells.length; i++) {
    contestants = posExists(contestedCells[i], cells);
    for (let j = 0; j < contestants.length; j++) {
      if (contestants[j].getStrength() > winningStrength) {
        winningStrength = contestants[j].getStrength();
      }
    }
    //Check for ties
    winners = [];
    winner = 0;
    for (let i = 0; i < contestedCells.length; i++) {
      if (contestants[i].getStrength() == winningStrength) {
        winners.push(contestants[i]);
      }
    }
    if (winners.length > 1) {
      winner = getRandomInt(winners.length);
    }
    //Convert all contestant cells to winners' cells
    for (let i = 0; i < cells.length; i++) {
      if (winners.includes(cells[i].getOwner()) && cells[i].getOwner() != winners[winner]) {
        cells[i].setOwner(winners[winner]);
      }
    }
    //Delete overlapping cells
    for (let i = 0; i < contestants.length; i++) {
      if (contestants[i].getOwner() != winners[winner]) {
        delete contestants[i];
      }
    }
  }
  return cells;
}

//Precondish: duble with x, y coords of a cell, an owner
//Postcondish: doesn't return anything, makes a new cell object and appends it to the activePieces array
function makeCell(pos, player) {
  newCell = new ActivePiece(pos, player);
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

app.get("/step", function(req, res) {
  nextGeneration();
  res.sendStatus(200);
});

//POST handler for recieving a JSON body of center coordinates for gliders and their orientations
app.post("/gliders", function(req, res) {
  return
});

app.listen(port, hostname, function() {
  console.log(`Server listening on http://${hostname}:${port}`)
});