//#region Classes

class Player {
    constructor(id, style, strength = 0) {
        this.id = id;
        this.style = style;
        this.strength = strength;
    }
    getStyle() {
        return this.style;
    }
    setStrength(strength) {
        this.strength = strength;
    }
    getStrength() {
        return this.strength;
    }
    getId() {
        return this.id;
    }
}

//linked list nodes for cycling through orientations
class Orientation {
    constructor(orientation, next = null) {
        this.orientation = orientation;
        this.next = next;
    }
    getOrientation() {
        return this.orientation;
    }
    getNext() {
        return this.next;
    }
    setNext(next) {
        this.next = next;
    }
}

let NW = new Orientation("NW");
let SW = new Orientation("SW", NW);
let SE = new Orientation("SE", SW);
let NE = new Orientation("NE", SE);
NW.setNext(NE);
let orientations = {    
    "NW": NW,
    "NE": NE,
    "SE": SE,
    "SW": SW,
}

class Glider {
    constructor(centerPos, orientation) {
        this.centerPos = centerPos; //currently centerPos must be a valid coordinate when created
        this.orientation = orientation;
        this.dimensions = [1, 1, 1, 1]; //how far the glider extends in each direction. order: +x -x +y -y. 
        this.lastCoords = null;
    }
    changeOrientation() {
        this.lastCoords = this.getActiveCoords() 
        this.orientation = this.orientation.getNext();
    }
    getOrientation() {
        return this.orientation.getOrientation();
    }
    getCenterPos() {
        return this.centerPos;
    }
    getLastCoords() {
        return this.lastCoords;
    }
    setCenterPos(pos) { 
        if(!(pos[0] == this.getCenterPos()[0] && pos[1] == this.getCenterPos()[1])) {
            this.lastCoords = this.getActiveCoords() 
        }
        this.centerPos = pos;
    }
    getActiveCoords() {
        return makeGliderPos(this.getCenterPos(), this.getOrientation());
    }
    getOccupyingCoords() { //3x3 grid, 9 cells total that cannot have other cells on it.
        let coords = [];
        let cp = this.getCenterPos();
        coords.push([cp[0], cp[1]]);
        coords.push([cp[0]+1, cp[1]]);
        coords.push([cp[0]-1, cp[1]]);
        coords.push([cp[0], cp[1]+1]);
        coords.push([cp[0], cp[1]-1]);
        coords.push([cp[0]+1, cp[1]+1]);
        coords.push([cp[0]+1, cp[1]-1]);
        coords.push([cp[0]-1, cp[1]+1]);
        coords.push([cp[0]-1, cp[1]-1]);
        return coords;
    }
}

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

const quadrants = {
    "1": {"xMin": 0,
        "xMax": 19,
        "yMin": 0,
        "yMax": 19
    },
    "2": {"xMin": 80,
        "xMax": 99,
        "yMin": 0,
        "yMax": 19
    },
    "3": {"xMin": 80,
        "xMax": 99,
        "yMin": 80,
        "yMax": 99
    },
    "4": {"xMin": 0,
        "xMax": 19,
        "yMin": 80,
        "yMax": 99
    }
};

let activeCoords;
let clientColor;

//#endregion

//#region Global Variables

const gliderLimit = 3;
let players = [];
let canPlaceGliders = true;
let placedGliders = []; //a table of placed Glider class objects.
let curGlider = new Glider([0,0], NW);
let allowBoardInput = false;
let baseTableDim = [99, 99];
let gameBoard = document.getElementById("game-of-life");
let boardCells = {};
const startCoords = {
    "xMin": 0,
    "xMax": baseTableDim[0],
    "yMin": 0,
    "yMax": baseTableDim[1]
}

//#endregion

//#region Board Functions

function createBoard() {
    //Create representation of board
    for (let i = 0; i < baseTableDim[0]; i++) {
        for (let j = 0; j < baseTableDim[1]; j++) {
            boardCells[`${i}:${j}`] = { "style": "", "inBounds": true };
        }
    }
    addQuadrant();
    for (let i = 0; i < baseTableDim[1]; i++) {
        let row = document.createElement("tr");
        gameBoard.append(row);
        for (let j = 0; j < baseTableDim[0]; j++) {
            let col = document.createElement("td");
            col.id = `${j},${i}`;
            row.append(col);
        }
    }
    addListeners();
}

