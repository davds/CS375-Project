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

let orientations = {
    "SW": new Orientation("SW"),
    "SE": new Orientation("SE", SW),
    "NE": new Orientation("NE", SE),
    "NW": new Orientation("NW", NW)
}
orientations["SW"].setNext(NW);

class Glider {
    constructor(centerPos, orientation) {
        this.centerPos = centerPos; //currently centerPos must be a valid coordinate when created
        this.orientation = orientation;
    }
    changeOrientation() {
        this.orientation = orientation.getNext();
    }
    getOrientation() {
        return orientation.getOrientation();
    }
    getCenterPos() {
        return this.centerPos;
    }
    setCenterPos(pos, bX = boardWidth, bY = boardHeight) { //TODO: get boundaries of quadrant instead of entire board.
        if (isCenterPosValid(pos)) {
            this.centerPos = coordinate;
        }
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

let placedGliders = []; //a table of placed Glider class objects.
let transGlider = null 
let allowBoardInput = false;
let baseTableDim = [99,99];
let gameBoard = document.getElementById("game-of-life");
let boardCells = {};
for (let i = 0; i < baseTableDim[0]; i++) {
    for (let j = 0; j < baseTableDim[1]; j++) {
        boardCells[`${i}:${j}`] = {"style": "", "inBounds": true};
    }
}
let prevCell = null; //for showGlider
let orientations = ["NW", "NE", "SE", "SW"];
let curOrientation = 0;


//precondition: the board has not been made yet.
//postcondition: a horizontal and vertical line appear centered on the board.
function createQuadrantLines() {
    let board = document.getElementById("game-of-life");
    let padding = 10; //cell padding
    //vertical line
    let vl = document.createElement("div");
    vl.classList.add("vl");
    let height = (padding*2+1)*baseTableDim[1]; //each cell extends (2*10)px high from padding + 1px from border. 
    let xPos = padding*baseTableDim[0]; 
    vl.style.height = height+"px";
    vl.style["margin-left"] = xPos + "px";
    //horizontal line
    let hr = document.createElement("hr");
    let width = (padding*2+1)*baseTableDim[1];
    let yPos = padding*baseTableDim[0];
    hr.style["width"] = width + "px";
    hr.style["margin-top"] = yPos + "px";
    board.append(vl);
    board.append(hr);
}

function createBoard(r, c) {
    let board = document.getElementById("game-of-life");
    createQuadrantLines();
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

//precondition: cell position array of two integers [y, x] 
//postcondition: cell position array of two integers [x, y]
function swapCoordinates(coordinates) { //ex: [0, 1] becomes [1,0]; or [15, 3] becomes [3, 15]
    let newCoordinates = [];
    let newX = coordinates[1];
    let newY = coordinates[0];
    newCoordinates[0] = newX;
    newCoordinates[1] = newY;
    return newCoordinates;
}

//precondition: cell position array of two integers [x, y], boundary of the x quadrant, boundary of the y quadrant. 
//postcondition: boolean that is true if the given coordinates are in bounds and false otherwise.
function isCenterPosValid(pos, bX = boardWidth, bY = boardHeight) {
    return coordinate[0] > 0 && coordinate[1] > 0 && coordinate[0] < (bX -1) && coordinate[1] < (bY-1)
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
    if(val != null && typeof val != 'undefined') {
        return true
    }
    return false
}

//precondition: cell.id, which is a string with two coordinates separated by ","
//postcondition: cell position array of two integers [x, y]. NOTE: this needs to be swapped using the swapCoordinates function later since cells are currently positioned as [y, x] in the cell id.
function getCoordinatesFromCell(cellId) { 
    let cellNumbers = cellId.split(",");
    let cellX = parseInt(cellNumbers[0]);
    let cellY = parseInt(cellNumbers[1]);
    let clientCoordinates = [cellX, cellY];
    return clientCoordinates;
}

//precondition: center cell (td) of glider. optional: refresh boolean that creates a fake glider even if the mouse is still on the same cell (used for rotation).
//postcondition: a transparent glider appears centered on the mouse's current location.
//runs everytime the mouse moves to a new cell and creates transparent glider.
function showGlider(cell, refresh) {
    // if (prevCell != null && prevCell.id === cell.id && !refresh) {  
    //     return;
    // }
    // let cellId = cell.id;
    // let clientCoordinates = getCoordinatesFromCell(cellId);
    // let gliderPos = swapCoordinates(clientCoordinates);       
    // let newPositions = shared.makeGliderPos(gliderPos, orientations[curOrientation]);
    // prevCell = cell;
    // removeFakeGliders();
    // for (i = 0; i < newPositions.length; i++) { 
    //     let coordinates = newPositions[i]; 
    //     if (!areCoordinatesValid(coordinates)) {
    //         return;
    //     }
    // }
    // for (i = 0; i < newPositions.length; i++) {
    //     let coordinates = swapCoordinates(newPositions[i]);
    //     let cell = document.getElementById(coordinates[0] + "," + coordinates[1]);
    //     cell.classList.add("transparent");
    // }
}

function showGlider(cell) {
    if (prevCell != null && prevCell.id === cell.id && !refresh) {  
        return;
    }
    prevCell = cell;
    let coordinates = swapCoordinates(getCoordinatesFromCell(cell.id));
    if (transGlider === null) {
        transGlider = new Glider(coordinates, orientations["SW"]);
    }
    transGlider.setCenterPos(coordinates);
    let activeCells = transGlider.getActiveCoordinates()
    removeTransCells();
    for (i = 0; i < activeCells.length; i++) {
        let cellId = swapCoordinates(activeCells[i]);
        let cell = document.getElementById(cellId[0] + "," + cellId[1]);
        cell.classList.add("transparent");
    }
}

function placeGlider(cell) {
    console.log("glider placed");
    // let id = cell.id;
    // idArray = id.split(',');
    // let x = idArray[1];
    // let y = idArray[0];
    // let testPlayer = new Player("test", "background-color: black");
    // shared.makeGlider([Number(x), Number(y)], orientations[curOrientation], testPlayer);
}

function sendGliders() { //from server
    //console.log(cell);

    let id = cell.id;
    idArray = id.split(',');
    let x = idArray[1];
    let y = idArray[0];
    console.log("x: " + x + " y: " + y);
    removeFakeGliders(); 
    //let cells = rows[i].querySelectorAll("td");
    fetch("/gliders?x=" + x + "&y=" + y + "&orientation=" + orientations[curOrientation]).then(response => {
        updateBoard();
        return response.json();
    }).then(data => {
        cell.classList.add(data.orientation);
        console.log(data);
    });
}

//precondition: gamestate is such that the gliders should be placed.
//postcondition: onclick and onmousemove events are connected, which lets users see transparent gliders where their mouse is and click to place them.
function allowPlacement() {
    let game = document.getElementById("game-of-life");
    let rows = game.querySelectorAll("tr");
    for (let i = 0; i < rows.length; i++) {
        let cells = rows[i].querySelectorAll("td");
        for (let j = 0; j < cells.length; j++) {
            cells[j].onclick = function (e) { sendGlider(cells[j]) }
            cells[j].onmousemove = function (e) { showGlider(cells[j]) }
        }
    }
}
createBoard(boardWidth, boardHeight);
allowPlacement();

function hasGlider(cell) {
    let orientation = cell.className;
    if (orientation === "NW" || orientation === "NE" || orientation === "SW" || orientation === "SE") {
        return true;
    } else {
        return false;
    }
    //console.log(orientation);
}

function destroyGlider(cell) {
    console.log(cell);
    let id = cell.id;
    idArray = id.split(',');
    let x = parseInt(idArray[0]);
    let y = parseInt(idArray[1]);
    console.log(x, y);
    let game = document.getElementById("game-of-life");
    let rows = game.querySelectorAll("tr");
    game.rows[x - 1].cells[y - 1].style = "";
    game.rows[x - 1].cells[y].style = "";
    game.rows[x - 1].cells[y + 1].style = "";
    game.rows[x].cells[y - 1].style = "";
    game.rows[x].cells[y].style = "";
    game.rows[x].cells[y + 1].style = "";
    game.rows[x + 1].cells[y - 1].style = "";
    game.rows[x + 1].cells[y].style = "";
    game.rows[x + 1].cells[y + 1].style = "";
}

if (document.addEventListener) {
    document.addEventListener('contextmenu', function (e) {
        if (hasGlider(prevCell)) {
        destroyGlider(prevCell);
        } else {
        rotateGlider();
        showGlider(prevCell, true);
        }
        e.preventDefault();
    }, false);
}