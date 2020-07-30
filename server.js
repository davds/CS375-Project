const express = require("express");
const { table } = require("console");
const app = express();
const port = 3000;
const hostname = "localhost";

app.use(express.json());

app.get("/", function (req,res) {
	res.status(200);
	res.setHeader('Content-Type', 'text/html');

  let dims = [50, 25];
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
						<title>Conway's Game of Death</title>
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