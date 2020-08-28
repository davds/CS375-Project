const pg = require("pg");
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
}


var methods = {    
    addWin: name => pool.query("UPDATE userData SET wins = wins + 1 WHERE username = $1", [name]),

    getWins: name => pool.query("SELECT wins FROM userData WHERE username = $1", [name]),
    
    addGamePlayed: name => pool.query("UPDATE userData SET gamesplayed = gamesplayed + 1 WHERE username = $1", [name]),

    getGamesPlayed: name => pool.query("SELECT gamesplayed FROM userData WHERE username = $1", [name]),
}


module.exports = new Database();
