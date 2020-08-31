const pg = require("pg");
const { response } = require("express");
const Pool = pg.Pool;

class Database {
  connect(env) {
    this.pool = new Pool(env);
    this.pool.on('error', err => {
      console.log("Failed to connect to Database.");
    });
  }

  setStyle(name, style) {
    this.pool.query("UPDATE userData SET style = $2 WHERE username = $1", [name, style]);
  }

  async loadStyle(name) {
    let style = await this.pool.query("SELECT style FROM userData WHERE username = $1", [name]).then(response => {
      return response.rows[0].style;
    });
    return style;
  }

  addWin(name) {
    this.pool.query("UPDATE userData SET wins = wins + 1 WHERE username = $1", [name]);
  }

  async getWins(name) {
    let wins = await this.pool.query("SELECT wins FROM userData WHERE username = $1", [name]).then(response => {
      return response.rows[0].wins;
    });
    return wins;
  }  
    
  addGamePlayed(name) {
    this.pool.query("UPDATE userData SET gamesplayed = gamesplayed + 1 WHERE username = $1", [name])
  }

  async getGamesPlayed(name) { 
    let games = await this.pool.query("SELECT gamesplayed FROM userData WHERE username = $1", [name]).then(response => {
      return response.rows[0].gamesplayed;
    });
    return games;
  }

  async getuserData() {
    let userData = await this.pool.query("SELECT * FROM userData ORDER BY wins").then(response => {
      return response.rows;
    });
    return userData;
  }
}

module.exports = new Database();
