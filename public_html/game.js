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
        if(pos[0] != this.getCenterPos()[0] || pos[1] != this.getCenterPos()[1]) {
            this.lastCoords = this.getActiveCoords() 
        }
        this.centerPos = pos;
    }
    getActiveCoords() {
        return shared.makeGliderPos(this.getCenterPos(), this.getOrientation());
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
        "xMax": 15,
        "yMin": 0,
        "yMax": 15
    },
    "2": {"xMin": 84,
        "xMax": 99,
        "yMin": 0,
        "yMax": 15
    },
    "3": {"xMin": 84,
        "xMax": 99,
        "yMin": 84,
        "yMax": 99
    },
    "4": {"xMin": 0,
        "xMax": 15,
        "yMin": 84,
        "yMax": 99
    }
};
let activeCoords;

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
            else {
                col.classList.add("in-bounds");
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
function validPos(pos) {
    return pos[0] >= activeCoords["xMin"] && pos[0] <= activeCoords["xMax"] && pos[1] >= activeCoords["yMin"] && pos[1] <= activeCoords["yMax"];
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
    let cells = curGlider.getLastCoords();
    if(cells != null) {
        for(i=0; i<cells.length; i++) {
            let cellId = cells[i];
            let cell = document.getElementById(cellId[0] + "," + cellId[1]);
            if(cell === null) {
                return;
            }
            $(cell).removeClass("transparent");
        }
    }
}

function previewGlider() {
    let cells = curGlider.getActiveCoords();
    let centerPos = curGlider.getCenterPos();
    //$("td").removeClass("transparent");
    let d = new Date();
    let t1 = d.getTime();
    removeTransCells();
    let d2 = new Date();
    let t2 = d2.getTime(); 
    console.log(t2-t1, t1, t2);
    if(curGlider.getCenterPos()[0] === centerPos[0] && curGlider.getCenterPos()[1] === centerPos[1]) {
        for (i = 0; i < cells.length; i++) {
            let cellId = cells[i];
            let cell = document.getElementById(cellId[0] + "," + cellId[1]);
            if (cell == null) {
                removeTransCells();
                //$("td").removeClass("transparent");
                break;
            }
            cell.classList.add("transparent");        
        }
    }
}

//place glider at where the mouse is clicked on the board on the client side
function placeGlider(cell) {
    placedGliders.push(new Glider(curGlider.getCenterPos(), curGlider.orientation));
    if (placedGliders.length > gliderLimit)
        placedGliders.shift();
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

function showGliders() {    
    $("td").removeClass("solid");
    for (i in placedGliders) {        
        let cells = placedGliders[i].getActiveCoords();
        for (i = 0; i < cells.length; i++) {
            let cellId = cells[i];
            let cell = document.getElementById(cellId[0] + "," + cellId[1]);
            cell.classList.add("solid");              
        }
    }
}

//Add player to a game session object and get the quadrant player is in
function addPlayer() {
    fetch("/quadrant").then(response => {
        if (response.status == 200) {
            response.json().then(data => {
                console.log("Quadrant:" + data.quadrant);
                activeCoords = quadrants[data.quadrant];
                createBoard();
            });
        }
        else {
            alert("Please log in.");
        }
    });
}

function addListeners() {
    $(document).ready(() => {
        $("#game-of-life td").on("click", cell => {
            curGlider.setCenterPos(getCellCoords(cell.target));
            placeGlider(cell.target);
            showGliders();
        });
    
        $("#game-of-life td").on("mouseover", cell => {
            clearPreviewGlider();
            curGlider.setCenterPos(getCellCoords(cell.target))
            previewGlider();
        });
    
        $("#game-of-life").on("contextmenu", cell => {
            clearPreviewGlider();
            curGlider.setCenterPos(getCellCoords(cell.target))
            rotateGlider();
            previewGlider();
            cell.preventDefault();
        });
    });
}

