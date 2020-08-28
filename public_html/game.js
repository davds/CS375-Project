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
let placedGliders = []; //a table of placed Glider class objects.
let curGlider = new Glider([0,0], NW);
let allowBoardInput = false;
let baseTableDim = [99, 99];
let gameBoard = document.getElementById("game-of-life");
let boardCells = {};


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
            if (!boardCells[`${j}:${i}`].inBounds) {
                col.classList.add("outta-bounds");
            }
            row.append(col);
        }
    }
    addListeners();
}

function getBoard(room) {
    clearBoard();
    fetch(`/cells?room=${room}`).then(response => {
        return response.json();
    }).then(data => {
        for (let i = 0; i < data.length; i++) {
            let x = data[i].pos[0];
            let y = data[i].pos[1];
            boardCells[`${x}:${y}`].style = data[i].style;
        }
        drawBoard();
    });
}

function addQuadrant() {
    for (let coords in boardCells) {
        let pos = coords.split(":");
        if (!validPos(pos)) {
            boardCells[coords].inBounds = false;
        }
    }
}

function drawBoard() {
    let rows = gameBoard.querySelectorAll("tr");
    for (let i = activeCoords["yMin"]; i < activeCoords["yMax"]; i++) {
        let cells = rows[i].querySelectorAll("td");
        for (let j = activeCoords["xMin"]; j < activeCoords["xMax"]; j++) {
            if (boardCells[`${j}:${i}`].inBounds) {
                cells[j].style = boardCells[`${j}:${i}`].style;
            }
            else {
                cells[j].classList.add("outta-bounds");
            }
        }
    }
}

function clearBoard() {
    for (let coord in boardCells) {
        boardCells[coord].style = "";
    }
}

function resetBoard() {
    fetch("/reset").then(response => {
        drawBoard();
    });
}
//testing (for now)
function nextGen() {
    fetch("/step?room=test").then(response => {
        getBoard("test");
    });
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
    if (!areCoordsTaken(curGlider.getCenterPos()) && isGliderInBounds(curGlider)) {
        placedGliders.push(new Glider(curGlider.getCenterPos(), curGlider.orientation));
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
    fetch("/gliders", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            gliders: [ 
                { pos: placedGliders[0].getCenterPos(), orientation: placedGliders[0].getOrientation() },
                { pos: placedGliders[1].getCenterPos(), orientation: placedGliders[1].getOrientation() },
                { pos: placedGliders[2].getCenterPos(), orientation: placedGliders[2].getOrientation() },
            ],
            room: "test"
        })
    });    
    placedGliders = [];
    $("td").removeClass("solid");
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

//Add player to a game session object and get the quadrant player is in
function addPlayer() {
    fetch("/quadrant").then(response => {
        if (response.status == 200) {
            response.json().then(data => {
                console.log("Quadrant:" + data.quadrant);
                console.log("style:" + data.style);
                activeCoords = quadrants[data.quadrant];
                clientColor = data.style;
                createBoard();
            });
        }
        else {
            alert("Please log in.");
        }
    });
}

//These are for Hoff

//This signals the start of the game. A 30 second countdown timer should start (along with some basic instructions). This is the only time gliders should be allowed to be placed.
function startCountdown() {
    return
}

//The board should be redrawn here so the out of bounds cells are removed from the board, and all players gliders should be recieved from the server, then drawn on the board
function phaseOne() {
    return
}

//Every time this is called, the cells should be recieved from the server and drawn on the board
function getNextGeneration() {
    return
}

//When this is called get the new board dimensions from the server. Add the out of bounds class to any cells not within the dimensions
function getNewZone() {
    return
}

//Get the winner(s) from the server. Display a message about who won, clear the board. Special message if this client is one of the winners
function gameOver() {
    return
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
            previewGlider();
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

