//leo was here
const pg = require("pg");
const bcrypt = require("bcrypt");
const express = require("express");
const app = express();
const {Player, ActivePiece} = require("./classes.js");
const {makeGliderPos} = require("../public_html/shared.js");
const hostname = "localhost";
const port = process.env.PORT || 3000;
const server = require('http').createServer(app);
const options = {
  perMessageDeflate: false,
};
const io = require('socket.io')(server, options);

app.use(express.json());
app.use(express.static("../public_html"));

app.get('/', function (req, res) {
  res.redirect('/home.html');
});

let tempEnv = require("../env.json");
if (process.env._ && process.env._.indexOf("heroku"))
  tempEnv = require("../heroku.json");
const env = tempEnv;

const Pool = pg.Pool;
const pool = new Pool(env);
pool.connect().then(() => {
  console.log(`Connected to database ${env.database}`);
});

//POST handler for User Account creation
app.post("/newUser", (req, res) => {  
  if (!("username" in req.body) || !("plaintextPassword" in req.body))
    return res.status(401).send("Invalid user creation request.");

  const username = req.body.username;
  const plaintextPassword = req.body.plaintextPassword;
  const email = req.body.email;

  if (plaintextPassword.length >= 60) 
    return res.status(401).send("Password exceeded maximum length (60).");
  else if (plaintextPassword.length < 6) 
    return res.status(401).send("Password did not meet minimum length (6).");
  else if (username.length > 20)
    return res.status(401).send("Password exceeded maximum length (20).");
  else if (username.length <= 0)
    return res.status(401).send("Username did not meet minimum length (1).");
  //console.log(username + " " + plaintextPassword)
  bcrypt.hash(plaintextPassword, 10).then(password => {
    pool.query("INSERT INTO users (username, email, password) VALUES ($1, $2, $3)", [username, email, password]).then(response => {
      res.status(200).send("Account created");
    }).catch(error => {
      console.log(`FAILED TO CREATE USER ${username}\n` + error);
      if (error.constraint === "users_email_key") {
        res.status(500).send("Email in use");
      } else {
        res.status(500).send("Username taken");
      }
      
    });
  }).catch(error => {
    console.log(`BCRYPT HASHING FAILED FOR ${username}\n` + error);
    res.status(500).send(error);
  });  
});

//POST handler for User Account login
app.post("/auth", (req, res) => {
  const username = req.body.username;
  const plaintextPassword = req.body.plaintextPassword;
  
  pool.query("SELECT password FROM users WHERE username = $1", [username]).then(response => {
    if (response.rows.length === 0) {
      return res.status(401).send("Invalid username/password");
    }
    const password = response.rows[0].password;
    bcrypt.compare(plaintextPassword, password).then(match => {
      if (match) {
        console.log(`AUTHENTICATING USER '${username}'`);
        res.status(200).send("Logged in");
      } else {
        console.log(`INCORRECT PASSWORD PROVIDED FOR '${username}'`);
        res.status(401).send("Invalid username/password");
      }
    }).catch(error => {
      console.log(`BCRYPT VALIDATION FAILED FOR '${username}'\n` + error);
      res.status(500).send(error);
    });
  }).catch(error => {
    console.log(`AUTHENTICATION QUERY FAILED FOR '${username}'\n` + error);
    res.status(500).send(error);
  });
});


let activePieces = [];
let players = [];
function initTestBoard() {
  //Representation of game board
  let testPlayer = new Player("test", "background-color: black");
  let testPiece = new ActivePiece([0,0], testPlayer);
  let testPlayer2 = new Player("test2", "background-color: red");
  let testPiece2 = new ActivePiece([0,1], testPlayer2);
  activePieces = [testPiece, testPiece2];
  players = [testPlayer, testPlayer2];
  makeGlider([4,10], "SE", testPlayer);
  makeGlider([9,10], "SW", testPlayer2);
}
initTestBoard()

let dimensions = {};
function setDimensions(coords) {
  dimensions["xMin"] = coords[0][0];
  dimensions["xMax"] = coords[0][1];
  dimensions["yMin"] = coords[1][0];
  dimensions["yMax"] = coords[1][1];
}
setDimensions([[0,24],[0,24]]);

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