function drawBounds() {
    for (let i = 0; i < baseTableDim[0]; i++) {
        for (let j = 0; j < baseTableDim[1]; j++) {
            let cellId = [i, j]
            let cell = document.getElementById(cellId[0] + "," + cellId[1]);
            if (!boardCells[`${i}:${j}`].inBounds) {
                cell.classList.add("da-circle");
            }
            else {
                $(cell).removeClass("outta-bounds");
                $(cell).removeClass("da-circle");
            }
        }
    }
}

function getBoard() {
    clearBoard();
    fetch(`/cells`).then(response => {
        return response.json();
    }).then(data => {
        players = data[0].players;
        for (let i = 1; i < data.length; i++) {
            let x = data[i].pos[0];
            let y = data[i].pos[1];
            boardCells[`${x}:${y}`].style = data[i].style;
        }
        drawBoard();
        updatePlayers();
    });
}

function addQuadrant() {
    for (let coords in boardCells) {
        let pos = coords.split(":");
        if (!validPos(pos)) {
            boardCells[coords].inBounds = false;
        }
        else {
            boardCells[coords].inBounds = true;
        }
    }
}

function drawBoard() {    
    console.log("drawing board");
    let rows = gameBoard.querySelectorAll("tr");
    for (let i = 0; i < baseTableDim[1]; i++) {
        let cells = rows[i].querySelectorAll("td");
        for (let j = 0; j < baseTableDim[0]; j++) {
            cells[j].style = boardCells[`${j}:${i}`].style;
            if (canPlaceGliders)
                if (!boardCells[`${j}:${i}`].inBounds && boardCells[`${j}:${i}`].style == "") 
                    cells[j].classList.add("outta-bounds");                
        }
    }
}

function clearBoard() {
    for (let coord in boardCells) {
        boardCells[coord].style = "";
    }
}

//#endregion


//precondition: cell position array of two integers [x, y], boundary of the x quadrant, boundary of the y quadrant. 
//postcondition: boolean that is true if the given coordinates are in bounds and false otherwise.
//used to show where quadrants should exist.
function validPos(pos) {
    return pos[0] >= activeCoords["xMin"] && pos[0] <= activeCoords["xMax"] && pos[1] >= activeCoords["yMin"] && pos[1] <= activeCoords["yMax"];
}

//precondition: glider to be placed
//postcondition: boolean that is true if the glider's dimensions fit within the bounds of the quadrant.
//takes the glider's size into account to prevent gliders from being placed partially outside of the quadrant. validPos does not do this.
function isGliderInBounds(glider) {
    let pos = glider.getCenterPos();
    let dimensions = glider.dimensions;
    return (pos[0] - dimensions[1]) >= activeCoords["xMin"] && (pos[0] + dimensions[0]) <= activeCoords["xMax"] && (pos[1] -dimensions[3]) >= activeCoords["yMin"] && (pos[1] + dimensions[2]) <= activeCoords["yMax"];
}

//precondition: cell.id, which is a string with two coordinates separated by ","
//postcondition: cell position array of two integers [x, y]. NOTE: this needs to be swapped using the swapCoordinates function later since cells are currently positioned as [y, x] in the cell id.
function getCellCoords(cell) {
    let cellNumbers = cell.id.split(",");
    let cellX = parseInt(cellNumbers[0]);
    let cellY = parseInt(cellNumbers[1]);
    let clientCoords = [cellX, cellY];
    return clientCoords;
}

function removeTransCells() {
    let cells = curGlider.getActiveCoords();
    if(cells != null) {
        for(i=0; i<cells.length; i++) {
            let cellId = cells[i];
            let cell = document.getElementById(cellId[0] + "," + cellId[1]);
            $(cell).removeClass("transparent");
            $(cell).removeClass("invalid");
        }
    }
}

