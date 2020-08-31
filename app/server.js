//leo was here
const pg = require("pg");
const bcrypt = require("bcrypt");
const express = require("express");
const session = require("express-session");
const app = express();
const {Player, ActivePiece, GameSession} = require("./classes.js");
const database = require("./database.js");
const obstacle = require("./obstacles.js");
const hostname = "localhost";
const port = process.env.PORT || 3000;
const server = require('http').createServer(app);
const options = {
  perMessageDeflate: false,
};
const io = require('socket.io').listen(server, options);
const gameSessions = {};
const obstacleDims = [
  {
    "cornerCoord": [21,0],
    "dims": [16, 19]
  },
  {
    "cornerCoord": [38,0],
    "dims": [22, 19]
  },
  {
    "cornerCoord": [61,0],
    "dims": [16, 19]
  },
  {
    "cornerCoord": [0,21],
    "dims": [19, 16]
  },
  {
    "cornerCoord": [20,20],
    "dims": [17, 17]
  },
  {
    "cornerCoord": [38,21],
    "dims": [22, 8]
  },
  {
    "cornerCoord": [38,30],
    "dims": [22, 8]
  },
  {
    "cornerCoord": [61,20],
    "dims": [17, 17]
  },
  {
    "cornerCoord": [79,21],
    "dims": [19, 16]
  },
  {
    "cornerCoord": [0,38],
    "dims": [19, 22]
  },
  {
    "cornerCoord": [20,38],
    "dims": [8, 22]
  },
  {
    "cornerCoord": [29,38],
    "dims": [8, 22]
  },
  {
    "cornerCoord": [38,38],
    "dims": [22, 22]
  },
  {
    "cornerCoord": [61,38],
    "dims": [8, 22]
  },
  {
    "cornerCoord": [70,38],
    "dims": [8, 22]
  },
  {
    "cornerCoord": [79,38],
    "dims": [19, 22]
  },
  {
    "cornerCoord": [0,61],
    "dims": [19, 16]
  },
  {
    "cornerCoord": [20,61],
    "dims": [17, 17]
  },
  {
    "cornerCoord": [38,61],
    "dims": [22, 8]
  },
  {
    "cornerCoord": [38,70],
    "dims": [22, 8]
  },
  {
    "cornerCoord": [61,61],
    "dims": [17, 17]
  },
  {
    "cornerCoord": [79,61],
    "dims": [19, 16]
  },
  {
    "cornerCoord": [21,79],
    "dims": [16, 19]
  },
  {
    "cornerCoord": [38,79],
    "dims": [22, 19]
  },
  {
    "cornerCoord": [61,79],
    "dims": [16, 19]
  }
];

const obstacles = {
  "makeBlinkerPos" : [3, 3],
  "makeSquarePos" : [2, 2],
  "makeBargePos" : [4, 4],
  "makeHivePos" : [4, 3],
  "makeHatPos" : [5, 4],
  "makeBoatPos" : [3, 3],
  "makeLongBoatPos" : [5, 5],
  "makeBeaconPos" : [4, 4],
  "makeToadPos" : [4, 4],
  "makeBipolePos" : [5, 5],
  "makeP11Pos" : [22, 22],
  "makeP16Pos" : [15, 15],
  "makeCirclePos" : [11, 11],
  "makeEurekaPos" : [18, 15],
  "makeClipPos" : [9, 8],
  "make31Dot4Pos" : [13, 8],
  "makeCenturyEaterPos" : [8, 7],
  "makeLongShipPos" : [13, 13],
  "makeCyclicPos" : [10, 10],
  "makeCthulhuPos" : [11, 13],
};

// syntax for hussn
//console.log(obstacle.makeBargePos([5,5]));

