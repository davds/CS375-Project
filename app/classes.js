class Player {
	constructor(id, style="", strength=0) {
		this.id = id;
		this.style = style;
		this.strength = strength;
		this.alive = true;
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
	constructor(roomName, closingCell, coords=[[0,99],[0,99]]) {
		this.colors = ["background-color: red;", "background-color: blue;", "background-color: green;", "background-color: yellow;"];
		this.roomName = roomName;
		this.players = {};
		this.activePieces = [];
		this.dimensions = {};
		this.setDimensions(coords);
		this.livingPlayers = [];
		this.aliveLastRound = [];
		this.closingCell = closingCell;
		this.winners = {};
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
		for (let id in players) {
			if (players[id].getLiving()) {
				this.livingPlayers.push(id);
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
		player.setStyle(this.colors[this.getNumPlayers()]);
		this.players[player.getId()] = player;
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
	getClosingCell() {
		return this.closingCell;
	}
	setWinners(winners) {
		this.winners = winners;
	}
	getWinners() {
		return this.winners;
	}

}

exports.Player = Player;
exports.ActivePiece = ActivePiece;
exports.GameSession = GameSession;