//Precondish: takes an x, y coordinate
//Postcondish: returns true if this is a valid cell in bounds of the table
function inBounds(xPos, yPos) {
  if (xPos >= dimensions["xMin"] && xPos <= dimensions["xMax"]) {
    if (yPos >= dimensions["yMin"] && yPos <= dimensions["yMax"]) {
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
        if (isAlive([i,j]) != owner && inBounds(i, j)) {
          neighbors = countLiveNeighbors([i,j], owner);
          if (neighbors == 3) {
            //If cell already exists in the next generation, it is either a collision or the cell has already been accounted for.
            if (!(`${i}:${j}` in tempCells)) {
              tempCells[`${i}:${j}`] = new ActivePiece([i,j], owner);
            }
            else if (!(`${i}:${j}` in contestedPositions)){
              contestedPositions[`${i}:${j}`] = {};
              contestedPositions[`${i}:${j}`][tempCells[`${i}:${j}`].getOwner().getId()] = tempCells[`${i}:${j}`].getOwner();
              if (!(owner.getId() in contestedPositions[`${i}:${j}`])) {
                contestedPositions[`${i}:${j}`][owner.getId()] = owner;
              }
            }
            else if (`${i}:${j}` in contestedPositions) {
              if (!(owner.getId() in contestedPositions[`${i}:${j}`])) {
                contestedPositions[`${i}:${j}`][owner.getId()] = owner;
              }
            }
          }
        }
      }
    }
    //Check if the current cell will be alive in the next generation
    if (inBounds(xPos, yPos)) {
      neighbors = countLiveNeighbors([xPos, yPos], owner);
      if (neighbors == 2 || neighbors == 3) {
            //If cell already exists in the next generation, it is either a collision or the cell has already been accounted for.
            if (!(`${xPos}:${yPos}` in tempCells)) {
              tempCells[`${xPos}:${yPos}`] = new ActivePiece([xPos,yPos], owner);
            }
            else if (!(`${xPos}:${yPos}` in contestedPositions)){
              contestedPositions[`${xPos}:${yPos}`] = {};
              contestedPositions[`${xPos}:${yPos}`][tempCells[`${xPos}:${yPos}`].getOwner().getId()] = tempCells[`${xPos}:${yPos}`].getOwner();
              if (!(owner.getId() in contestedPositions[`${xPos}:${yPos}`])) {
                contestedPositions[`${xPos}:${yPos}`][owner.getId()] = owner;
              }
            }
            else if (`${xPos}:${yPos}` in contestedPositions) {
              if (!(owner.getId() in contestedPositions[`${xPos}:${yPos}`])) {
                contestedPositions[`${xPos}:${yPos}`][owner.getId()] = owner;
              }
            }
      }
    }
  }
  tempCells = checkCollision(contestedPositions, tempCells);
  //Replace current generation with next.
  activePieces.length = 0;
  for (var pos in tempCells) {
    if (tempCells[pos] != null) {
      activePieces.push(tempCells[pos]);
    }
  }
  setPlayerStats();
}


// ;)
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
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
  let newPositions = makeGliderPos(gliderPos, orientation);
  for (let i = 0; i < newPositions.length; i++) {
    makeCell(newPositions[i], player);
  }
}

//Precondish: must be active cells in activePieces array
//Postcondish: sets the strength stats for all players with active cells
function setPlayerStats() {
  for (let i = 0; i < players.length; i++) {
    strength = 0;
    for (let j = 0; j < activePieces.length; j++) {
      if (activePieces[j].getOwner() == players[i]) { 
        strength ++;
      }
    }
    players[i].setStrength(strength);
  }
}

//Precondish: takes a duple with the x, y coords of a contested cell, an array with all the players contesting the cell
//Postcondish: returns finalized array of cells with correct ownership. The strength stat determines who wins a contested cell.
//Whichever player has the highest strength stat becomes the owner of the contested cell. In the case of a tie, flip a coin.
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

app.get("/reset", function(req, res) {
  initTestBoard()
  
});

//POST handler for recieving a JSON body of center coordinates for gliders and their orientations
app.get("/gliders", function(req, res) {
  let x = req.query.x;
  let y = req.query.y;
  let orientation = req.query.orientation;
  console.log("gliders sent: x = " + x + ", y = " + y);
  let testPlayer = new Player("test", "background-color: black");
  makeGlider([Number(x),Number(y)], orientation, testPlayer);
  console.log({"orientation": orientation});
  res.status(200);
  res.json({"orientation": orientation});
});



app.listen(port, function() {
  console.log(`Server listening on post: http://${hostname}:${port}`)
});