//checks to see if the coordinate is being used by another glider
//inefficient.
// function isCoordTaken(coords) {
//     for(i=0; i<placedGliders.length; i++) {
//         let occupyingCoords = placedGliders[i].getOccupyingCoords();
//         for(j=0; j<occupyingCoords.length; j++) {
//             if(occupyingCoords[j][0] === coords[0] && occupyingCoords[j][1] === coords[1]) {
//                 return true;
//             }
//         }
//     }
//     return false;
// }

function getCenterDiff(coord1, coord2) {
    let xDiff = Math.abs(coord1[0] - coord2[0]);
    let yDiff = Math.abs(coord1[1] - coord2[1]);
    return [xDiff, yDiff];
}

function areCoordsTaken(coords) {
    for(i=0; i<placedGliders.length; i++) {
        let diff = getCenterDiff(placedGliders[i].getCenterPos(), coords);
        if(diff[0]<=3 && diff[1]<=3) {
            return true;
        } 
    }
    return false;
}

function previewGlider() {
    let cells = curGlider.getActiveCoords();
    let centerPos = curGlider.getCenterPos();
    let isTaken = areCoordsTaken(curGlider.getCenterPos());
    if(curGlider.getCenterPos()[0] === centerPos[0] && curGlider.getCenterPos()[1] === centerPos[1]) {
        for (i = 0; i < cells.length; i++) {
            let cellId = cells[i];
            let cell = document.getElementById(cellId[0] + "," + cellId[1]);
            if (cell == null  || !validPos(cellId)) {
                removeTransCells();
                //$("td").removeClass("transparent");
                break;
            }
            cell.classList.add("transparent");
            if(isTaken) {
                $(cell).addClass("invalid");
            }
        }
    }
}

//place glider at where the mouse is clicked on the board on the client side, returns true if glider is placed
function placeGlider(cell) {
    if (!areCoordsTaken(curGlider.getCenterPos()) && isGliderInBounds(curGlider) && canPlaceGliders) {
        placedGliders.push(new Glider(curGlider.getCenterPos(), curGlider.orientation));
        updateGliderText();
        if (placedGliders.length > gliderLimit) {
            placedGliders.shift();
        }
        return true;
    }
    else {
        return false;
    }   
}

function sendGliders() {
    let glidersBody = [];
    for (let i = 0; i < placedGliders.length; i++) {
        glidersBody.push({ pos: placedGliders[i].getCenterPos(), orientation: placedGliders[i].getOrientation() })
    }
    fetch("/gliders", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({  //TODO: if theres fewer than 3 placed gliders, this errors.
            gliders: glidersBody
        })
    });    
    placedGliders = [];
    $("td").removeClass("outta-bounds");
    getBoard('test');
}

function rotateGlider() {
    curGlider.changeOrientation();
}

function clearGliders() {
    for (i in placedGliders) {        
        let cells = placedGliders[i].getActiveCoords();
        for (j = 0; j < cells.length; j++) {
            let cellId = cells[j];
            let cell = document.getElementById(cellId[0] + "," + cellId[1]);
            cell.style = "";        
        }
    }
}

function showGliders() {    
    for (i in placedGliders) {        
        let cells = placedGliders[i].getActiveCoords();
        for (j = 0; j < cells.length; j++) {
            let cellId = cells[j];
            let cell = document.getElementById(cellId[0] + "," + cellId[1]);
            cell.style = clientColor;
        }
    }
}

function updateGliderText() {
    let numRemaining = gliderLimit - placedGliders.length;
    if (numRemaining<0) {
        numRemaining = 0;
    } 
    if(canPlaceGliders) {
        let phaseElement = document.getElementById("phase");
        phaseElement.textContent = "Phase: Placing Gliders. Left click: place, Right click: rotate. " +numRemaining+ " glider(s) remaining.";
    }
}

function getPlayers() {
    fetch('/players').then(response => {
        return response.json();
    }).then(data => {
        console.log(data);
        players = data;
        updatePlayers();
    });
}

  