app.use(express.json());
app.use(express.static("../public_html"));
app.use(session({ //https://codeshack.io/basic-login-system-nodejs-express-mysql/
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

app.get("/user", (req, res) => {
  res.json({ loggedIn: req.session.loggedin, username: req.session.username });
});

app.get("/logout", (req, res) => {
  req.session.loggedin = false;
  req.session.username = null;
  res.redirect('/home.html');
});

app.get('/', function (req, res) {
  res.redirect('/home.html');
})

app.get('/home', async (req, res) => {
  if (req.session.loggedin) {
    let u = req.session.username;
    let w = await database.getWins(u);
    let gp = await database.getGamesPlayed(u);
    //let s = await database.getStrength(u); ADD TO JSON => strength: s
    let userData = await database.getuserData();
    res.json({username: u,wins: w, gamesplayed: gp, users: userData})
  } else {
    let userData = await database.getuserData();
    res.json({message: "No user logged in", users: userData})
  }
})

app.get('/cellcolor', (req, res) => {
  let cellcolor = req.query.color;
  let user = req.session.username;
  console.log(cellcolor,user)
  database.setStyle(user,`background-color: ${cellcolor}`);
  res.status(200).send("Color updated");
})

let tempEnv = require("../env.json");
const { request, response } = require("express");
if (process.env._ && process.env._.indexOf("heroku"))
  tempEnv = require("../heroku.json");
const env = tempEnv

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
      pool.query("INSERT INTO userData (username, style, wins,gamesplayed) VALUES ($1,'',0,0)", [username]).then(response => {
        res.status(200).send("Account created");
      })
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
        req.session.loggedin = true;
        req.session.username = username;
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

//Precondish: duble with x, y coords of center of a glider, a string representing orientation of glider
//Postcondish: returns positions of cells needed to make glider
function makeGliderPos(gliderPos, orientation) {
  newPositions = [];
  switch(orientation) {
    case "SE":
      newPositions = [
        [gliderPos[0], gliderPos[1] -1],
        [gliderPos[0] + 1, gliderPos[1]],
        [gliderPos[0] - 1, gliderPos[1] + 1],
        [gliderPos[0], gliderPos[1] + 1],
        [gliderPos[0] + 1, gliderPos[1] + 1]
      ];
      break;
    case "NE":
      newPositions = [
        [gliderPos[0], gliderPos[1] - 1],
        [gliderPos[0] + 1, gliderPos[1] - 1],
        [gliderPos[0] - 1, gliderPos[1]],
        [gliderPos[0] + 1, gliderPos[1]],
        [gliderPos[0] + 1, gliderPos[1] + 1]
      ];
      break;
    case "NW":
      newPositions = [
        [gliderPos[0], gliderPos[1] - 1],
        [gliderPos[0] + 1, gliderPos[1] - 1],
        [gliderPos[0] - 1, gliderPos[1] - 1],
        [gliderPos[0] - 1, gliderPos[1]],
        [gliderPos[0], gliderPos[1] + 1]
      ];
      break;
    case "SW":
      newPositions = [
        [gliderPos[0] - 1, gliderPos[1] - 1],
        [gliderPos[0] - 1, gliderPos[1]],
        [gliderPos[0] + 1, gliderPos[1]],
        [gliderPos[0] - 1, gliderPos[1] + 1],
        [gliderPos[0], gliderPos[1] + 1]
      ];
      break;
  }
  return newPositions;
}

//Precondish: duble with x, y coords of a cell
//Postcondish: if cell is alive, return owner, otherwise returns Null
function isAlive(pos, room) {
  let activePieces = gameSessions[room].getActivePieces();
  for (let i = 0; i < activePieces.length; i++) {
    if (activePieces[i].getPos()[0] == pos[0] && activePieces[i].getPos()[1] == pos[1]) {
      return activePieces[i].getOwner();
    }
  }
  return null;
}

//Precondish: takes an x, y coordinate
//Postcondish: returns true if this is a valid cell in bounds of the table
function inBounds(xPos, yPos, room) {
  let dimensions = gameSessions[room].getDimensions();
  if (xPos >= dimensions["xMin"] && xPos <= dimensions["xMax"]) {
    if (yPos >= dimensions["yMin"] && yPos <= dimensions["yMax"]) {
      return true;
    }
  }
  return false;
}

function populateBoard(room) {
  let gameBoard = gameSessions[room].getObstacles();
  for (let i = 0; i < obstacleDims.length; i++) {
    let possibleObstacles = [];
    for (let functionName in obstacles) {
      if (obstacles[functionName][0] <= obstacleDims[i]["dims"][0] && obstacles[functionName][1] <= obstacleDims[i]["dims"][1]) {
        possibleObstacles.push(functionName);
      }
    }
    let pickedObstacle = possibleObstacles[getRandomInt(possibleObstacles.length)];
    let xPos = obstacleDims[i]["cornerCoord"][0] + getRandomInt(obstacleDims[i]["dims"][0] - obstacles[pickedObstacle][0]);
    let yPos = obstacleDims[i]["cornerCoord"][1] + getRandomInt(obstacleDims[i]["dims"][1] - obstacles[pickedObstacle][1]);
    let cornerPos = [xPos, yPos];
    let cellsToAdd = obstacle[pickedObstacle](cornerPos);
    for (let j = 0; j < cellsToAdd.length; j++) {
      let newPiece = new ActivePiece(cellsToAdd[j], gameBoard);
      gameSessions[room].addActivePiece(newPiece);
    }
  }

}

//Precondish: array of current active cell objects must be initialized
//Postcondish: doesn't return anything, replaces the activePieces array with the next generation of living cells
function nextGeneration(room) {
  let activePieces = gameSessions[room].getActivePieces();
  let tempCells = {};
  let contestedPositions = {};
  for (let cell = 0; cell < activePieces.length; cell++) {
    let xPos = activePieces[cell].getPos()[0];
    let yPos = activePieces[cell].getPos()[1];
    let owner = activePieces[cell].getOwner();
    //Check the 3x3 box around each living cell if any dead cells will be alive in the next generation
    for (let i = xPos - 1; i <= xPos + 1; i++) {
      for (let j = yPos - 1; j <= yPos + 1; j++) {
        if (isAlive([i,j], room) != owner && inBounds(i, j, room)) {
          neighbors = countLiveNeighbors([i,j], owner, room);
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
    if (inBounds(xPos, yPos, room)) {
      neighbors = countLiveNeighbors([xPos, yPos], owner, room);
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
  gameSessions[room].clearActivePieces();
  for (var pos in tempCells) {
    if (tempCells[pos] != null) {
      gameSessions[room].addActivePiece(tempCells[pos]);
    }
  }
  setPlayerStats(room);
}


// ;)
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

//Precondish: takes a duble with x, y coords of a cell, the owner of the cell
//Postcondish: the number of live neighbors to the specified cell
function countLiveNeighbors(pos, player, room) {
  neighbors = 0;
  for (let i = pos[0] - 1; i <= pos[0] + 1; i++) {
    for (let j = pos[1] - 1; j <= pos[1] + 1; j++) {
      //See if the cell has a neighbor that belongs to the same person, and is not itself.
      if (isAlive([i,j], room) != null && !(i == pos[0] && j == pos[1])) {
        neighbors ++;
      }
    }
  }
  //console.log(`Cell at pos: ${pos[0]}, ${pos[1]} has ${neighbors} live neighbors.`);
  return neighbors;
}

//Precondish: duble with x, y coords of center of a glider, a string representing orientation of glider, and a player object
//Postcondish: doesn't return anything, adds appropriate active cells objects to active pieces array
function makeGliders(gliders, player, room) {
  for (let i = 0; i < gliders.length; i++) {
    pos = gliders[i].pos;
    orientation = gliders[i].orientation;
    let newPositions = makeGliderPos(pos, orientation);
    for (let j = 0; j < newPositions.length; j++) {
      makeCell(newPositions[j], player, room);
    }
  }
}

//Precondish: must be active cells in activePieces array
//Postcondish: sets the strength stats for all players with active cells
function setPlayerStats(room) {
  let players = gameSessions[room].getLivingPlayers();
  let activePieces = gameSessions[room].getActivePieces();
  for (let i = 0; i < players.length; i++) {
    let strength = 0;
    let player = gameSessions[room].getPlayer(players[i]);
    for (let i = 0; i < activePieces.length; i++) {
      if (activePieces[i].getOwner().getId() == player.getId()) {
        strength ++;
      }
    }
    player.setStrength(strength);
    if (player.getStrength() == 0) {
      player.dead();
      gameSessions[room].setLivingPlayers();
    }
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
    winner.incrementCollisionsWon();
  }
  return cells;
}

//Precondish: takes a room to check if there are any winners
//Postcondish: returns true if winner(s) are determined, false if no one has won yet. If there is a tie (no players have any cells), all players alive in the previous generation are the winners.
//Updates the game session with the winners
function checkWinner(room) {
  let winningPlayers = [];
  if (gameSessions[room].getLivingPlayers().length == 0) {
    let winners = gameSessions[room].getAliveLastRound();
    for (let i = 0; i < winners; i++) {
      winningPlayers.push(gameSessions[room].getPlayer(winners[i]));
    }
    gameSessions[room].setWinners(winningPlayers);
    return true;
  }
  else if (gameSessions[room].getLivingPlayers().length == 1) {
    winningPlayers.push(gameSessions[room].getPlayer(gameSessions[room].getLivingPlayers()[0]));
    gameSessions[room].setWinners(winningPlayers);
    return true;
  }
  else {
    return false;
  }
}

//Precondish: Takes a room to change the zone coordinates
//Postcondish: Changes the active dimensions of the board (that living cell boundaries are calculated with). It randomly closes in by either 1 or 2 cells on all 4 sides.
//If the zone reaches the cell that was chosen at the beginning to close in on, it does not change.
function closeZone(room) {
  let closingCell = gameSessions[room].getClosingCell();
  let currentDimensions =  gameSessions[room].getDimensions();
  let newDimensions = {};
  if (closingCell[0] - currentDimensions["xMin"] <= 2) {
    newDimensions["xMin"] = closingCell[0] - 1;
  }
  else {
    newDimensions["xMin"] = currentDimensions["xMin"] + getRandomInt(1) + 1;
  }

  if (currentDimensions["xMax"] - closingCell[0] <= 2) {
    newDimensions["xMax"] = closingCell[0] + 1;
  }
  else {
    newDimensions["xMax"] = currentDimensions["xMax"] - (getRandomInt(1) + 1);
  }

  if (closingCell[1] - currentDimensions["yMin"] <= 2) {
    newDimensions["yMin"] = closingCell[0] - 1;
  }
  else {
    newDimensions["yMin"] = currentDimensions["yMin"] + getRandomInt(1) + 1;
  }

  if (currentDimensions["yMax"] - closingCell[1] <= 2) {
    newDimensions["yMax"] = closingCell[1] + 1;
  }
  else {
    newDimensions["yMax"] = currentDimensions["yMax"] - (getRandomInt(1) + 1);
  }

  gameSessions[room].setDimensions(newDimensions);
}

//Precondish: duble with x, y coords of a cell, an owner
//Postcondish: doesn't return anything, makes a new cell object and appends it to the activePieces array for the corresponding game session
function makeCell(pos, id, room) {
  let newCell = new ActivePiece(pos, gameSessions[room].getPlayer(id));
  gameSessions[room].addActivePiece(newCell);
}

//GET handler for sending client a JSON body of active cell objects
app.get("/cells", function(req, res) {
  console.log("GET request received.");
  let room = req.session.room;
  let activePieces = gameSessions[room].getActivePieces();
  let resActivePieces = [];
  for (i in activePieces) {
    resActivePieces.push({ "pos": activePieces[i].getPos(), "style": activePieces[i].getStyle() });
  }
  res.status(200);
  res.json(resActivePieces);
});

//for testing
app.get("/step", function(req, res) {
  let room = req.query.room;
  nextGeneration(room);
  res.sendStatus(200);
});

//for testing
app.get("/reset", function(req, res) {
  initTestBoard()
});

//Sequence of game events
function startGame(room) {
  gameSessions[room].setLivingPlayers();
  console.log(gameSessions[room].getLivingPlayers());
  io.to(room).emit('countdown', room);
  timer = setTimeout(getClientGliders, 30000, room);
}

function getClientGliders(room) {
  io.to(room).emit('sendGliders', room);
}

function phaseOne(room) {
  io.to(room).emit('phaseOne', room);
  let generations = 0;
  let generationInterval = setInterval(function() {
    nextGeneration(room);
    io.to(room).emit('nextGeneration', room);
    if (++generations % 5 == 0) {
      closeZone(room);
      io.to(room).emit('newZone', room);
    }
    if (checkWinner(room)) {
      io.to(room).emit('gameOver', room);
      clearInterval(generationInterval);
    }
  }, 250);
}

function playerInRoom(username) {
  for (let room in gameSessions) {
    if (gameSessions[room].playerIn(username)) {
      return room;
    }
  }
  return null;
}

async function fillRoom(username) {
  let newPlayer = await new Player(username);
  for (let room in gameSessions) {
    if (gameSessions[room].getNumPlayers() < 4) {
      gameSessions[room].addPlayer(newPlayer);
      if (gameSessions[room].getNumPlayers() == 4){
        gameSessions[room].addPlayer(newPlayer);
        console.log("Game starting.");
        startGame(room);
      }
      return room;
    }
  }
  let session = await new GameSession(`room${Object.keys(gameSessions).length + 1}`, [getRandomInt(10) + 45, getRandomInt(10) + 45]);
  session.addPlayer(newPlayer);
  gameSessions[session.getRoom()] = session;
  populateBoard(session.getRoom());
  return session.getRoom();
}

//POST handler for recieving a JSON body of center coordinates for gliders and their orientations
app.post("/gliders", function(req, res) {
  console.log("/gliders received post");
  let user = req.session.username;
  let gliders = req.body.gliders;
  let room = req.session.room;
  if (gameSessions[room].playerIn(user)) {
    makeGliders(gliders, user, room);
    gameSessions[room].addGlider();
    res.sendStatus(200);
    if (gameSessions[room].getGlidersReceived() == 4) {
      phaseOne(room);
    }
  }
  else {
    res.sendStatus(404);
  }
});

//GET handler for giving the client the coordinates for the quadrant they are in, also adds that player to a game session
app.get("/quadrant", async function(req, res) {
  if (!req.session.loggedin) {
    res.sendStatus(404);
  }
  else {
    //Check if player connecting is already in a game
    let id = req.session.username;
    let room = await fillRoom(id);
    req.session.room = room;
    let resBody = {
      "quadrant": gameSessions[room].getPlayer(id).getQuadrant(),
      "style": gameSessions[room].getPlayer(id).getStyle(),
      "room" : room
    };
    res.status(200);
    res.json(resBody);
  }
});


app.post("/updateUserStyle", (req, res) => {
  let username = req.session.username;
  database.setStyle(username, req.body.style);
});

//GET handler for getting the winner(s) of the game
app.get("/winners", function(req, res) {
  let room = req.session.room;
  res.status(200);
  
  //Add game played for each player
  let players = Object.keys(gameSessions[room].getPlayers());
  for (let i = 0; i < players.length; i++) {
    if (players[i] == req.session.username){
      database.addGamePlayed(players[i]);
      database.addStrength(players[i], gameSessions[room].getPlayer(players[i].getCollisionsWon()));
    }
  }
  //Add win for each winner
  let winners = gameSessions[room].getWinners();
  for (let i = 0; i < winners.length; i++) {
    if (req.session.username == winners[i].getId()) {
      database.addWin(winners[i].getId());
    }
  }
  res.json(winners);
  gameSessions[room].removePlayer(req.session.username);
  delete req.session.room;
  if (gameSessions[room].getNumPlayers() == 0) {
    delete gameSessions[room];
    console.log(gameSessions);
  }
});

//GET handler for updating the zone
app.get("/zone", function(req, res) {
  let room = req.session.room;
  res.status(200);
  res.json(gameSessions[room].getDimensions());
});

io.on("connect", socket => {
  console.log("Connected!");
  socket.on('joinRoom', room => {
    console.log('player joined room: ' + room);
    socket.join(room);
  });
  socket.on('leaveRoom', room => {
    console.log('player left room: ' + room);
    socket.leave(room);
  });
});

app.get("/games", (req, res) => {
  res.json(gameSessions);
})

server.listen(port, function() {
  console.log(`Server listening on post: http://${hostname}:${port}`);
});