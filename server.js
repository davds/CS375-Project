const express = require("express");
const { table } = require("console");
const app = express();
const port = 3000;
const hostname = "localhost";

app.use(express.json());

//Representation of game board
let activePieces = [];

//Precondish: duble with x, y coords of a cell
//Postcondish: If cell is alive, return owner, otherwise returns Null
function isAlive(pos) {
  for (let i = 0; i < activePieces.length; i++) {
    if (activePieces[i].getPos()[0] == pos[0] && activePieces[i].getPos()[1] == pos[1]) {
      return activePieces[i].getOwner()
    }   
  }
  return Null
}

//Precondish: array of current active cell objects
//Postcondish: array of the next generation of active cell objects
function nextGeneration(cells) {

}

//Precondish: duble with x, y coords of center of a glider, a string representing orientation of glider, and a player object
//Postcondish: doesn't return anything, adds appropriate active cells objects to active pieces array
function makeGlider(gliderPos, orientation, player) {

}

//GET handler for sending client a JSON body of active cell objects
app.get("/cells", function(req, res) {

});

//POST handler for recieving a JSON body of center coordinates for gliders and their orientations
app.post("/gliders", function(req, res) {

});

app.get("/", function (req,res) {
	res.status(200);
	res.setHeader('Content-Type', 'text/html');

  let dims = [60, 40];
  let tableBoard = "";
  for (let i = 0; i < dims[1]; i++) {
    tableBoard += "<tr>";
    for (let j = 0; j < dims[0]; j++) {
      tableBoard += "<td></td>";
    }
    tableBoard += "</tr>";
  }



	let html = `<!DOCTYPE html>
				<html>
					<head>
						<title>HW4</title>
					</head>
					<style>
						table {
              border-collapse: collapse;
              width: 90vw;
            }
            td {
              width: 2%;
              position: relative;
              text-align: center;
              padding: 10px;
            }
            td:after {
              content: '';
              display: block;
              margin-top: 100%;
            }
						table, th, td {
							border: 1px solid black;
						}
						.high-usage {
							background-color: red;
						}
					</style>
				<body>
					<table style="margin: auto">
						${tableBoard}
					</table>
				</body>
				</html>`;
	
	res.end(html);
});

app.listen(port, hostname, function() {
  console.log(`Server listening on http://${hostname}:${port}`)
});