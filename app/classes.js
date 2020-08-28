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
	constructor(roomName, coords=[[0,99],[0,99]]) {
		this.roomName = roomName;
		this.players = {};
		this.activePieces = [];
		this.dimensions = {};
		this.setDimensions(coords);
	}
	getRoom() {
		return this.roomName;
	}
	getPlayers() {
		return this.players;
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
		delete players[id];
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
		this.dimensions["xMin"] = coords[0][0];
		this.dimensions["xMax"] = coords[0][1];
		this.dimensions["yMin"] = coords[1][0];
		this.dimensions["yMax"] = coords[1][1];
	}
	getDimensions() {
		return this.dimensions;
	}
}

exports.Player = Player;
exports.ActivePiece = ActivePiece;