function updatePlayers() {  
    let html = "";
    let sorted = [];

    for (user in players) {
        sorted.push([user, players[user].strength])
    }
    sorted.sort(function(first, second) {
        return second[1] - first[1];
    });

    for (i in sorted) {
        html += players[sorted[i][0]].alive ? `<div class='player'>` : `<div class='dead player'>`;
        html += `<div class='player-icon' style='${players[sorted[i][0]].style}'></div><div class='player-name'>&nbsp&nbsp${sorted[i][0]}</div>`//<div class='player-strength'>${data[user].strength}</div>`;
        html += `</div>`;
        console.log(html);
    }
    $('#players').html(html);
}

function dawson() {
    document.body.className = "dawson";
}

let cheat = "";
document.addEventListener("keypress", function(event) {
    cheat += String.fromCharCode(event.keyCode);
    if (cheat.includes("dawson"))
        dawson();
});

function test() {
    canPlaceGliders = false;
}
function test1() {
    drawBoard();
}

//These are for Hoff
//This signals the start of the game. A 30 second countdown timer should start (along with some basic instructions). This is the only time gliders should be allowed to be placed.
function startCountdown() {
    console.log("countdown begun!");
    let secondsLeft = 30;
    let timerElement = $('#countdown h1');
    let timerLabel = $('#countdown-label');
    updateGliderText();
    timerLabel.text("Game Begins In...");
    let interval = setInterval(() => {
        if(secondsLeft>0) {            
            timerElement.addClass('spin-animation');
            timerElement.text(secondsLeft);
            secondsLeft -= 1;            
            timerElement.on('animationend', () => {
                $('#countdown h1').removeClass('spin-animation');
            });
        }
        else {
            canPlaceGliders = false;
            clearInterval(interval);
            timerElement.text("");
            timerLabel.text("");
        }
    }, 1000);       
}

function setBoard(quadrant, style) {
    activeCoords = quadrants[quadrant];
    clientColor = style;
    createBoard();
}

//The board should be redrawn here so the out of bounds cells are removed from the board, and all players gliders should be recieved from the server, then drawn on the board
function phaseOne() {
    //3 2 1 timer?
    canPlaceGliders = false;
    console.log("phase one...");
    getNewZone();
    removeTransCells();
    drawBoard();
    updatePlayers();
}



//Every time this is called, the cells should be recieved from the server and drawn on the board
function getNextGeneration() {
    getBoard();
}

//When this is called get the new board dimensions from the server. Add the out of bounds class to any cells not within the dimensions
function getNewZone() {
    fetch(`/zone`).then(response => {
        return response.json();
    }).then(data => {
        activeCoords["xMax"] = data["xMax"]
        activeCoords["yMax"] = data["yMax"]
        activeCoords["xMin"] = data["xMin"]
        activeCoords["yMin"] = data["yMin"]
        addQuadrant();
        drawBounds();
    });
}

//Get the winner(s) from the server. Display a message about who won, clear the board. Special message if this client is one of the winners
function gameOver() {
    let winnerElement = document.getElementById("generations");
    fetch(`/winners`).then(response => {
        return response.json();
    }).then(data => {
        winnerText = "Winners: "
        for (i = 0; i < data.length; i++) {
            winnerText += `${data[i].id} `;
        }
        winnerElement.textContent = winnerText;
    });
}

function addListeners() {
    $(document).ready(() => {
        $("#game-of-life td").on("click", cell => {
            clearGliders();
            curGlider.setCenterPos(getCellCoords(cell.target));
            if (placeGlider(cell.target)){
                removeTransCells();
            }    
            showGliders();
        });
        $("#game-of-life td").on("mouseover", cell => {
            removeTransCells();
            curGlider.setCenterPos(getCellCoords(cell.target))
            if(canPlaceGliders) {
                previewGlider();
            }
        });
    
        $("#game-of-life").on("contextmenu", cell => {
            removeTransCells();
            curGlider.setCenterPos(getCellCoords(cell.target))
            rotateGlider();
            previewGlider();
            cell.preventDefault();
        });
    });
}

