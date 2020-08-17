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
    }
    changeOrientation() {
        this.orientation = this.orientation.getNext();
    }
    getOrientation() {
        return this.orientation.getOrientation();
    }
    getCenterPos() {
        return this.centerPos;
    }
    setCenterPos(pos) { //TODO: get boundaries of quadrant instead of entire board.
        this.centerPos = pos;
    }
    getActiveCoordinates() {
        return shared.makeGliderPos(this.getCenterPos(), this.getOrientation());
    }
    getOccupyingCoordinates() { //3x3 grid, 9 cells total that cannot have other cells on it.
        let coordinates = [];
        let cp = this.getCenterPos();
        coordinates.push([cp[0], cp[1]]);
        coordinates.push([cp[0]+1, cp[1]]);
        coordinates.push([cp[0]-1, cp[1]]);
        coordinates.push([cp[0], cp[1]+1]);
        coordinates.push([cp[0], cp[1]-1]);
        coordinates.push([cp[0]+1, cp[1]+1]);
        coordinates.push([cp[0]+1, cp[1]-1]);
        coordinates.push([cp[0]-1, cp[1]+1]);
        coordinates.push([cp[0]-1, cp[1]-1]);
        return coordinates;
    }
}

//#endregion

//#region Global Variables

const gliderLimit = 3;
let placedGliders = []; //a table of placed Glider class objects.
let curGlider = new Glider([0,0], NW);

let transGlider = null 
let allowBoardInput = false;
let baseTableDim = [99, 99];
let gameBoard = document.getElementById("game-of-life");
let boardCells = {};
for (let i = 0; i < baseTableDim[0]; i++) {
    for (let j = 0; j < baseTableDim[1]; j++) {
        boardCells[`${i}:${j}`] = { "style": "", "inBounds": true };
    }
}

//#endregion

//#region Board Functions

function createBoard(r, c) {
    let board = document.getElementById("game-of-life");
    //createQuadrantLines();
    for (let i = 0; i < r; i++) {
        let row = document.createElement("tr");
        board.append(row);
        for (let j = 0; j < c; j++) {
            let col = document.createElement("td");
            col.id = `${i},${j}`;
            row.append(col);
        }
    }
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

function drawBoard() {
    let rows = gameBoard.querySelectorAll("tr");
    for (let i = 0; i < baseTableDim[0].length; i++) {
        let cells = rows[i].querySelectorAll("td");
        for (let j = 0; j < baseTableDim[1].length; j++) {
            cells[j].style = boardCells[`${i}:${j}`].style
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
        updateBoard();
    });
}
//testing (for now)
function nextGen() {
    console.log("clicked");
    fetch("/step").then(response => {
        updateBoard();
    });
}

//#endregion


//precondition: cell position array of two integers [x, y], boundary of the x quadrant, boundary of the y quadrant. 
//postcondition: boolean that is true if the given coordinates are in bounds and false otherwise.
function isCenterPosValid(pos, bX=baseTableDim[0] + 1, bY=baseTableDim[1] + 1) {
    return pos[0] > 0 && pos[1] > 0 && pos[0] < (bX - 1) && pos[1] < (bY - 1);
}

//removes all transparent cells from board (fake gliders).
function removeTransCells() { 
    let transElements = document.querySelectorAll(".transparent"); //document.getElementsByClassName("transparent") didn't work for no reason.
    for (i = 0; i < transElements.length; i++) {
        transElements[i].classList.remove("transparent");
    }
}

//precondition: any type of any object.
//postcondition: a boolean that is true if the object exists (not null and not undefined), false otherwise.
function doesExist(val) {
    if (val != null && typeof val != 'undefined') {
        return true
    }
    return false
}

//precondition: cell.id, which is a string with two coordinates separated by ","
//postcondition: cell position array of two integers [x, y]. NOTE: this needs to be swapped using the swapCoordinates function later since cells are currently positioned as [y, x] in the cell id.
function getCellCoords(cell) {
    let cellNumbers = cell.id.split(",");
    let cellX = parseInt(cellNumbers[0]);
    let cellY = parseInt(cellNumbers[1]);
    let clientCoordinates = [cellX, cellY];
    return clientCoordinates;
}

function previewGlider() {
    let cells = curGlider.getActiveCoordinates();
    $("td").removeClass("transparent");

    for (i = 0; i < cells.length; i++) {
        let cellId = cells[i];
        let cell = document.getElementById(cellId[0] + "," + cellId[1]);
        console.log(cell);
        if (cell == null) {
            $("td").removeClass("transparent");
            break;
        }

        cell.classList.add("transparent");        
    }
}

//place glider at where the mouse is clicked on the board on the client side
function placeGlider(cell) {
    console.log("glider placed");
    placedGliders.push(new Glider(curGlider.getCenterPos(), curGlider.getOrientation()));
    if (placedGliders.length > gliderLimit)
        placedGliders.shift();
    console.log(placedGliders);
}

function sendGliders() { 
    fetch("/gliders").then({
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
    }).then(data => {        
        console.log(data);
    });
}

createBoard(baseTableDim[0], baseTableDim[1]);

function rotateGlider() {
    curGlider.changeOrientation();
    console.log(curGlider);
}


$(document).ready(() => {
    $("#game-of-life td").on("click", cell => {
        curGlider.setCenterPos(getCellCoords(cell.target));
        placeGlider(cell.target);
    });

    $("#game-of-life td").on("mouseover", cell => {
        curGlider.setCenterPos(getCellCoords(cell.target))
        previewGlider();
    });

    $("#game-of-life").on("contextmenu", cell => {
        curGlider.setCenterPos(getCellCoords(cell.target))
        rotateGlider();
        previewGlider();
        cell.preventDefault();
    });
})


/*document.addEventListener('contextmenu', function (e) {
    rotateGlider();
    showGlider(prevCell, true);
    e.preventDefault();
}, false);*/
