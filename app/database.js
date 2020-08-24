let tempEnv = require("../env.json");
const { request, response } = require("express");
if (process.env._ && process.env._.indexOf("heroku"))
  tempEnv = require("../heroku.json");
const env = tempEnv;

const pg = require("pg");
const Pool = pg.Pool;
const pool = new Pool(env);

//const dbGetStyle = (name) => pool.query("SELECT style FROM userData WHERE username = $1", [name]).then(response => response.rows);

var methods = {
    setStyle: (name, style) => {pool.query("UPDATE userData SET style = $2 WHERE username = $1", [name, style])},

    getStyle: name => pool.query("SELECT style FROM userData WHERE username = $1", [name]),
    
    addWin: name => pool.query("UPDATE userData SET wins = wins + 1 WHERE username = $1", [name]),

    getWins: name => pool.query("SELECT wins FROM userData WHERE username = $1", [name]),
    
    addGamePlayed: name => pool.query("UPDATE userData SET gamesplayed = gamesplayed + 1 WHERE username = $1", [name]),

    getGamesPlayed: name => pool.query("SELECT gamesplayed FROM userData WHERE username = $1", [name]),
}



module.exports = methods;
