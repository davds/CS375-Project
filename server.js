const express = require("express");
const app = express();
const port = 3000;
const hostname = "localhost";

app.use(express.json());
app.use(express.static("public_html"));

app.get("/", function (req,res) {
	res.status(200);
	res.setHeader('Content-Type', 'text/html');

  /*let dims = [50, 25];
  let tableBoard = "";
  for (let i = 0; i < dims[1]; i++) {
    tableBoard += "<tr>";
    for (let j = 0; j < dims[0]; j++) {
      tableBoard += "<td></td>";
    }
    tableBoard += "</tr>";
  }*/

  scripts = `<script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
            <script src="conway.js"></script>
            
            <script>
              initDisplayBoard();
              $('td').on('click', (e) => {
                $(e.target).toggleClass("dead");
                $(e.target).toggleClass("alive");
              }); 
              $('#go').on('click', (e) => {
                startSim();
              });
            </script>`

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
            .alive {
              background-color: #b860e0;
            }
            .dead {
              background-color: white;
            }
					</style>
				<body>
					<table id="game-of-life" style="margin: auto">
          </table>
          <input id="go" type="button" value="Go!" />
          ${scripts}
				</body>
				</html>`;
	
	res.end(html);
});

app.listen(port, hostname, function() {
  console.log(`Server listening on http://${hostname}:${port}`)
});