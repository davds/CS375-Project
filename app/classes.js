const database = require("./database.js");
let tempEnv = require("../env.json");
const { request, response } = require("express");
if (process.env._ && process.env._.indexOf("heroku"))
  tempEnv = require("../heroku.json");
const env = tempEnv;
database.connect(env);
class Player {
	constructor(id, style="", strength=0) {
		return (async () => {
			this.id = id;
			this.strength = strength;
			this.style = style;
			this.quadrant = 0;
			this.alive = true;
			if (style === "") {
				this.style = await database.loadStyle(this.id).then(response => {
					return response;
				});
			}
            return this;
        })();
	}
	getStyle() {
		return this.style;
	}
	setStyle(style) {
		this.style = style;
	}
	setQuadrant(quadrant) {
		this.quadrant = quadrant;
	}
	getQuadrant() {
		return this.quadrant;
	}
	setStrength(strength) {
		this.strength = strength;
	}
	getStrength() {
		return this.strength;
	}
	setCellsConquered(cell_num) {
		this.cellsConquered = cell_num;
	}
	getId() {
		return this.id;
	}
	getLiving() {
		return this.alive;
	}
	dead() {
		this.alive = false;
	}
}

class ActivePiece {
	constructor(pos, owner) {
		this.pos = pos;
		this.owner = owner;
	}
	getOwner() {
		return this.owner;
	}
	setOwner(owner) {
		this.owner = owner;
	}
	getStyle() {
		return this.owner.getStyle();
	}
	getPos() {
		return this.pos;
	}
}

class GameSession {
	constructor(roomName, closingCell) {
		return (async () => {
			this.roomName = roomName;
			this.players = {};
			this.activePieces = [];
			this.dimensions = {};
			this.setDimensions({"xMin":0,"xMax":99,"yMin":0,"yMax":99});
			this.livingPlayers = [];
			this.aliveLastRound = [];
			this.closingCell = closingCell;
			this.winners = [];
			this.glidersReceived = 0;
			this.obstacles = await new Player("board", "background-color: black;");
            return this;
        })();
		
	}
	getRoom() {
		return this.roomName;
	}
	getPlayers() {
		return this.players;
	}
	getLivingPlayers() {
		return this.livingPlayers;
	}
	setLivingPlayers() {
		this.aliveLastRound = this.livingPlayers;
		this.livingPlayers = [];
		for (let user in this.players) {
			if (this.players[user].getLiving()) {
				this.livingPlayers.push(user);
			}
		}
	}
	getAliveLastRound() {
		return this.aliveLastRound;
	}
	getPlayer(id) {
		return this.players[id];
	}
	addPlayer(player) {
		this.players[player.id] = player;
	}
	getNumPlayers() {
		return Object.keys(this.players).length;
	}
	removePlayer(id) {
		delete this.players[id];
	}
	playerIn(id) {
		return (id in this.players);
	}
	getActivePieces() {
		return this.activePieces;
	}
	addActivePiece(cell) {
		this.activePieces.push(cell);
	}
	clearActivePieces(cells) {
		this.activePieces.length = 0;
	}
	setDimensions(coords) {
		this.dimensions["xMin"] = coords["xMin"];
		this.dimensions["xMax"] = coords["xMax"];
		this.dimensions["yMin"] = coords["yMin"];
		this.dimensions["yMax"] = coords["yMax"];
	}
	getDimensions() {
		return this.dimensions;
	}
	getClosingCell() {
		return this.closingCell;
	}
	setWinners(winners) {
		this.winners = winners;
	}
	getWinners() {
		return this.winners;
	}
	addGlider() {
		this.glidersReceived += 1;
	}
	getGlidersReceived() {
		return this.glidersReceived;
	}
	getObstacles() {
		return this.obstacles;
	}

}

exports.Player = Player;
exports.ActivePiece = ActivePiece;
exports.GameSession = GameSession;
