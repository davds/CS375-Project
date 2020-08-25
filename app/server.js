//leo was here
const pg = require("pg");
const bcrypt = require("bcrypt");
const express = require("express");
const session = require("express-session");
const app = express();
const {Player, ActivePiece, GameSession} = require("./classes.js");
const database = require("./database.js");
const {makeGliderPos} = require("../public_html/shared.js");
const hostname = "localhost";
const port = process.env.PORT || 3000;
const server = require('http').createServer(app);
const options = {
  perMessageDeflate: false,
};
const io = require('socket.io').listen(server, options);
let gameSessions = {"test": new GameSession("test")};
gameSessions["test"].addPlayer(new Player("davd"));
gameSessions["test"].addPlayer(new Player("hoff", "background-color: red;"));

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
});

app.get('/home', (req, res) => {
  if (req.session.loggedin) {
    database.getGamesPlayed()
    let u = req.session.username;
    res.json({username: u,wins: database.getWins(u), gamesplayed: database.getGamesPlayed(u)})
  } else {
    res.json({message: "No user logged in"})
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

//Precondish: takes a username and the css styling of their cells
//Postcondish: adds the player to an existing session object or creates a new one for them, returns room name
function addPlayer(username) {
  //Create player object
  let player = new Player(username);
  //See if a game session exists
  if (Object.keys(gameSessions).length == 0) {
    let session = new GameSession('room1');
    session.addPlayer(player);
    gameSessions[session.getRoom()] = session;
    return session.getRoom();
  }
  //See if a new session needs to be made
  else if (gameSessions[Object.keys(gameSessions)[Object.keys(gameSessions).length-1]].getNumPlayers() == 4){
    let session = new GameSession(`room${gameSessions.length + 1}`);
    session.addPlayer(player);
    gameSessions[session.getRoom()] = session;
    return session.getRoom();
  }
  else {
    gameSessions[Object.keys(gameSessions)[Object.keys(gameSessions).length-1]].addPlayer(player);
    if (gameSessions[Object.keys(gameSessions)[Object.keys(gameSessions).length-1]].getNumPlayers() == 4) {
      startGame(Object.keys(gameSessions)[Object.keys(gameSessions).length-1]);
    }
    return gameSessions[Object.keys(gameSessions)[Object.keys(gameSessions).length-1]].getRoom();
  }
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
  tempCells = checkCollision(contestedPositions, tempCells, room);
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
      if (isAlive([i,j], room) == player && !(i == pos[0] && j == pos[1])) {
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
  let players = gameSessions[room].getPlayers();
  let activePieces = gameSessions[room].getActivePieces();
  for (let id in players) {
    player = players[id];
    strength = 0;
    for (let i = 0; i < activePieces.length; i++) {
      if (activePieces[i].getOwner() == id) { 
        strength ++;
      }
    }
    player.setStrength(strength);
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
//Postcondish: doesn't return anything, makes a new cell object and appends it to the activePieces array for the corresponding game session
function makeCell(pos, id, room) {
  newCell = new ActivePiece(pos, gameSessions[room].getPlayer(id));
  gameSessions[room].addActivePiece(newCell);
}

//GET handler for sending client a JSON body of active cell objects
app.get("/cells", function(req, res) {
  let room = req.query.room;
  let activePieces = gameSessions[room].getActivePieces();
  let resActivePieces = [];
  for (i in activePieces) {
    resActivePieces.push({ "pos": activePieces[i].getPos(), "style": activePieces[i].getStyle() });
  }
  res.status(200);
  res.json(resActivePieces);
});

app.get("/step", function(req, res) {
  let room = req.query.room;
  nextGeneration(room);
  res.sendStatus(200);
});

app.get("/reset", function(req, res) {
  initTestBoard()  
});

//Sequence of game events
function startGame(room) {
  io.to(room).emit('countdown', room);
  timer = setTimeout(phaseOne, 30000, room);
}

function phaseOne(room) {
  io.to(room).emit('phaseOne', room);
}

//POST handler for recieving a JSON body of center coordinates for gliders and their orientations
app.post("/gliders", function(req, res) {
  console.log("/gliders received post");
  let user = req.session.username;
  let gliders = req.body.gliders;
  let room = req.body.room;
  if (gameSessions[room].playerIn(user)) {
    makeGliders(gliders, user, room);
    res.sendStatus(200);
  }
  else {
    res.sendStatus(404);
  }
});

//GET handler for giving the client the coordinates for the quadrant they are in, also adds that player to a game session
app.get("/quadrant", function(req, res) {
  if (!req.session.loggedin) {
    res.sendStatus(404);
  }
  else {
    let id = req.session.username;
    let room = addPlayer(id);
    console.log(gameSessions[room]);
    let resBody = {
      "quadrant": gameSessions[room].getNumPlayers(),
      "style": gameSessions[room].getPlayer(id).getStyle()
    };
    res.status(200);
    res.json(resBody);
  }
});

io.on("connect", socket => {
  console.log("Connected!");
  socket.emit('next', 'hello');
});


server.listen(port, function() {
  console.log(`Server listening on post: http://${hostname}:${port}`)
});

