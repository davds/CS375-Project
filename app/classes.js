class Player {
	constructor(id, style, strength=0) {
		this.id = id;
		this.style = style;
		this.strength = strength;
	}
	getStyle() {
		return this.style;
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
		this.players[player.getId()] = player;
	}
	getNumPlayers() {
		return this.players.length;
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
exports.GameSession = GameSession;
