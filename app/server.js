const pg = require("pg");
const bcrypt = require("bcrypt");
const express = require("express");
const env = require("../env.json");
const app = express();
const {Player, ActivePiece} = require("./classes.js");
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public_html"));



const Pool = pg.Pool;
const pool = new Pool(env);
pool.connect().then(() => {
  console.log(`Connected to database ${env.database}`);
});

//POST handler for User Account creation
app.post("/newUser", (req, res) => {  
  if (!("username" in req.body) || !("plaintextPassword" in req.body))
    res.status(401).send("Invalid user creation request.")

  const username = req.body.username;
  const plaintextPassword = req.body.plaintextPassword;

  if (plaintextPassword.length >= 60) 
    res.status(401).send("Password exceeded maximum length (60).")
  else if (plaintextPassword.length < 6) 
    res.status(401).send("Password did not meet minimum length (6).")
  else if (username.length > 20)
    res.status(401).send("Password exceeded maximum length (20).")
  else if (username.length <= 0)
    res.status(401).send("Username did not meet minimum length (1).")
  console.log(username + " " + plaintextPassword)
  bcrypt.hash(plaintextPassword, 10).then(password => {
    pool.query("INSERT INTO users (username, email, password) VALUES ($1, $2, $3)", [username, "", password]).then(response => {
      res.status(200).send();
    }).catch(error => {
      console.log(`FAILED TO CREATE USER ${username}\n` + error);
      res.status(500).send();
    });
  }).catch(error => {
    console.log(`BCRYPT HASHING FAILED FOR ${username}\n` + error);
    res.status(500).send();
  });  
});

//POST handler for User Account login
app.post("/auth", (req, res) => {
  const username = req.body.username;
  const plaintextPassword = req.body.plaintextPassword;
  
  pool.query("SELECT password FROM users WHERE username = $1", [username]).then(response => {
    if (response.rows.length === 0) {
      return res.status(401).send();
    }
    const password = response.rows[0].password;
    bcrypt.compare(plaintextPassword, password).then(match => {
      if (match) {
        console.log(`AUTHENTICATING USER '${username}'`);
        res.status(200).send();
      } else {
        console.log(`INCORRECT PASSWORD PROVIDED FOR '${username}'`);
        res.status(401).send();
      }
    }).catch(error => {
      console.log(`BCRYPT VALIDATION FAILED FOR '${username}'\n` + error);
      res.status(500).send();
    });
  }).catch(error => {
    console.log(`AUTHENTICATION QUERY FAILED FOR '${username}'\n` + error);
    res.status(500).send();
  });
});



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
  cells = [];
  for (let i = 0; i < L.length; i++) {
    if (L[i].getPos()[0] == pos[0] && L[i].getPos()[1] == pos[1]) {
      cells.push(L[i]);
    }
  }
  if (cells.length == 0){
    return null;
  }
  else {
    return cells;
  }
}

//Precondish: takes a duple of coords, an array of duple coords.
//Postcondish: returns true if a duple with the same values is in the array
function checkContested(pos, contested) {
  for (let i = 0; i < contested.length; i++) {
    if (contested[i][0] == pos[0] && contested[i][1] == pos[1]) {
      return true;
    }
  }
  return false;
}

//Precondish: takes a plyer object, and a list of cells
//Postcondish: returns true if one of the cells is owned by the specified player, false otherwise.
function isOwned(owner, cells) {
  for (let i = 0; i < cells.length; i++) {
    if (cells[i].getOwner() == owner) {
      return true;
    }
  }
  return false;
}

//Precondish: array of current active cell objects must be initialized
//Postcondish: doesn't return anything, replaces the activePieces array with the next generation of living cells
function nextGeneration() {
  let tempCells = {};
  let contestedPositions = {};
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
            //If cell already exists in the next generation, it is either a collision or the cell has already been accounted for.
            if (!(`${i}:${j}` in tempCells)) {
              tempCells[`${i}:${j}`] = new ActivePiece([i,j], owner);
            }
            else if (!(`${i}:${j}` in contestedPositions)){
              contestedPositions[`${i}:${j}`][owner.getId()] = owner;  
            }
            else if (`${i}:${j}` in contestedPositions) {
              contestedPositions[`${i}:${j}`][owner.getId()] = owner;
            }
          }
        }
      }
    }
    //Check if the current cell will be alive in the next generation
    neighbors = countLiveNeighbors([xPos, yPos], owner);
    if (neighbors == 2 || neighbors == 3) {
      //If cell already exists in the next generation, it is either a collision or the cell has already been accounted for.
      if (!(`${xPos}:${yPos}` in tempCells)) {
        tempCells[`${xPos}:${yPos}`] = new ActivePiece([xPos,yPos], owner);
      }
      else if (!(`${xPos}:${yPos}` in contestedPositions)){
        contestedPositions[`${xPos}:${yPos}`][owner.getId()] = owner;
      }
      else if (`${xPos}:${yPos}` in contestedPositions && !(owner.getId() in contestedPositions[`${xPos}:${yPos}`])) {
        contestedPositions[`${xPos}:${yPos}`][owner.getId()] = owner;
      }
    }
  }
  if (contestedPositions.length != 0)
    console.log(contestedPositions);
  tempCells = checkCollision(contestedPositions, tempCells);
  //Replace current generation with next.
  activePieces.length = 0;
  for (var pos in tempCells) {
    activePieces.push(tempCells[pos]);
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
function checkCollision(contestedPositions, cells) {
  for (var pos in contestedPositions) {
    let players = contestedPositions[pos];
    let winningStrength = 0;
    //determine highest strength
    for (var id in players) {
      let contestant = players[id];
      if (contestant.getStrength() > winningStrength) {
        winningStrength = contestant.getStrength();
      }
    }
    //check for ties
    winners = [];
    for (var id in players) {
      let contestant = players[id];
      if (contestant.getStrength() == winningStrength) {
        winners.push(contestant);
      }
    }
    //Randomly determine winner
    winner = winners[getRandomInt(winners.length)];
    //Set cell at pos to winner
    cells[pos].setOwner(winner);
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



app.listen(port, function() {
  console.log(`Server listening on post: ${port}`)
});

