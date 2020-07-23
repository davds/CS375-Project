const express = require("express");
const app = express();
const port = 3000;
const hostname = "localhost";

app.use(express.json());

app.listen(port, hostname, function() {
  console.log(`Server listening on http://${hostname}:${port}`)
});